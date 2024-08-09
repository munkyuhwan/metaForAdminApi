import React, { useState, useEffect, useRef, version } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DetailSettingWrapper, PaymentTextInput, PaymentTextLabel, PaymentTextWrapper, SelectCancelText, SelectCancelWrapper, SelectWrapper, SelectWrapperColumn, SettingButtonText, SettingButtonWrapper, SettingConfirmBtn, SettingConfirmBtnText, SettingConfirmBtnWrapper, SettingItemWrapper, SettingScrollView, SettingWrapper, StoreIDTextInput, StoreIDTextLabel, TableColumnInput, TableColumnTitle, TableColumnWrapper } from '../../styles/common/settingStyle';
import { Alert, DeviceEventEmitter, KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { getLastPaymentData, indicateAvailableDeviceInfo, serviceFunction, serviceGetting, serviceIndicate, servicePayment, serviceSetting, startSmartroCheckIntegrity, startSmartroGetDeviceInfo, startSmartroGetDeviceSetting, startSmartroKeyTransfer, startSmartroReadCardInfo, startSmartroRequestPayment, startSmartroSetDeviceDefaultSetting, varivariTest } from '../../utils/smartro';
import CodePush from 'react-native-code-push';
import PopupIndicator from '../common/popupIndicator';
import { IndicatorWrapper, PopupIndicatorText, PopupIndicatorWrapper, PopupSpinner } from '../../styles/common/popupIndicatorStyle';
import { PopupCloseButton, PopupCloseButtonWrapper } from '../../styles/common/popup';
import { openFullSizePopup } from '../../utils/common';
import { Picker } from '@react-native-picker/picker';
import { changeTableInfo, clearTableInfo, getTableList, initTableInfo, setTableInfo, tableInfoSlice } from '../../store/tableInfo';
import { SMARTRO_FUNCTION } from '../../resources/cardReaderConstant';
import { useSharedValue } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initOrderList } from '../../store/order';
import { setCartView } from '../../store/cart';
import { getAdminItems, initMenu, regularUpdate } from '../../store/menu';
import { CODE_PUSH_PRODUCTION, CODE_PUSH_SECRET } from '../../resources/apiResources';
import { KocesAppPay } from '../../utils/payment/kocesPay';
import { getAdminCategories } from '../../store/categories';
import { CURRENT_VERSION, releaseNote } from '../../resources/releaseNote';
import { isEmpty } from 'lodash'
import messaging from '@react-native-firebase/messaging';
import { EventRegister } from 'react-native-event-listeners';

const SettingPopup = () =>{

    const dispatch = useDispatch();
    const pickerRef = useRef();
    const [spinnerText, setSpinnerText] = React.useState("")
    const {tableList,tableInfo} = useSelector(state=>state.tableInfo);
    
    // store id, service id
    const [ipText, setIpText] = useState("");
    const [tableNo, setTableNo] = useState("");
    const [storeIdx, setStoreIdx] = useState("");
    // pay data
    const [bsnNo, setBsnNo] = useState("");
    const [tidNo, setTidNo] = useState("");
    const [serialNo, setSerialNo] = useState("");


    const displayOnAlert = (title, jsonResult) => {
        const objKeys = Object.keys(jsonResult)
        var str = "";
        for(var i=0; i<objKeys.length; i++) {
            str += `${objKeys[i]}: ${jsonResult[objKeys[i]]}\n`;
        }
        Alert.alert(
            title,
            str,
            [{
                text:'확인',
            }]
        )
    }

    const checkUpdate =  async() =>{
        CodePush
            const update = await CodePush.checkForUpdate(CODE_PUSH_PRODUCTION)
            .catch(err=>{
                console.log(err);
                Alert.alert(
                "업데이트",
                "업데이트를 진행할 수 없습니다.",
                [{
                    text:'확인',
                }]
                );
             return;});
            if(update) {
                Alert.alert(
                    "업데이트",
                    "앱 업데이트가 있습니다.",
                    [{
                        text:'확인',
                    }]
                )
                update
                .download((progress)=>{
                    setSpinnerText("업데이트 중...",progress,"%");
                })
                .then((newPackage)=>{
                    setSpinnerText("");
                    
                    newPackage
                    .install(CodePush.InstallMode.IMMEDIATE)
                    .then(()=>{CodePush.restartApp()});
                })
                .catch((err)=>{
                    console.log("download error-======================================================");
                    console.log(err)
                })

            }else {
                Alert.alert(
                    "업데이트",
                    "앱 업데이트가 없습니다.",
                    [{
                        text:'확인',
                    }]
                )
            } 
    } 
    function releaseTable() {
        dispatch(clearTableInfo());
    }

    const setTableInfo = (itemValue, itemNM, floor) =>{
        AsyncStorage.setItem("TABLE_INFO", itemValue);   
        AsyncStorage.setItem("TABLE_NM", itemNM);   
        AsyncStorage.setItem("TABLE_FLOOR",floor);
        dispatch(changeTableInfo({tableNo:itemValue}))
        displayOnAlert("테이블이 설정되었습니다.",{});
    }
    const Dropdown = () => {
        return (
            <SelectWrapper>
                <Picker
                    ref={pickerRef}
                    key={"tablePicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        if(!isEmpty(tableList)){
                            if(tableList?.length>0) {
                                const filteredItem = tableList.filter(el=>el.t_num == itemValue);
                                const itemNM = filteredItem[0]?.t_name;
                                const floor = filteredItem[0]?.floor;
                                //console.log("item changed:",itemValue)
                                
                                if(!isEmpty(itemValue)){
                                    setTableInfo(itemValue, itemNM,floor)
                                    dispatch(initOrderList());
                                    dispatch(setCartView(false));        
                                }                
                            }
                        }              
                    }}
                    selectedValue={tableInfo.tableNo}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {tableList?.map(el=>{
                        return(
                            <Picker.Item key={"_"+el.t_num}  label = {el.floor+"층 "+el.t_name} value ={el.t_num} />
                        )
                    })
                    }
                </Picker>
                <TouchableWithoutFeedback onPress={()=>{releaseTable();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>해제</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapper>
        );
    };

    useEffect(()=>{
        AsyncStorage.getItem("POS_IP")
        .then((value)=>{
            setIpText(value)
        })
        AsyncStorage.getItem("TABLE_INFO")
        .then((value)=>{
            setTableNo(value)
        })
        AsyncStorage.getItem("STORE_IDX")
        .then(value=>{
            setStoreIdx(value);
        })
        AsyncStorage.getItem("BSN_NO")
        .then((value)=>{
            setBsnNo(value)
        })
        AsyncStorage.getItem("TID_NO")
        .then((value)=>{
            setTidNo(value)
        })
        AsyncStorage.getItem("SERIAL_NO")
        .then(value=>{
            setSerialNo(value);
        })
    },[])


    const setStoreID = async () => {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"스토 어아이디 설정 중 입니다."})
        const prevStoreID = await AsyncStorage.getItem("STORE_IDX").catch(()=>{return null;});
        if(prevStoreID){      
            try{
               await messaging().unsubscribeFromTopic(prevStoreID);
            }catch(err){
                console.log("err:",err);
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                displayOnAlert(`${err}`,{});        
                return;    
            }
        }
        AsyncStorage.setItem("STORE_IDX",storeIdx);
        try {
            await messaging().subscribeToTopic(storeIdx)
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
            displayOnAlert("스토어 아이디가 설정되었습니다.",{});            
            dispatch(regularUpdate());
        }catch(err){
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
            displayOnAlert(`${err}`,{});            
            return;
        }
       

    }

    const deviceConnection = async () =>{
        var kocessStoreDownload = new KocesAppPay();
        await kocessStoreDownload.storeDownload();
        kocessStoreDownload.requestKoces()
        .then(async (result)=>{
            var kocesRenewKey = new KocesAppPay();
            await kocesRenewKey.keyRenew()
            kocesRenewKey.requestKoces()
            .then((keyRenewResult)=>{
                console.log("keyRenewResult: ",keyRenewResult);
                displayOnAlert("설정되었습니다.",{});
            })
            .catch((err)=>{
                displayOnAlert("설정할 수 없습니다.",{});
            })
        })
    }

    const updateMenuCateogires = () => {
        dispatch(getAdminCategories());
        dispatch(getAdminItems())
    }

    return (
        <>
            {tableInfo &&
            <KeyboardAvoidingView behavior="padding" enabled style={{width:'100%', height:'100%'}} >
                <SettingWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ openFullSizePopup(dispatch,{innerFullView:"", isFullPopupVisible:false}); }}>
                            <PopupCloseButtonWrapper>
                                <PopupCloseButton source={require('../../assets/icons/close_red.png')}/>
                            </PopupCloseButtonWrapper>
                    </TouchableWithoutFeedback>
                    <SettingScrollView showsVerticalScrollIndicator={false}>
                        <SettingButtonWrapper>
                             <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >스토어 ID</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    {/* <StoreIDTextLabel style={{fontSize:30, fontWeight:"bold"}} >{storeIdx}</StoreIDTextLabel> */}
                                    <StoreIDTextInput  defaultValue={storeIdx} onChangeText={(val)=>{ setStoreIdx(val); }} />
                                    <TouchableWithoutFeedback onPress={()=>{setStoreID();}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>스토어 ID 저장</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                               
                            </SettingItemWrapper>

                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >아이피 정보</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    <StoreIDTextLabel>IP:{ipText}</StoreIDTextLabel>
                                </SelectWrapper>
                            </SettingItemWrapper>
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >카드 단말기 정보</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20, flexDirection:'column'}} >
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>사업자 번호: {bsnNo}</StoreIDTextLabel>                                       
                                    </View>
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>TID: {tidNo}</StoreIDTextLabel>
                                    </View>
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>serialNo: {serialNo}</StoreIDTextLabel>
                                    </View>
                                </SelectWrapper>
                            </SettingItemWrapper>
                            <TouchableWithoutFeedback onPress={()=>{deviceConnection();  }} >
                                <SettingButtonText isMargin={true} >단말기 연결 체크</SettingButtonText>
                            </TouchableWithoutFeedback>

                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >테이블 세팅</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <Dropdown/>
                            </SettingItemWrapper>
                            
                            <TouchableWithoutFeedback onPress={()=>{updateMenuCateogires()}} >
                                <SettingButtonText isMargin={true} >메뉴 갱신</SettingButtonText>
                            </TouchableWithoutFeedback>

                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{checkUpdate();}} >
                                    <SettingButtonText>앱 업데이트 하기</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20, flexDirection:'column'}} >
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>{`ver ${CURRENT_VERSION} 수정내역\n${releaseNote[CURRENT_VERSION]}`}</StoreIDTextLabel>                                       
                                    </View>
                                </SelectWrapper>
                            </SettingItemWrapper>

                        </SettingButtonWrapper>
                    </SettingScrollView>
                </SettingWrapper>

                {(spinnerText!="")&&
                    <PopupIndicatorWrapper style={{right:0, position:'absolute', width:'104%', height:'104%'}}>
                        <IndicatorWrapper>
                            <PopupSpinner size={'large'}/>
                            <PopupIndicatorText>{spinnerText}</PopupIndicatorText>
                        </IndicatorWrapper>
                    </PopupIndicatorWrapper>
                }
            </KeyboardAvoidingView>
            }
        </>
    )
}
export default SettingPopup;
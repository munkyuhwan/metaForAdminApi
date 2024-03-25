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
import { getStoreInfo } from '../../utils/api/metaApis';
import { getMenuState, initMenu } from '../../store/menu';
import { CODE_PUSH_PRODUCTION, CODE_PUSH_SECRET } from '../../resources/apiResources';
import { KocesAppPay } from '../../utils/payment/kocesPay';

const SettingPopup = () =>{

    const dispatch = useDispatch();
    const pickerRef = useRef();
    const functionPickerRef = useRef();
    const functionTestPickerRef = useRef();
    const functionPaymentPickerRef = useRef();

    const [spinnerText, setSpinnerText] = React.useState("")
    const {tableList,tableInfo} = useSelector(state=>state.tableInfo);
    const [isTableSettingShow, setTableSettingShow] = useState(false);
    
    //const selectedFunction = useSharedValue("");
    //const selectedFunctionTest = useSharedValue("");
    const [selectedFunction, setSelectedFunction] = useState("");
    const [selectedFunctionTest, setSelectedFunctionTest] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const paymentAmount = useSharedValue(0);
    const paymentApprovalNo = useSharedValue("");
    const paymentApprovalDate = useSharedValue("");
    const [lastPayData, setLastPayData] = useState("");
    // store id, service id
    const [ipText, setIpText] = useState("");
    const [floor, setFloor] = useState(0);
    const [tableNo, setTableNo] = useState("");
    const [storeIdx, setStoreIdx] = useState("");
    // pay data
    const [bsnNo, setBsnNo] = useState("");
    const [tidNo, setTidNo] = useState("");
    const [serialNo, setSerialNo] = useState("");


    const getIndicateAvailableDeviceInfo = () =>{
        serviceIndicate()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("사용가능 디바이스 정보",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceSetting = () =>{
        serviceSetting()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("디바이스 설정",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceGetting = () =>{
        serviceGetting()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("디바이스 설정값",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceFunction = () => {
        const data = {};
        data[selectedFunction] = selectedFunctionTest;
        serviceFunction(data)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("서비스 기능",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServicePayment = (paymentData) => {
        servicePayment(dispatch, paymentData)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("서비스 기능",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroGetLastPaymentData = () =>{
        getLastPaymentData(dispatch)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            const objKeys = Object.keys(jsonResult)
            var str = "";
            for(var i=0; i<objKeys.length; i++) {
                str += `${objKeys[i]}: ${jsonResult[objKeys[i]]}\n`;
            }
            setLastPayData(str);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }

    const uploadLog = () => {

    }
    const initTable = () => {
        AsyncStorage.removeItem("orderResult")
        AsyncStorage.getItem("orderResult").then(result=>console.log("Resutl: ",result))
    }

    // 여러가지 테스트
    const variousTest = () => {
        varivariTest()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            console.log(jsonResult);
            displayOnAlert("여러가지 결제 결과",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }

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
            .catch(err=>{console.log(err);
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

    const ServiceDropDown = () => {
        return (
            <SelectWrapper>
                <Picker
                    ref={functionPickerRef}
                    key={"functionPicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        //selectedFunction.value = itemValue;
                        setSelectedFunction(itemValue);
                    }}
                    selectedValue={selectedFunction}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {
                        SMARTRO_FUNCTION.map((el,index)=>{
                            return(
                                <Picker.Item key={index+"_"+el.key}  label = {el.label} value ={el.key} />
                            )
                        })
                    }
                </Picker>
                <Picker
                    ref={functionTestPickerRef}
                    key={"functionPicker2"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        //selectedFunctionTest.value = (itemValue);
                        setSelectedFunctionTest(itemValue);
                    }}
                    selectedValue={selectedFunctionTest}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {
                        SMARTRO_FUNCTION.filter(el=>el.key==selectedFunction)[0]?.data?.map((el,index)=>{
                            return(
                                <Picker.Item key={index+"_"+el.value}  label = {el.label} value ={el.value} />
                            )
                        })
                    }
                </Picker>
                <TouchableWithoutFeedback onPress={()=>{smartroServiceFunction();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>확인</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapper>
        );
    }

    const setTableInfo = (itemValue, itemNM) =>{
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
                        
                            const filteredItem = tableList.filter(el=>el.TBL_NO == itemValue);
                            const itemNM = filteredItem[0]?.TBL_NM;
                            setTableInfo(itemValue, itemNM)
                            dispatch(initOrderList());
                            dispatch(setCartView(false));
                            displayOnAlert("수정되었습니다.",[]);
                        
                    }}
                    selectedValue={tableInfo}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {tableList?.map(el=>{
                         
                        return(
                            <Picker.Item key={"_"+el.TBL_NO}  label = {el.FLOOR_NM+" "+el.TBL_NM} value ={el.TBL_NO} />
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

    const PaymentDropdown = () => {
        return (
            <SelectWrapperColumn>
                <Picker
                    ref={functionPaymentPickerRef}
                    key={"paymentPicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        setPaymentType(itemValue);
                    }}
                    selectedValue={paymentType}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                    <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    <Picker.Item key={"approval"} label = {"결제"} value ={"approval"} />
                    <Picker.Item key={"cancellation"} label = {"취소"} value ={"cancellation"} />
                </Picker>
                
                <PaymentTextWrapper>
                    <PaymentTextLabel>금액:</PaymentTextLabel>
                    <PaymentTextInput keyboardType='numeric' defaultValue={paymentAmount.value} onChangeText={(val)=>{paymentAmount.value=val; }} />
                </PaymentTextWrapper>
                {paymentType=="cancellation" &&
                    <>
                        <PaymentTextWrapper>
                            <PaymentTextLabel>승인번호:</PaymentTextLabel>
                            <PaymentTextInput keyboardType='numeric' defaultValue={paymentApprovalNo.value} onChangeText={(val)=>{paymentApprovalNo.value=val;}} />
                        </PaymentTextWrapper>
                        <PaymentTextWrapper>
                            <PaymentTextLabel>승인일자(YYMMDD):</PaymentTextLabel>
                            <PaymentTextInput keyboardType='numeric' maxLength={6} defaultValue={paymentApprovalDate.value}  onChangeText={(val)=>{paymentApprovalDate.value=val}} />
                        </PaymentTextWrapper>
                    </>
                }
                <TouchableWithoutFeedback onPress={()=>{
                    if(paymentType == "approval") {
                        smartroServicePayment({"deal":paymentType,"total-amount":paymentAmount.value});
                    }
                    else if(paymentType == "cancellation"){
                        smartroServicePayment({"deal":paymentType,"total-amount":paymentAmount.value,"approval-no":paymentApprovalNo.value,"approval-date":paymentApprovalDate.value});
                    }
                    
                    }}>
                    <SelectCancelWrapper>
                        <SelectCancelText>실행</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
                <PaymentTextWrapper>
                    <PaymentTextLabel>{lastPayData}</PaymentTextLabel>
                </PaymentTextWrapper>
                <TouchableWithoutFeedback onPress={()=>{smartroGetLastPaymentData();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>마지막 결제 정보</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapperColumn>
        );
    }

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
    useEffect(()=>{
        dispatch(getTableList({floor:floor}));

    },[floor])


    const setStoreInfo = () =>{
        AsyncStorage.setItem("POS_IP", ipText);   
        displayOnAlert("설정되었습니다.",{});
    }

    const setPayData = async () => {
        await AsyncStorage.setItem("BSN_NO", bsnNo);   
        await AsyncStorage.setItem("TID_NO", tidNo);   
        await AsyncStorage.setItem("SERIAL_NO", serialNo);   
        displayOnAlert("설정되었습니다.",{});
    }

    const getStoreID = () => {
        getStoreInfo()
        .then(result=>{
            displayOnAlert(`${result}`,{});
            if(result) {
                const STORE_IDX = result.STORE_IDX;
                AsyncStorage.getItem("STORE_IDX")
                .then((storeInfo)=>{
                    //if(storeInfo==null) {
                        setStoreIdx(STORE_IDX);
                        AsyncStorage.setItem("STORE_IDX",STORE_IDX);
                        displayOnAlert("스토어 아이디가 설정되었습니다.",{});
                    //}
                })
                .catch(err=>{
                    displayOnAlert("저장값 오류.",{});

                })

            }
        })
        .catch((err)=>{
            displayOnAlert("스토어 아이디를 받아올 수 없습니다."+err,{});
        })
    }

    const setStoreID = () => {
        AsyncStorage.setItem("STORE_IDX",storeIdx);
        displayOnAlert("스토어 아이디가 설정되었습니다.",{});            
    }

    const deviceConnection = async () =>{
        var kocessStoreDownload = new KocesAppPay();
        await kocessStoreDownload.storeDownload();
        kocessStoreDownload.requestKoces()
        .then(result=>{
            var kocesRenewKey = new KocesAppPay();
            kocesRenewKey.keyRenew()
            .then((result)=>{
                displayOnAlert("설정되었습니다.",{});
            })
            .catch((err)=>{
                displayOnAlert("설정할 수 없습니다.",{});
            })
        })

    }

    return (
        <>
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

                                    <TouchableWithoutFeedback onPress={()=>{getStoreID();}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>스토어 ID받기</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>{setStoreID();}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>스토어 ID 직접입력</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                               
                            </SettingItemWrapper>

                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >아이피 설정</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    <StoreIDTextLabel>IP:</StoreIDTextLabel>
                                    <StoreIDTextInput keyboardType='numeric'  defaultValue={ipText} onChangeText={(val)=>{ setIpText(val); }} />
                                    <TouchableWithoutFeedback onPress={()=>{setStoreInfo();}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>설정하기</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                            </SettingItemWrapper>
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} > 결제 설정</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20, flexDirection:'column'}} >
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>사업자 번호:</StoreIDTextLabel>
                                        <StoreIDTextInput   defaultValue={bsnNo} onChangeText={(val)=>{ setBsnNo(val); }} />
                                       
                                    </View>
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>TID:</StoreIDTextLabel>
                                        <StoreIDTextInput   defaultValue={tidNo} onChangeText={(val)=>{ setTidNo(val); }} />
                                    </View>
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <StoreIDTextLabel>serialNo:</StoreIDTextLabel>
                                        <StoreIDTextInput   defaultValue={serialNo} onChangeText={(val)=>{ setSerialNo(val); }} />
                                        <TouchableWithoutFeedback onPress={()=>{ setPayData(); }}>
                                            <SelectCancelWrapper>
                                                <SelectCancelText>설정하기</SelectCancelText>
                                            </SelectCancelWrapper>
                                        </TouchableWithoutFeedback>
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
                                <SelectWrapper>
                                    <StoreIDTextLabel>층 입력:</StoreIDTextLabel><StoreIDTextInput keyboardType='numeric'  defaultValue={floor} onChangeText={(val)=>{ setFloor(val); }} />
                                </SelectWrapper>
                                    <Dropdown/>
                                    {/* 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    <StoreIDTextLabel>테이블 번호:</StoreIDTextLabel>
                                    <StoreIDTextInput keyboardType='numeric'  defaultValue={tableNo} onChangeText={(val)=>{ setTableNo(val); }} />
                                    <TouchableWithoutFeedback onPress={()=>{setTableInfo()}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>설정하기</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                                    */}
                                {/* 
                                <StoreIDTextLabel>테이블 번호:</StoreIDTextLabel>
                                <StoreIDTextInput keyboardType='numeric'  defaultValue={tableNo} onChangeText={(val)=>{ setTableNo(val); }} />
                                    
                                <TouchableWithoutFeedback onPress={()=>{ dispatch(getTableList()); setTableSettingShow(!isTableSettingShow) }} >
                                    <SettingButtonText isMargin={false} >테이블 세팅</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <Dropdown/> 
                                 */}
                            </SettingItemWrapper>
                            {/* 
                            <TouchableWithoutFeedback onPress={()=>{checkTableOrder(dispatch,{tableInfo})}} >
                                <SettingButtonText isMargin={true} >테이블 상태</SettingButtonText>
                            </TouchableWithoutFeedback> 
                            <TouchableWithoutFeedback onPress={()=>{cancelOrder(dispatch,{tableInfo})}} >
                                <SettingButtonText isMargin={true} >주문취소</SettingButtonText>
                            </TouchableWithoutFeedback>  
                            <TouchableWithoutFeedback onPress={()=>{getIndicateAvailableDeviceInfo();}} >
                                <SettingButtonText isMargin={true} >단말기 서비스 확인</SettingButtonText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{smartroServiceSetting();}} >
                                <SettingButtonText isMargin={true} >단말기 서비스 설정하기</SettingButtonText>
                            </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{smartroServiceGetting();}} >
                                    <SettingButtonText isMargin={true} >단말기 서비스 설정 확인</SettingButtonText>
                                </TouchableWithoutFeedback>
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{}} >
                                    <SettingButtonText isMargin={false} >단말기 서비스 기능</SettingButtonText>
                                </TouchableWithoutFeedback>
                                <ServiceDropDown/>
                            </SettingItemWrapper>
                            <SettingItemWrapper>    
                                <TouchableWithoutFeedback onPress={()=>{}} >
                                    <SettingButtonText isMargin={false} >단말기 결제 기능</SettingButtonText>
                                </TouchableWithoutFeedback>
                                <PaymentDropdown/>
                            </SettingItemWrapper>
                            <TouchableWithoutFeedback onPress={()=>{initTable(); }} >
                                <SettingButtonText isMargin={true} >테이블 주문 초기화</SettingButtonText>
                            </TouchableWithoutFeedback>
                           
                            <TouchableWithoutFeedback onPress={()=>{uploadLog(); }} >
                                <SettingButtonText isMargin={true} >로그 올리기</SettingButtonText>
                            </TouchableWithoutFeedback>
                            */}
                            
                            <TouchableWithoutFeedback onPress={()=>{dispatch(getMenuState());}} >
                                <SettingButtonText isMargin={true} >메뉴 업데이트 여부 체크</SettingButtonText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{dispatch(initMenu());}} >
                                <SettingButtonText isMargin={true} >화면 업데이트</SettingButtonText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{checkUpdate();}} >
                                <SettingButtonText isMargin={true} >앱 업데이트 ver 2.0.3</SettingButtonText>
                            </TouchableWithoutFeedback> 
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
        </>
    )
}
export default SettingPopup;
import { useDispatch, useSelector } from "react-redux";
import { FloatingBackgroundInnerdWrapper, FloatingBackgroundWrapper, FloatingImg, FloatingWrapper } from "../../styles/popup/floatingButtonPopupStyle";
import { useCallback, useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import { RADIUS_DOUBLE } from "../../styles/values";
import { Animated, Dimensions, TouchableWithoutFeedback, View } from "react-native";
import { addToOrderList, addToQuickOrderList, adminDataPost, initToQuickOrderList, postLog, postOrderToPos, setQuickShow } from "../../store/order";
import { setItemDetail } from "../../store/menuDetail";
import {isEmpty, isEqual} from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import { setLastOrderItem } from "../../store/tableInfo";
import { EventRegister } from "react-native-event-listeners";
import { setQickOrder, setQuickOrder } from "../../store/cart";
import { QuickMenuItemBottomWRapper, QuickMenuItemName, QuickMenuItemPrice, QuickMenuItemWrapper, QuickOrderWrapper, QuickTopMenuWrapper } from "../../styles/popup/quickOrderPopupStyle";
import { FlatList } from "react-native-gesture-handler";
import MenuItem from "../mainComponents/menuItem";
import { MenuImageDefault, MenuImageDefaultWrapper, MenuItemBottomWRapper, MenuItemButton, MenuItemButtonInnerWrapperLeft, MenuItemButtonInnerWrapperRight, MenuItemButtonWrapper, MenuItemHotness, MenuItemHotnessWrapper, MenuItemImageWrapper, MenuItemName, MenuItemPrice, MenuItemSpiciness, MenuItemTopWrapper, MenuItemWrapper } from "../../styles/main/menuListStyle";
import { getDeviceInfo, getStoreID, isAvailable, isNetworkAvailable, itemEnableCheck, numberWithCommas } from "../../utils/common";
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from "../../styles/main/detailStyle";
import { LANGUAGE } from '../../resources/strings';
import { colorRed } from "../../assets/colors/color";
import { CategorySelected, FloatingCategorySelected, FloatingTopMenuText, TopMenuText, TopMenuWrapper } from "../../styles/main/topMenuStyle";
import { displayErrorNonClosePopup, displayErrorPopup } from "../../utils/errorHandler/metaErrorHandler";
import { getPosStoreInfo, getTableAvailability } from "../../utils/api/metaApis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { callApiWithExceptionHandling } from "../../utils/api/apiRequest";
import { ADMIN_API_BASE_URL, ADMIN_API_MENU_UPDATE } from "../../resources/newApiResource";
import { setMonthPopup, setSelectedMonth } from "../../store/monthPopup";
import { getAdminCategories } from "../../store/categories";
import { getAdminItems, regularUpdate } from "../../store/menu";
import { getAD } from "../../store/ad";
import { getAdminBulletin } from "../../store/menuExtra";
import { KocesAppPay } from "../../utils/payment/kocesPay";
import { metaPostPayFormat } from "../../utils/payment/metaPosDataFormat";
import { PAY_SEPRATE_AMT_LIMIT } from "../../resources/defaults";
import { TransparentPopupTopWrapper, TransparentQuickOrderTopWrapper, TransperentPopupTopSubTitle, TransperentPopupTopTitle, TransperentQuickOrderTopSubTitle } from "../../styles/common/popup";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const FloatingBtn = (props) => {

    const dispatch = useDispatch();

    const {language} =  useSelector(state=>state.languages);
    const {lastOrderItem} = useSelector(state => state.tableInfo);
    const {allItems} = useSelector(state=>state.menu);
    const {images} = useSelector(state=>state.imageStorage);
    const {quickOrderList, isQuickShow} = useSelector(state=>state.order);
    const {isMonthSelectShow, monthSelected} = useSelector(state=>state.monthSelect)
    const [totalAmt, setTotalAmt] = useState();
    const { tableStatus } = useSelector(state=>state.tableInfo);

    useEffect(()=>{
        if(quickOrderList.length>0) {
            doPayment();
        }
    },[quickOrderList])
    useEffect(()=>{
        if(!isMonthSelectShow) {
            if(totalAmt>0) {
                if(monthSelected!="") {
                    makePayment();
                    dispatch(setSelectedMonth(""));
                }else {
                    // 할부선택 취소
                    //console.log("할부 선택 취소");
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                }
            }
        }

    },[isMonthSelectShow,monthSelected])

    async function makeLastOrder(item) {
        console.log("makeLastOrder =========================");
        console.log("item?.prod_gb: ",item?.prod_gb);
        setTotalAmt(item?.sal_tot_amt);
        if(item?.prod_gb=="09"||item?.prod_gb=="02"){
            //props?.setDetailShow(true);  
            dispatch(setItemDetail({itemID:item.prod_cd}));
        } else { 
            await dispatch(addToQuickOrderList({isAdd:true, isDelete: false, item:item,menuOptionSelected:[]}));
            //doPayment();
            //dispatch(setQuickOrder(true));
        } 
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});    

    }
    const InitFunction = async() =>{
        // 카테고리 받기
        await dispatch(getAdminCategories());
        // 메뉴 받아오기
        await dispatch(getAdminItems());
        //EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        // 기기 정보 받기
        getDeviceInfo();
        // 광고 받기
        dispatch(getAD());
        dispatch(regularUpdate());
        dispatch(getAdminBulletin());
    }

    const makePayment = async () =>{
            if( tableStatus?.now_later == "선불") {
                const bsnNo = await AsyncStorage.getItem("BSN_NO");
                const tidNo = await AsyncStorage.getItem("TID_NO");
                const serialNo = await AsyncStorage.getItem("SERIAL_NO");
                if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
                    displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
                    return;
                }
                const orderData = await metaPostPayFormat(quickOrderList,{}, allItems);
                console.log("order data: ",orderData);
                if(orderData) {
                    var payAmt = 0;
                    var vatAmt = 0;
                    for(var i=0;i<orderData.ITEM_INFO.length;i++) {
                        payAmt = payAmt + (Number(orderData.ITEM_INFO[i].ITEM_AMT) - Number(orderData.ITEM_INFO[i].ITEM_VAT))
                        vatAmt = vatAmt + Number(orderData.ITEM_INFO[i].ITEM_VAT);
                        const setItems = orderData.ITEM_INFO[i].SETITEM_INFO;
                        for(var j=0;j<setItems.length;j++) {
                            payAmt = payAmt + (Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].AMT) - Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].VAT))
                            vatAmt = vatAmt + Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].VAT)
                        }                        
                    }
                    console.log("payAmt: ",payAmt);
                    const amtData = {amt:payAmt, taxAmt:vatAmt, months:monthSelected, bsnNo:bsnNo,termID:tidNo }
                    //console.log("amtData: ",amtData);
                    var kocessAppPay = new KocesAppPay();
                    kocessAppPay.requestKocesPayment(amtData)
                    .then(async (result)=>{ 
                        
                        // 결제 진행끝이다.
                        
                        console.log("result: ",result);
                        const orderData = await metaPostPayFormat(quickOrderList,result, allItems);
                        dispatch(postLog({payData:result,orderData:orderData}))
                        dispatch(postOrderToPos({isQuick:true,payData:result,orderData:orderData, isMultiPay:false}));
                        dispatch(adminDataPost({payData:result,orderData:orderData}));
                        dispatch(initToQuickOrderList([]));
                    })
                    .catch((err)=>{
                        // 결제 진행끝이다.
                        
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        dispatch(postLog({payData:err,orderData:null}))
                        displayErrorPopup(dispatch, "XXXX", err?.Message)
                    })
                }
            }else {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                const orderData = await metaPostPayFormat(quickOrderList,{}, allItems);
                dispatch(adminDataPost({payData:null,orderData:orderData}));
                dispatch(postOrderToPos({isQuick:true,payData:null,orderData:orderData, isMultiPay:false}));
                dispatch(initToQuickOrderList([]));

            }
    }
    const doPayment = async () =>{
        console.log("do payment")
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"주문 중 입니다."});
        const isPostable = await isNetworkAvailable()
        .catch(()=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            return false;
        });
        if(!isPostable) {
            displayErrorNonClosePopup(dispatch, "XXXX", "인터넷에 연결할 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            return;
        }

        const storeInfo = await getPosStoreInfo()
        .catch((err)=>{
            displayErrorNonClosePopup(dispatch, "XXXX", "상점 정보를 가져올 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); 
            
            return;
        })
        // 개점정보 확인
        if(!storeInfo?.SAL_YMD) {
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            displayErrorPopup(dispatch, "XXXX", "개점이 되지않아 주문을 할 수 없습니다.");
            
        }else {
            //테이블 주문 가능한지 체크            
            const tableAvail = await getTableAvailability(dispatch)
            .catch(()=>{
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                return [];
            });
            if(!tableAvail) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                
            }else {
                const {STORE_IDX} = await getStoreID();
                const lastUpdateDate = await AsyncStorage.getItem("lastUpdate").catch(err=>"");   
                /// 카트메뉴 주문 가능 여부 체크
                const isItemOrderble = await itemEnableCheck(STORE_IDX,quickOrderList).catch(err=>{ return{isAvailable:false, result:null} } );
                if(isItemOrderble?.isAvailable == false) {
                    if(isItemOrderble?.result == null) {
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                        displayErrorPopup(dispatch, "XXXX", "수량을 체크할 수 없어 주문을 할 수 없습니다.");
                        
                        return;
                    }else {
                        const itemsUnavailable = isItemOrderble?.result[0]?.unserviceable_items;
                        var itemString = "";
                        if(itemsUnavailable?.length>0) {
                            for(var i=0;i<itemsUnavailable.length;i++) {
                                var itemName = ItemOptionTitle(itemsUnavailable[i]);
                                itemString = itemString+itemName+(i<itemsUnavailable.length-1?", ":"")
                            }
                            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                            displayErrorPopup(dispatch, "XXXX", itemString+"메뉴는 매진되어 주문을 할 수 없습니다.");
                            
                            return;
                        }
                    }
                }                
                try {
                    const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_MENU_UPDATE}`,{"STORE_ID":`${STORE_IDX}`,"currentDateTime":lastUpdateDate}, {});
                    if(data) {
                        if(data?.result==true) {
                            if(data?.isUpdated == "true") {
                                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                                
                                //displayErrorPopup(dispatch, "XXXX", "메뉴 업데이트가 되었습니다.\n업데이트 후에 주문 해 주세요.");
                                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"메뉴 업데이트가 되었습니다.\n업데이트를 진행합니다."});
                                InitFunction();
                               
                            }else {

                                if( tableStatus?.now_later == "선불") {
                                    if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                        dispatch(setMonthPopup({isMonthSelectShow:true}))
                                    }else {
                                        makePayment();
                                    }
                                }else {
                                    makePayment();
                                }
                            }
                        }else {
                            if( tableStatus?.now_later == "선불") {
                                if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                    dispatch(setMonthPopup({isMonthSelectShow:true}))
                                }else {
                                    makePayment();
                                }
                            }else {
                                makePayment();
                            }
                        }
                    }else {
                        if( tableStatus?.now_later == "선불") {
                            if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                dispatch(setMonthPopup({isMonthSelectShow:true}))
                                
                            }else {
                                makePayment();
                            }
                        }else {
                            makePayment();
                        }
                    }
                } catch (error) {
                    // 예외 처리
                    if( tableStatus?.now_later == "선불") {
                        if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                            dispatch(setMonthPopup({isMonthSelectShow:true}))
                            
                        }else {
                            makePayment();
                        }
                    }else {
                        makePayment();
                    }   
                }
            }
        }
    }

    const QuickItem = (props) =>{ 
        const item = props?.item;
        const quickItem = images.filter(el=>el.name==item.prod_cd);
        const itemTitle = () => {
            let selTitleLanguage = "";
                if(language=="korean") {
                    selTitleLanguage = item.gname_kr;
                }
                else if(language=="japanese") {
                    selTitleLanguage = item?.gname_jp;
                }
                else if(language=="chinese") {
                    selTitleLanguage = item?.gname_cn;
                }
                else if(language=="english") {
                    selTitleLanguage = item?.gname_en;
                }
            
            return selTitleLanguage;
        }
        const imgUrl = item?.gimg_chg;
        const itemPrice= Number(item.sal_tot_amt);

        return(
            <>
                <QuickMenuItemWrapper>
                    <MenuItemTopWrapper>
                        {imgUrl &&
                        <TouchableWithoutFeedback onPress={()=>{ makeLastOrder(item); }} >
                            {/* <FastImage style={{ width:170,height:height*0.2, borderRadius:RADIUS_DOUBLE}} source={{uri:quickItem[0]?.imgData}} resizeMode={FastImage.resizeMode.cover} /> */}
                            <FastImage style={{ width:'100%',height:height*0.23, borderRadius:RADIUS_DOUBLE}} source={{uri:item?.gimg_chg}} resizeMode={FastImage.resizeMode.cover} />
                        </TouchableWithoutFeedback>
                        }
                        {!imgUrl &&
                            <TouchableWithoutFeedback onPress={()=>{makeLastOrder(item); }} >
                                <MenuImageDefaultWrapper>
                                    <MenuImageDefault source={require("../../assets/icons/logo.png")}/>
                                </MenuImageDefaultWrapper>
                            </TouchableWithoutFeedback>
                        }
                    <MenuItemImageWrapper>
                        <MenuItemHotnessWrapper>
                            {item?.is_new=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/new_menu.png')} />
                            }
                            {item?.is_best=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/best_menu.png')} />
                            }
                            {item?.is_on=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/hot_menu.png')} />
                            }
                        </MenuItemHotnessWrapper>

                    <MenuItemButtonWrapper>
                            {
                                item.spicy == "1" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "1.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "3" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "HOT" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/hot_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "COLD" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/cold_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                        </MenuItemButtonWrapper>
                        
                    </MenuItemImageWrapper>

                    {item?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    {(item?.sale_status!='3'&&!isAvailable(item)) &&
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>준비중</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    </MenuItemTopWrapper>
                    <QuickMenuItemBottomWRapper>
                            <QuickMenuItemName>{itemTitle()||item.gname_kr}</QuickMenuItemName>
                        <QuickMenuItemPrice>{numberWithCommas(itemPrice)}원</QuickMenuItemPrice>
                    </QuickMenuItemBottomWRapper>

                </QuickMenuItemWrapper>
            </>
        )
    }

    if(isQuickShow==false ) {
        return(<></>)
    }
    
    if(lastOrderItem?.length<=0) {
        return(<></>)
    }

    return(
        <>
        <View style={{width:'100%',height:'100%',position:'absolute'}}>
            <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'rgba(0,0,0,0.3)'}} ></View>
            <QuickTopMenuWrapper>
                <FloatingCategorySelected isSelected={true} >
                    <FloatingTopMenuText key={"subcatText_"} >{"논스톱 주문"}</FloatingTopMenuText>
                </FloatingCategorySelected>
            </QuickTopMenuWrapper>
            <QuickOrderWrapper>
                <TransparentQuickOrderTopWrapper>
                    <TransperentQuickOrderTopSubTitle>{LANGUAGE[language]?.etc.quickOrder}</TransperentQuickOrderTopSubTitle>
                </TransparentQuickOrderTopWrapper>     
                <FlatList
                    style={{height:'100%', zIndex: 99, paddingBottom:10,flex:1}}
                    data={lastOrderItem}
                    horizontal={true}
                    numColumns={1}
                    renderItem={({item, index})=>{ 
                        return(
                        <>
                            <QuickItem
                                item={item}
                            />
                        </>
                        ); 
                    }}
                />

                <BottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ dispatch(setQuickShow(false)); }}>
                        <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.popup.closeTitle}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>
            </QuickOrderWrapper>
        </View>

        </>
    )

}

export default FloatingBtn;
import React, { useEffect, useRef, useState } from 'react'
import { 
    Alert,
    Animated,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowImage, CartFlatList, CartScrollView, CartViewWrapper, Handle, OrderWrapper, PayAmtNumber, PayAmtTitle, PayAmtUnit, PayAmtWrapper, PayBtn, PayBtnWrapper, PayIcon, PayTitle, PayWrapper } from '../../styles/main/cartStyle';
import CartListItem from '../cartComponents/cartListItem';
import { LANGUAGE } from '../../resources/strings';
import { setCartView, setIconClick } from '../../store/cart';
import { IconWrapper } from '../../styles/main/topMenuStyle';
import TopButton from '../menuComponents/topButton';
import {  getStoreID, isNetworkAvailable, itemEnableCheck, numberWithCommas, openFullSizePopup, openTransperentPopup } from '../../utils/common';
import { adminDataPost, initOrderList, postLog, postOrderToPos, presetOrderData } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEmpty} from 'lodash';
import LogWriter from '../../utils/logWriter';
import { KocesAppPay } from '../../utils/payment/kocesPay';
import { displayErrorNonClosePopup, displayErrorPopup } from '../../utils/errorHandler/metaErrorHandler';
import { setMonthPopup, setSelectedMonth } from '../../store/monthPopup';
import { EventRegister } from 'react-native-event-listeners';
import { getMenuUpdateState, getPosStoreInfo, getTableAvailability } from '../../utils/api/metaApis';
import { initMenu, menuUpdateCheck } from '../../store/menu';
import { META_SET_MENU_SEPARATE_CODE_LIST, PAY_SEPRATE_AMT_LIMIT } from '../../resources/defaults';
import moment from 'moment';
import { metaPosDataFormat, metaPostPayFormat } from '../../utils/payment/metaPosDataFormat';
import { callApiWithExceptionHandling } from '../../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_MENU_UPDATE } from '../../resources/newApiResource';

const windowWidth = Dimensions.get('window').width;
const CartView = () =>{
    const lw = new LogWriter();
    const {language} = useSelector(state=>state.languages);

    const dispatch = useDispatch();
    const orderListRef = useRef();
    const {isOn} = useSelector((state)=>state.cartView);
    const {orderList,vatTotal} = useSelector((state)=>state.order);
    const {orderStatus} = useSelector(state=>state.order);    
    const {allItems} = useSelector(state=>state.menu);
    const { tableInfo, tableStatus } = useSelector(state=>state.tableInfo);
    const {isMonthSelectShow, monthSelected} = useSelector(state=>state.monthSelect)
    //console.log("orderList: ",orderList);
    const [totalAmt, setTotalAmt] = useState();
    const [totalCnt, setTotalCnt] = useState(0);
    const [cartCnt, setCartCnt] = useState(0);
    const [prevOrderList, setPrevOrderList] = useState();

    const [slideAnimation, setSlideAnimation] = useState(new Animated.Value(0));
    const slideInterpolate = slideAnimation.interpolate({
        inputRange:[0,1],
        outputRange:[(windowWidth*0.266),(windowWidth*0.004)]
        //outputRange:[314,5]
    })
    const boxStyle = {
        transform: [{translateX:slideInterpolate},],
    };
    const isPrepay = tableStatus?.now_later=="선불"?true:false;

    const drawerController = (isOpen) =>{
        Animated.parallel([
            Animated.timing(slideAnimation,{
                toValue:isOpen?1:0,
                duration:200,
                useNativeDriver:true
            })
        ]).start();
    }
   
    const addToPos = async () => {
        const paymentResult = {"acquire-info": "0300신한카드사", "additional-device-name": "SIFM", "additional-device-serial": "S522121235", "approval-date": "231026", "approval-no": "37466524", "approval-time": "004108", "business-address": "서울 영등포구 선유로3길 10 하우스디 비즈 706호", "business-name": "주식회사 우리포스", "business-no": "2118806806", "business-owner-name": "김정엽", "business-phone-no": "02  15664551", "card-no": "94119400********", "cat-id": "7109912041", "deal": "approval", "device-auth-info": "####SMT-R231", "device-auth-ver": "1001", "device-name": "SMT-R231", "device-serial": "S522121235", "display-msg": "정상승인거래", "external-name": "SIFM", "external-serial": "S522121235", "issuer-info": "0300마이홈플러스신한", "merchant-no": "0105512446", "persional-id": "01040618432", "receipt-msg": "정상승인거래", "response-code": "00", "service": "payment", "service-result": "0000", "total-amount": 20, "type": "credit", "unique-no": "710610231843", "van-tran-seq": "231026004105"}
        //dispatch(postToPos({paymentResult}));
        //lw.writeLog("Teset test test")
    } 

    useEffect(()=>{
        if(!isMonthSelectShow) {
            if(totalAmt>0) {
                if(monthSelected!="") {
                    makePayment();
                    dispatch(setSelectedMonth(""));
                }
            }
        }

    },[isMonthSelectShow,monthSelected])
    const makePayment = async () =>{
            if( tableStatus?.now_later == "선불") {
                const bsnNo = await AsyncStorage.getItem("BSN_NO");
                const tidNo = await AsyncStorage.getItem("TID_NO");
                const serialNo = await AsyncStorage.getItem("SERIAL_NO");
                if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
                    displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
                    return;
                }
                const orderData = await metaPostPayFormat(orderList,{}, allItems);
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
                    const amtData = {amt:payAmt, taxAmt:vatAmt, months:monthSelected, bsnNo:bsnNo,termID:tidNo }
                    //console.log("amtData: ",amtData);
                    var kocessAppPay = new KocesAppPay();
                    kocessAppPay.requestKocesPayment(amtData)
                    .then(async (result)=>{ 
                        
                        console.log("result: ",result);
                        const orderData = await metaPostPayFormat(orderList,result, allItems);
                        dispatch(postOrderToPos({payData:result,orderData:orderData}));
                        dispatch(adminDataPost({payData:result,orderData:orderData}));
                    })
                    .catch((err)=>{
                        //console.log("error: ",err)
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        dispatch(postLog({payData:err}))
                        displayErrorPopup(dispatch, "XXXX", err?.Message)
                    })
                }
            }else {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                const orderData = await metaPostPayFormat(orderList,{}, allItems);
                dispatch(adminDataPost({payData:null,orderData:orderData}));
                dispatch(postOrderToPos({payData:null,orderData:orderData}));
            }
         
    }
    const ItemOptionTitle = (additiveId) =>{
        let selOptTitleLanguage = "";
        const selExtra = allItems.filter(el=>el.prod_cd==additiveId);
        if(language=="korean") {
            selOptTitleLanguage = selExtra[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selOptTitleLanguage = selExtra[0]?.gname_jp||selExtra[0]?.gname_kr;
        }
        else if(language=="chinese") {
            selOptTitleLanguage = selExtra[0]?.gname_cn||selExtra[0]?.gname_kr;
        }
        else if(language=="english") {
            selOptTitleLanguage = selExtra[0]?.gname_en||selExtra[0]?.gname_kr;
        }
        return selOptTitleLanguage;
    }

    const doPayment = async () =>{
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
                const isItemOrderble = await itemEnableCheck(STORE_IDX,orderList).catch(err=>{ return{isAvailable:false, result:null} } );
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
                                Alert.alert(
                                    "업데이트",
                                    "메뉴 업데이트가 되었습니다. 업데이트 후 주문하실 수 있습니다.",
                                    [{
                                        text:'확인',
                                    }]
                                );
                                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
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
    useEffect(()=>{
        drawerController(isOn); 
    },[isOn])

    useEffect(()=>{
        //console.log("order list: ",orderList.length);
        if(orderList?.length > 0) {
            dispatch(setCartView(true))
        }else {
            dispatch(setCartView(false))
        }
        if(orderList.length > 0) {
            var itemTotal = 0;
            var qtyTotal = 0;
            for(var i=0;i<orderList.length;i++) {
                const orderItem = orderList[i];
                const itemDetail = allItems?.filter(el=>el.prod_cd == orderItem?.prod_cd);
                
                if(META_SET_MENU_SEPARATE_CODE_LIST.indexOf(itemDetail[0]?.prod_gb)>=0) {
                    //itemTotal = itemTotal+Number(itemDetail[0]?.account);
                    // 선택하부금액 
                    const setItem = orderItem?.set_item;
                    var setItemPrice = 0;
                    
                    if(setItem.length>0) {
                        // 세트 선택이 있다.
                        for(var j=0;j<setItem.length;j++) {
                            const setItemData = allItems?.filter(el=>el.prod_cd == setItem[j].optItem);
                            if(setItemData.length>0) {
                                setItemPrice = Number(setItemPrice)+(Number(setItemData[0]?.account)*Number(setItem[j]?.qty));
                            }
                            //itemTotal = (Number(itemTotal)+Number(setItemPrice))*Number(orderItem?.qty);
                            
                        }
                        itemTotal = Number(itemTotal) + ( (Number(setItemPrice)+Number(itemDetail[0]?.account)) *orderItem.qty );
                    }else {
                        // 세트 선택이 없다.
                        //console.log("itemTotal: ",Number(itemDetail[0]?.account),Number(orderItem?.qty));
                        itemTotal = itemTotal+ (Number(itemDetail[0]?.account)*Number(orderItem?.qty));
                    }

                    qtyTotal = qtyTotal+orderItem?.qty;
                     
                }else {
                    itemTotal = itemTotal+(Number(itemDetail[0]?.account)*Number(orderItem?.qty));
                    qtyTotal = qtyTotal+orderItem?.qty;
                } 
                

            }
            setTotalCnt(qtyTotal)
            setTotalAmt(itemTotal)
        }else {
            setTotalCnt(0)
            setTotalAmt(0)
        }
        
    },[orderList])
  

    return(
        <>  
            <IconWrapper>
                {tableStatus?.now_later != "선불" &&
                    <TopButton cntNum={cartCnt} onPress={()=>{ openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true}); /* openTransperentPopup(dispatch, {innerView:"CameraView", isPopupVisible:true}); */ }} isSlideMenu={false} lr={"left"} onSource={require("../../assets/icons/orderlist_trans.png")} offSource={require("../../assets/icons/orderlist_grey.png")} />
                }
                <TopButton cntNum={totalCnt} onPress={()=>{  dispatch(setCartView(!isOn));  }} isSlideMenu={true} lr={"right"} onSource={require("../../assets/icons/cart_trans.png")} offSource={require("../../assets/icons/cart_grey.png")} />
            </IconWrapper>
            <CartViewWrapper style={[{...boxStyle}]} >
                
                <TouchableWithoutFeedback onPress={()=>{   dispatch(setCartView(!isOn));  }}>
                    <Handle>
                        {isOn&&
                            <ArrowImage source={require("../../assets/icons/close_arrow.png")} />
                        }
                        {!isOn&&
                            <ArrowImage style={{transform:[{scaleX:-1}]}} source={require("../../assets/icons/close_arrow.png")} />
                        }
                    </Handle>
                </TouchableWithoutFeedback>
                {orderList &&
                    <CartFlatList
                        ref={orderListRef}
                        data={orderList}
                        renderItem={(item )=>{
                            return(
                                <CartListItem {...item} />
                            )
                        }}
                    >
                    </CartFlatList>
                } 
                <OrderWrapper>
                    <PayWrapper>
                        <PayAmtWrapper isBordered={true}>
                            <PayAmtTitle>{LANGUAGE[language]?.cartView?.orderAmt}</PayAmtTitle>
                            <PayAmtNumber>{totalCnt}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView?.orderAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    <PayWrapper>
                        <PayAmtWrapper >
                            <PayAmtTitle>{LANGUAGE[language]?.cartView.totalAmt}</PayAmtTitle>
                            <PayAmtNumber>{numberWithCommas(totalAmt)}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView.totalAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    <PayBtnWrapper>

                        {!isPrepay&&
                            <TouchableWithoutFeedback onPress={()=>{doPayment();}} >
                                <PayBtn isFull={true} >
                                    <PayTitle>{LANGUAGE[language]?.cartView.makeOrder}</PayTitle>
                                    <PayIcon source={require("../../assets/icons/order.png")} />
                                </PayBtn>
                            </TouchableWithoutFeedback>
                        }
                        {isPrepay&&
                            <TouchableWithoutFeedback onPress={()=>{doPayment();}} >
                                <PayBtn isFull={true} >
                                    <PayTitle>{LANGUAGE[language]?.cartView.payOrder}</PayTitle>
                                    <PayIcon source={require("../../assets/icons/order.png")} />
                                </PayBtn>
                            </TouchableWithoutFeedback>
                        }
                        {/*isPrepay&&
                            <>
                            <TouchableWithoutFeedback onPress={()=>{doPayment();}} >
                                <PayBtn isFull={false} isGap={true} >    
                                    <PayTitle>{LANGUAGE[language]?.cartView.payOrder}</PayTitle>
                                    
                                </PayBtn>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"OrderPay", isFullPopupVisible:true}); }} >
                                <PayBtn isFull={false}  isGap={true} >
                                        <PayTitle>{LANGUAGE[language]?.cartView.payDutch}</PayTitle>
                                </PayBtn>
                            </TouchableWithoutFeedback>
                            </>
                        */}

                    </PayBtnWrapper>

                </OrderWrapper>
            </CartViewWrapper>  
           
        </>
    )
}
const samplePayData = {"AnsCode": "0000", "AnswerTrdNo": null, "AuNo": "18691817", "AuthType": null, "BillNo": "", "CardKind": "1", "CardNo": "94119400", "ChargeAmt": null, "DDCYn": "1", "DisAmt": null, "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "000002882653                            ", "Month": "03", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": null, "PcCoupon": null, "PcKind": null, "PcPoint": null, "QrKind": null, "RefundAmt": null, "SvcAmt": "0", "TaxAmt": "4546", "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000002882653", "TrdAmt": "45458", "TrdDate": "231228150830", "TrdType": "A15"};
export default CartView;
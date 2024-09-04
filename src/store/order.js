import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
//import { SERVICE_ID, STORE_ID } from '../resources/apiResources';
import { addOrderToPos, getOrderByTable } from '../utils/apis';
import { dutchPayItemCalculator, getIP, getStoreID, getTableInfo, grandTotalCalculate, numberPad, openFullSizePopup, openInstallmentPopup, openPopup, openTransperentPopup, orderListDuplicateCheck, setOrderData } from '../utils/common';
import { isEqual, isEmpty } from 'lodash'
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';
import { setCartView, setQickOrder, setQuickOrder } from './cart';
import LogWriter from '../utils/logWriter';
import { POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_POSTPAY_ORDER, POS_WORK_CD_PREPAY_ORDER_REQUEST, POS_WORK_CD_VERSION } from '../resources/apiResources';
import { getTableOrderList, postMetaPosOrder, repostMetaPosOrder } from '../utils/api/metaApis';
import { ERROR_CODE, ERROR_STRING, META_SET_MENU_SEPARATE_CODE_LIST } from '../resources/defaults';
import moment from 'moment';
import { postOrderLog, postPayLog } from '../utils/api/adminApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import { ADMIN_API_BASE_URL, ADMIN_API_POST_ORDER, TMP_STORE_DATA } from '../resources/newApiResource';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { displayErrorPopup } from '../utils/errorHandler/metaErrorHandler';
import { regularUpdate } from './menu';
import { setLastOrderItem } from './tableInfo';
import { KocesAppPay } from '../utils/payment/kocesPay';
import { metaPostPayFormat } from '../utils/payment/metaPosDataFormat';

export const setOrder = createAsyncThunk("order/setOrder", async(data,{}) =>{
    return data;
})
export const initOrder = createAsyncThunk("order/initOrder", async(data,{}) =>{
    return;
})

export const initOrderList = createAsyncThunk("order/initOrderList", async() =>{
    return  {
        vatTotal:0,
        grandTotal:0,
        totalItemCnt:0,
        orderList:[],
        orderPayData:{},
    };
})
export const emptyOrderList = createAsyncThunk("order/emptyOrderList", async() =>{
    return  {orderList:[]};
})
// 주문 데이터 세팅
export const presetOrderData = createAsyncThunk("order/presetOrderData", async(_,{dispatch, getState,rejectWithValue}) =>{
    const {orderList} = getState().order;
    const { tableStatus } = getState().tableInfo;
    const {payData} = _;
    const date = new Date();

    const tableNo = await getTableInfo().catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});});
    if(isEmpty(tableNo)) {
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});
        return 
    }
    //const orderNo = `${date.getFullYear().toString().substring(2,4)}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}${moment().format("HHMMSSs")}`;
    const orderNo = `${date.getFullYear().toString().substring(2,4)}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}${moment().valueOf()}`;
     
    let orderData = {
        "VERSION" : POS_VERSION_CODE,
        "WORK_CD" : !isEmpty(payData)?POS_WORK_CD_PREPAY_ORDER_REQUEST:POS_WORK_CD_POSTPAY_ORDER, //선불 후불에 따라 코드 다름
        "ORDER_NO" : orderNo,
        "TBL_NO" : `${tableNo.TABLE_INFO}`, 
        "PRINT_YN" : "Y",
        "USER_PRINT_YN" : "N",
        "PRINT_ORDER_NO" : orderNo, 
        "TOT_INWON" : 4,
        "ITEM_CNT" : orderList.length,
        "ITEM_INFO" :orderList
    }    
    // 결제시 추가 결제 결과 데이터
    let addOrderData = {};
    if(!isEmpty(payData)) {
        addOrderData = {
            TOTAL_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
            TOTAL_VAT:Number(payData?.TaxAmt),
            TOTAL_DC:Number(payData?.SvcAmt),
            ORDER_STATUS:"3",
            CANCEL_YN:"N",
            PREPAYMENT_YN:"N",
            CUST_CARD_NO:`${payData?.CardNo}`,
            CUST_NM:"",
            PAYMENT_CNT:1,
            PAYMENT_INFO:[{
                PAY_SEQ:1,
                PAY_KIND:"2",
                PAY_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
                PAY_VAT:Number(payData?.TaxAmt),
                PAY_APV_NO:`${payData?.AuNo}`,
                PAY_APV_DATE:`20${payData?.TrdDate?.substr(0,6)}`,
                PAY_CARD_NO:`${payData?.CardNo}********`,
                PAY_UPD_DT:`20${payData?.TrdDate}`,
                PAY_CANCEL_YN:"N",
                PAY_CARD_TYPE:`${payData?.InpNm}`,
                PAY_CARD_MONTH:`${payData?.Month}`
            }]
        };
        orderData = {...orderData,...addOrderData};
    }
    //console.log("orderdata: ",(orderData));
    return orderData;
})

/// 어드민에 주문 데이터 보내기 
export const adminDataPost = createAsyncThunk("order/adminDataPost", async(_,{dispatch, rejectWithValue, getState})=>{
    const { tableStatus } = getState().tableInfo;
    const {payData, orderData} = _;
    const {allItems} = getState().menu;
    var postOrderData = Object.assign({}, orderData);
    const date = new Date();
    const tableNo = await getTableInfo().catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});});
    if(isEmpty(tableNo)) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});
        return 
    }
    const {STORE_IDX} = await getStoreID()
    // 결제시 추가 결제 결과 데이터
    
    let addOrderData = {};
    if(!isEmpty(payData)) {
        addOrderData = {
            TOTAL_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
            TOTAL_VAT:Number(payData?.TaxAmt),
            TOTAL_DC:Number(payData?.SvcAmt),
            ORDER_STATUS:"3",
            CANCEL_YN:"N",
            PREPAYMENT_YN:"N",
            CUST_CARD_NO:`${payData?.CardNo}`,
            CUST_NM:``,
            PAYMENT_CNT:1,
            PAYMENT_INFO:[{
                PAY_SEQ:1,
                PAY_KIND:"2",
                PAY_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
                PAY_VAT:Number(payData?.TaxAmt),
                PAY_APV_NO:`${payData?.AuNo}`,
                PAY_APV_DATE:`20${payData?.TrdDate?.substr(0,6)}`,
                PAY_CARD_NO:`${payData?.CardNo}********`,
                PAY_UPD_DT:`20${payData?.TrdDate}`,
                PAY_CANCEL_YN:"N",
                PAY_CARD_TYPE:`${payData?.InpNm}`,
                PAY_CARD_MONTH:`${payData?.Month}`
            }]
        };
        postOrderData = {...orderData,...addOrderData};
    }
    
    let addData = {
        "PREPAYMENT_YN":isEmpty(payData)?"N":"Y",
        "STORE_ID":STORE_IDX,
    }
    postOrderData = {...postOrderData,...addData};
    
    // 마지막 주문 팝업 추가
    const itemList = postOrderData?.ITEM_INFO
    if(itemList.length > 0) {
        itemList?.map(el=>{
            const itemDetail = allItems.filter(item => item.prod_cd == el.ITEM_CD );
            if(itemDetail?.length>0) {
                const isPopup = itemDetail[0]?.is_popup;
                console.log("is popup: ",isPopup);
                if(isPopup == "Y") {
                    dispatch(setLastOrderItem(itemDetail[0]));
                }
            }

        })
    }
    //console.log("postOrderDatatoadmin========================================================")
    //console.log(JSON.stringify(postOrderData))

    /* 
        if(itemDetail?.length>0) {
            const isPopup = itemDetail[0]?.is_popup;
            console.log("is popup: ",isPopup);
            if(isPopup == "Y") {
                
            }
        }
         */
    try {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_POST_ORDER}`,postOrderData, {});
        if(data) {
            if(data?.result) {
                //dispatch(setCartView(false));
                //dispatch(initOrderList());
               /*  if( tableStatus?.now_later == "선불") {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                }else {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                    setTimeout(() => {
                        openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true, param:{timeOut:10000} });
                    }, 3000);
                } */
                
            }else {
                return rejectWithValue(error.message)
            }
        }
      } catch (error) {
        // 예외 처리
        console.log("admin api error=========================================");
        console.error(error.message);
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        return rejectWithValue(error.message)
    }
})

// 포스로 데이터 전송
export const postOrderToPos = createAsyncThunk("order/postOrderToPos", async(_,{dispatch, rejectWithValue, getState}) =>{
    //const {metaOrderData} = getState().order;
    //var orderList = Object.assign({},metaOrderData);
    const { tableStatus } = getState().tableInfo;
    const {payData,orderData,isQuick, isMultiPay} = _;
    var postOrderData = Object.assign({},orderData);
    const {STORE_IDX} = await getStoreID()
    dispatch(setQuickOrder(false));
    const tableNo = await getTableInfo().catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});});
    if(isEmpty(tableNo)) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});
        return 
    }

    // 결제시 추가 결제 결과 데이터
    let addOrderData = {};
    if(!isEmpty(payData)) {

        if(isMultiPay == false){
            var cardNo = payData?.CardNo;
            cardNo = cardNo.replace(/\*/gi,"");
            cardNo = cardNo.replace(/-/gi,"");
            addOrderData = {
                TOTAL_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
                TOTAL_VAT:Number(payData?.TaxAmt),
                TOTAL_DC:Number(payData?.SvcAmt),
                ORDER_STATUS:"3",
                CANCEL_YN:"N",
                PREPAYMENT_YN:"N",
                CUST_CARD_NO:`${payData?.CardNo}`,
                CUST_NM:``,
                PAYMENT_CNT:1,
                PAYMENT_INFO:[{
                    PAY_SEQ:1,
                    PAY_KIND:"2",
                    PAY_AMT:Number(payData?.TrdAmt)+Number(payData?.TaxAmt),
                    PAY_VAT:Number(payData?.TaxAmt),
                    PAY_APV_NO:`${payData?.AuNo}`,
                    PAY_APV_DATE:`20${payData?.TrdDate?.substr(0,6)}`,
                    PAY_CARD_NO:`${cardNo}********`,
                    PAY_UPD_DT:`20${payData?.TrdDate}`,
                    PAY_CANCEL_YN:"N",
                    PAY_CARD_TYPE:`${payData?.InpNm}`,
                    PAY_CARD_MONTH:`${payData?.Month}`
                }]
            };
        }else {
            var totalAmt = 0;
            var totalVat = 0;
            var totalDc = 0;
            var paymentInfo = [];
            for(var i=0;i<payData.length;i++){
                totalAmt += Number(payData[i]?.TrdAmt)+Number(payData[i]?.TaxAmt);
                totalVat += Number(payData[i]?.TaxAmt);
                var cardNo = payData[i]?.CardNo;
                cardNo = cardNo.replace(/\*/gi,"");
                cardNo = cardNo.replace(/-/gi,"");
                const payOneData = {
                    PAY_SEQ:1,
                    PAY_KIND:"2",
                    PAY_AMT:Number(payData[i]?.TrdAmt)+Number(payData[i]?.TaxAmt),
                    PAY_VAT:Number(payData[i]?.TaxAmt),
                    PAY_APV_NO:`${payData[i]?.AuNo}`,
                    PAY_APV_DATE:`20${payData[i]?.TrdDate?.substr(0,6)}`,
                    PAY_CARD_NO:`${cardNo}********`,
                    PAY_UPD_DT:`20${payData[i]?.TrdDate}`,
                    PAY_CANCEL_YN:"N",
                    PAY_CARD_TYPE:`${payData[i]?.InpNm}`,
                    PAY_CARD_MONTH:`${payData[i]?.Month}`
                }
                paymentInfo.push(payOneData);
            }

            addOrderData = {
                TOTAL_AMT:Number(totalAmt),
                TOTAL_VAT:Number(totalVat),
                TOTAL_DC:Number(totalDc),
                ORDER_STATUS:"3",
                CANCEL_YN:"N",
                PREPAYMENT_YN:"N",
                CUST_CARD_NO:``,
                CUST_NM:``,
                PAYMENT_CNT:paymentInfo.length,
                PAYMENT_INFO:paymentInfo
            }
        }
        postOrderData = {...postOrderData,...addOrderData};

    }  
    //console.log("orderData: ",orderList);
    // 포스로 전달
    //let orderData = {"VERSION":"0010","WORK_CD":"8020","ORDER_NO":"2312271703684313782","TBL_NO":"001","PRINT_YN":"Y","USER_PRINT_YN":"Y","PRINT_ORDER_NO":"2312271703684313782","TOT_INWON":4,"ITEM_CNT":1,"ITEM_INFO":[{"ITEM_SEQ":1,"ITEM_CD":"900022","ITEM_NM":"치즈 추가","ITEM_QTY":1,"ITEM_AMT":1004,"ITEM_VAT":91,"ITEM_DC":0,"ITEM_CANCEL_YN":"N","ITEM_GB":"N","ITEM_MSG":"","SETITEM_CNT":0,"SETITEM_INFO":[]}],"TOTAL_AMT":"50004","TOTAL_VAT":"0","TOTAL_DC":"0","ORDER_STATUS":"3","CANCEL_YN":"N","PREPAYMENT_YN":"Y","CUST_CARD_NO":"94119400","CUST_NM":"","PAYMENT_CNT":1,"PAYMENT_INFO":{"PAY_SEQ":1,"PAY_KIND":"2","PAY_AMT":"50004","PAY_VAT":"0","PAY_APV_NO":"02761105","PAY_APV_DATE":"231227113649","PAY_CART_NO":"94119400","PAY_UPD_DT":"231227113649","PAY_CANCEL_YN":"N","PAY_CART_TYPE":"신한카드","PAY_CARD_MONTH":"00"}}
    console.log("postOrderData=================================================================");
    console.log(JSON.stringify(postOrderData));
    const {POS_IP} = await getIP();
    try {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        const data = await callApiWithExceptionHandling(`${POS_BASE_URL(POS_IP)}`,postOrderData, {}); 
        if(data) {
            if(data.ERROR_CD == "E0000") {
                if(isQuick==false) {
                    dispatch(setCartView(false));
                    dispatch(initOrderList());
                    dispatch(regularUpdate());
                    dispatch(initDutchPayOrder());  
                    openFullSizePopup(dispatch, {innerFullView:"", isFullPopupVisible:false}); 
                }
                if( tableStatus?.now_later == "선불") {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                    dispatch(setQuickShow(true));
                }else {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                    setTimeout(() => {
                        openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true, param:{timeOut:10000} });
                        if(isQuick==false) {
                            dispatch(setQuickShow(true));
                        }
                        
                    }, 4000);
                }
            }else {
                const ERROR_CD = data?.ERROR_CD;
                const ERROR_MSG = data?.ERROR_MSG;
                const failData = {"storeID":STORE_IDX,"tableNo":tableNo?.TABLE_INFO,"ERROR_CD":ERROR_CD,"ERROR_MSG":ERROR_MSG, "orderData":JSON.stringify(postOrderData),"time":moment().format("YYYY-MM-DD HH:mm:ss")};
                postOrderLog(failData);
                displayErrorPopup(dispatch, "XXXX", data?.ERROR_MSG);
            }
        }
        return;
    } catch (error) {
        // 예외 처리
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        console.error(error.message);
        return rejectWithValue(error.message)
    }

})


/*** 이하 삭제   */

export const setOrderList = createAsyncThunk("order/setOrderList", async(data) =>{
    return data;
})

export const deleteItem = createAsyncThunk("order/deleteItem", async(_,{dispatch, getState,extra}) =>{
    const {grandTotal, orderList} = getState().order;
    let tmpOrderList = Object.assign([],orderList);
    tmpOrderList.remove(_.index)
    // 카트 여닫기
    if(tmpOrderList.length <= 0) {
        dispatch(setCartView(false));
    }
    const totalResult = grandTotalCalculate(tmpOrderList)
    return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt };
})


export const resetAmtOrderList = createAsyncThunk("order/resetAmtOrderList", async(_,{dispatch, getState,extra}) =>{
    
    const {grandTotal, orderList} = getState().order;
    const {amt, index, operand} = _;
    const {tableInfo} = getState().tableInfo;
    const {allItems} = getState().menu;

    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });

    let tmpOrderList = Object.assign([],orderList);
    const selectedMenu = tmpOrderList[index];

    // 포스 메뉴 정보
    const menuPosDetail = allItems.filter(el=>el.prod_cd == selectedMenu?.ITEM_CD);
    if( META_SET_MENU_SEPARATE_CODE_LIST.indexOf(menuPosDetail[0]?.prod_gb)>=0) {
        // 선택하부금액
        // 선택하부금액은 메인 금액일아 하부 메뉴 금액이랑 같이 올려줘야함
        let itemCnt = selectedMenu?.ITEM_QTY;
        let singleItemAmt = selectedMenu?.ITEM_AMT/itemCnt;
        if(operand=="plus") {
            itemCnt +=1;
        }else if(operand=="minus")  {
            itemCnt -=1;
        }else {
            itemCnt = 0;
        }
        if(itemCnt<=0) {
            tmpOrderList.splice(index,1);
            if(tmpOrderList.length <= 0) {
                dispatch(setCartView(false));
            }
            const totalResult = grandTotalCalculate(tmpOrderList)
            //console.log("tmpOrderList:",tmpOrderList);
            return {orderList:tmpOrderList, vatTotal:totalResult?.vatTotal, grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
            //return {orderList:tmpOrderList}
        }
        // 하부메뉴금액 수량 수정
        let subSetItems = Object.assign([],selectedMenu?.SETITEM_INFO);
        
        let newSubSetItems = [];
        let subItemTotal = 0;
        let subVatTotal = 0;
        for(var i=0;i<subSetItems.length;i++) {
            const calculatedData = {
                "AMT": (subSetItems[i].AMT/subSetItems[i].QTY)*itemCnt, 
                "ITEM_SEQ": subSetItems[i].ITEM_SEQ, 
                "PROD_I_CD": subSetItems[i].PROD_I_CD, 
                "PROD_I_NM": subSetItems[i].PROD_I_NM, 
                "QTY": itemCnt, 
                "SET_SEQ": subSetItems[i].SET_SEQ,
                "VAT": (subSetItems[i].VAT/subSetItems[i].QTY)*itemCnt,
            }
            subItemTotal += (subSetItems[i].AMT/subSetItems[i].QTY)*itemCnt;
            subVatTotal += (subSetItems[i].VAT/subSetItems[i].QTY)*itemCnt
            newSubSetItems.push(calculatedData);
        }
        
        tmpOrderList[index] = Object.assign({},selectedMenu,{ITEM_AMT:singleItemAmt*itemCnt, ITEM_QTY:itemCnt,SETITEM_INFO:newSubSetItems});
        const totalResult = grandTotalCalculate(tmpOrderList)
        //tmpOrderList.reverse();

        return {orderList:tmpOrderList, vatTotal:totalResult?.vatTotal+subVatTotal, grandTotal:totalResult.grandTotal+subItemTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
         
    }else {

        let itemCnt = selectedMenu?.ITEM_QTY;
        let singleItemAmt = selectedMenu?.ITEM_AMT/itemCnt;
        if(operand=="plus") {
            itemCnt +=1;
        }else if(operand=="minus")  {
            itemCnt -=1;
        }else {
            itemCnt = 0;
        }
         
        if(itemCnt<=0) {
            tmpOrderList.splice(index,1);
            if(tmpOrderList.length <= 0) {
                dispatch(setCartView(false));
            }
            const totalResult = grandTotalCalculate(tmpOrderList)
            //console.log("tmpOrderList:",tmpOrderList);
           
            return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
            //return {orderList:tmpOrderList}
        }
        tmpOrderList[index] = Object.assign({},selectedMenu,{ITEM_AMT:singleItemAmt*itemCnt, ITEM_QTY:itemCnt});
        const totalResult = grandTotalCalculate(tmpOrderList)
        //tmpOrderList.reverse();
   
        return {orderList:tmpOrderList, vatTotal:totalResult?.vatTotal, grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
         
    }

})

export const initToQuickOrderList =  createAsyncThunk("order/initToQuickOrderList", async(_,{dispatch, getState,extra}) =>{
    return;
})


export const addToQuickOrderList =  createAsyncThunk("order/addToQuickOrderList", async(_,{dispatch, getState,extra}) =>{
    const item = _?.item;
    const isAdd =  _?.isAdd;
    const isDelete =  _?.isDelete;
    const menuOptionSelected = _?.menuOptionSelected;
    const {quickOrderList} = getState().order;
    var currentOrderList = Object.assign([],quickOrderList);
    var orderItemForm = {
        prod_cd:"",
        qty:0,
        set_item:[]
    };
    if( META_SET_MENU_SEPARATE_CODE_LIST.indexOf(item?.prod_gb)>=0) {
        // 메뉴 선택하부금액 
        // 선택한 옵션의 가격이 들어감
        // 세트 메인 품목의 가격은 그대로 하위 품목들의 가격이 들어가고 그에따라 수량이 늘아날떄 가격과 수량이 같이 올라가야함
        // 메뉴 데이터 주문데이터에 맞게 변경
        const duplicatedList = currentOrderList.filter(el=> (el.prod_cd == item?.prod_cd) && ( isEqual(el.set_item,menuOptionSelected) ) );
        // 중복 체크
        if(duplicatedList.length>0) {
            for(var i=0;i<quickOrderList.length;i++) {
                if(quickOrderList[i].prod_cd == item?.prod_cd) {
                    // 옵션도 비교해야함
                    if(isEqual(quickOrderList[i].set_item, menuOptionSelected)) {
                        if(isAdd) {
                            // 세트 아이템 
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(quickOrderList[i]["qty"])+1}});
                        }else {
                            if(isDelete) {
                                currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:0}});
                            }else {
                                currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(quickOrderList[i]["qty"])-1}});
                            }
                        }
                    }
                }
            }
        }else {
            orderItemForm["prod_cd"] = item?.prod_cd;
            orderItemForm["qty"] = 1;
            orderItemForm["set_item"] = menuOptionSelected;
            currentOrderList.unshift(orderItemForm);
        }

        //currentOrderList = await currentOrderList.filter(el=>el.qty > 0);
        const finalOrderList = currentOrderList.filter(el=>el.qty > 0);
        return({quickOrderList:finalOrderList});
        
    }else {
         // 다른 메뉴들
        // 세트메뉴 경우 그냥 세트 품목들 0원 세트 메인 상품의 가격에 세트메뉴 가격을 추가함
        const duplicatedList = currentOrderList.filter(el=>el.prod_cd == item?.prod_cd);
        const exceptedList = currentOrderList.filter(el=>el.prod_cd != item?.prod_cd);
        
        if(duplicatedList.length>0) {
            for(var i=0;i<quickOrderList.length;i++) {
                if(quickOrderList[i].prod_cd == item?.prod_cd) {
                    if(isAdd) {
                        currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(quickOrderList[i]["qty"])+1}});
                    }else {
                        if(isDelete) {
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:0}});
                        }else {
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(quickOrderList[i]["qty"])-1}});
                        }
                    }
                }
            }
        }else {
            orderItemForm["prod_cd"] = item?.prod_cd;
            orderItemForm["qty"] = 1;
            orderItemForm["set_item"] = [];
            currentOrderList.unshift(orderItemForm);
        }
        const finalOrderList = currentOrderList.filter(el=>el.qty > 0);
        return({quickOrderList:finalOrderList});
    }
})

export const addToOrderList =  createAsyncThunk("order/addToOrderList", async(_,{dispatch, getState,extra}) =>{
    const item = _?.item;
    const isAdd =  _?.isAdd;
    const isDelete =  _?.isDelete;
    const menuOptionSelected = _?.menuOptionSelected;
    const {orderList} = getState().order;
    var currentOrderList = Object.assign([],orderList);
    var orderItemForm = {
        prod_cd:"",
        qty:0,
        set_item:[]
    };
    if( META_SET_MENU_SEPARATE_CODE_LIST.indexOf(item?.prod_gb)>=0) {
        // 메뉴 선택하부금액 
        // 선택한 옵션의 가격이 들어감
        // 세트 메인 품목의 가격은 그대로 하위 품목들의 가격이 들어가고 그에따라 수량이 늘아날떄 가격과 수량이 같이 올라가야함
        // 메뉴 데이터 주문데이터에 맞게 변경
        const duplicatedList = currentOrderList.filter(el=> (el.prod_cd == item?.prod_cd) && ( isEqual(el.set_item,menuOptionSelected) ) );
        // 중복 체크
        if(duplicatedList.length>0) {
            for(var i=0;i<orderList.length;i++) {
                if(orderList[i].prod_cd == item?.prod_cd) {
                    // 옵션도 비교해야함
                    if(isEqual(orderList[i].set_item, menuOptionSelected)) {
                        if(isAdd) {
                            // 세트 아이템 
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(orderList[i]["qty"])+1}});
                        }else {
                            if(isDelete) {
                                currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:0}});
                            }else {
                                currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(orderList[i]["qty"])-1}});
                            }
                        }
                    }
                }
            }
        }else {
            orderItemForm["prod_cd"] = item?.prod_cd;
            orderItemForm["qty"] = 1;
            orderItemForm["set_item"] = menuOptionSelected;
            currentOrderList.unshift(orderItemForm);
        }

        //currentOrderList = await currentOrderList.filter(el=>el.qty > 0);
        const finalOrderList = currentOrderList.filter(el=>el.qty > 0);
        return({orderList:finalOrderList});
        
    }else {
         // 다른 메뉴들
        // 세트메뉴 경우 그냥 세트 품목들 0원 세트 메인 상품의 가격에 세트메뉴 가격을 추가함
        const duplicatedList = currentOrderList.filter(el=>el.prod_cd == item?.prod_cd);
        const exceptedList = currentOrderList.filter(el=>el.prod_cd != item?.prod_cd);
        
        if(duplicatedList.length>0) {
            for(var i=0;i<orderList.length;i++) {
                if(orderList[i].prod_cd == item?.prod_cd) {
                    if(isAdd) {
                        currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(orderList[i]["qty"])+1}});
                    }else {
                        if(isDelete) {
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:0}});
                        }else {
                            currentOrderList[i] = Object.assign({},{...currentOrderList[i],...{qty:Number(orderList[i]["qty"])-1}});
                        }
                    }
                }
            }
        }else {
            orderItemForm["prod_cd"] = item?.prod_cd;
            orderItemForm["qty"] = 1;
            orderItemForm["set_item"] = [];
            currentOrderList.unshift(orderItemForm);
        }
        const finalOrderList = currentOrderList.filter(el=>el.qty > 0);
        return({orderList:finalOrderList});
    }
})
// 주문로그 
export const postLog =  createAsyncThunk("order/postLog", async(_,{dispatch, getState,extra}) =>{
    const {orderList} = getState().order;
    const {payData,orderData} = _;
    const date = new Date();
    const tableNo = await getTableInfo().catch(err=>{return {TABLE_INFO:""}});
    // admin log
    const storeID = await AsyncStorage.getItem("STORE_IDX").catch("");
    let auData = [];
    console.log("orderData: ",orderData);
    //  [{"prod_cd": "900026", "qty": 1, "set_item": [[Object]]}, {"prod_cd": "900022", "qty": 1, "set_item": []}]

    let logdata = {
        time:`${date.getFullYear()}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}`,
        storeID: `${storeID}`,
        tableNo:`${tableNo.TABLE_INFO}`,
        auData:JSON.stringify([{date:`${date.getFullYear()}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}`, AuNo:`${payData?.AuNo}`,TrdAmt:`${Number(payData?.TrdAmt)+Number(payData?.TaxAmt)}` }]),
        orderList:JSON.stringify(orderData),
        payResult:JSON.stringify(payData)
    }
    postPayLog(logdata)
})

// 테이블 주문 히스토리
export const getOrderStatus = createAsyncThunk("order/getOrderStatus", async(_,{dispatch, getState,extra}) =>{
    const result = await getTableOrderList();
    return result;
})
// 테이블 주문 히스토리 지우기
export const clearOrderStatus = createAsyncThunk("order/clearOrderStatus", async(_,{dispatch, getState,extra}) =>{
    return [];
})
// 테이블 주문중
export const setOrderProcess = createAsyncThunk("order/onProcess",  async(data,{dispatch, getState,extra}) =>{
    return data;
})
// 테이블 주문중
export const setQuickShow = createAsyncThunk("order/setQuickShow",  async(data,{dispatch, getState,extra}) =>{
    return data;
})

// dutchpay
export const setDutchOrderList = createAsyncThunk("order/setDutchOrderList",  async(data,{dispatch, getState,extra}) =>{
    const {dutchOrderList } = getState().order;
    
    console.log("data: ",data);
    return data;
})
export const setDutchOrderToPayList = createAsyncThunk("order/setDutchOrderToPayList",  async(data,{dispatch, getState,extra}) =>{
    const { dutchOrderList, dutchOrderToPayList, dutchOrderPaidList } = getState().order;
    const {allItems} = getState().menu;
    const calculateResult = dutchPayItemCalculator(dutchOrderList,dutchOrderToPayList, dutchOrderPaidList, data);

    if(calculateResult) {
        const resultDutchOrderToPay = calculateResult.dutchOrderToPayList;
        //const itemDetail = allItems?.filter(el=>el.prod_cd == order?.prod_cd);
        var selectedTotalAmt = 0;
        for(var i=0;i<resultDutchOrderToPay.length;i++) {
            const itemDetail = allItems?.filter(el=>el.prod_cd == resultDutchOrderToPay[i]?.prod_cd);
            const prodGb = itemDetail[0]?.prod_gb; // 세트하부금액 구분용

            if(META_SET_MENU_SEPARATE_CODE_LIST.indexOf(prodGb)>=0) {
                // 선택하부금액 
                var itemTotal = Number(itemDetail[0]?.account);
                const setItem = resultDutchOrderToPay[i]?.set_item;
                if(setItem.length>0) {
                    var setItemPrice = 0;
                    for(var j=0;j<setItem.length;j++) {
                        const setItemData = allItems?.filter(el=>el.prod_cd == setItem[j].optItem);
                        if(setItemData.length>0) {
                            setItemPrice = Number(setItemPrice)+(Number(setItemData[0]?.account)*Number(setItem[j]?.qty));
                        }
                    }
                    itemTotal = (Number(itemTotal)+Number(setItemPrice))*Number(resultDutchOrderToPay[i]?.qty);
                }else {
                    itemTotal = Number(itemDetail[0]?.account)*Number(resultDutchOrderToPay[i]?.qty);
                }
                selectedTotalAmt += Number(itemTotal);
            }else {
                const itemTotal = Number(itemDetail[0]?.account)*Number(resultDutchOrderToPay[i]?.qty);
                selectedTotalAmt += Number(itemTotal);
            }
        }

        return {...calculateResult,...{dutchSelectedTotalAmt:selectedTotalAmt}};
    }else {
        return;
    }
})

export const initDutchPayOrder = createAsyncThunk("order/initDutchPayOrder",  async(data,{dispatch, getState,extra}) =>{
    return;
})
export const startDutchSeparatePayment = createAsyncThunk("order/startDutchSeparatePayment",  async(data,{dispatch, getState,extra, rejectWithValue}) =>{
    console.log("startDutchSeparatePayment================================");
    console.log(data);
    const {dutchOrderDividePaidList} = getState().order;
    
    var numPpl = data?.numPpl;
    var rest = data?.rest;
    var payAmt = data?.payAmt;
    var netAmt = Math.round(payAmt/10);
    var vatAmt = payAmt-netAmt;

    var loopCnt = Number(numPpl)+(rest>0?1:0);

    if(dutchOrderDividePaidList.length >=loopCnt ) {
        console.log("결제 끝");
        return(rejectWithValue());
    }else {
        if(loopCnt > numPpl) {
            // 나머지가 있는경우
            if(dutchOrderDividePaidList.length >= numPpl) {
                // 마지막 결제는 나머지
                if(Number(rest) > 10) {
                    var netRest = Math.round(rest/10);
                    var vatRest = rest-netRest;
                }else {
                    var netRest = rest;
                    var vatRest = 0;
                }
                const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "28872915", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "9411-9400-****-****", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 109                     ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": `${vatRest}`, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000004689679", "TrdAmt": `${netRest}`, "TrdDate": "240902182728", "TrdType": "A15"}
                return result; 
            }else {
                // 다른경우 그냥 결제
                const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "28872915", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "9411-9400-****-****", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 109                     ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": `${vatAmt}`, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000004689679", "TrdAmt": `${netAmt}`, "TrdDate": "240902182728", "TrdType": "A15"}
                return result; 
            }
        }else {
            // 나머지가 없는 경우
            const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "28872915", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "9411-9400-****-****", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 109                     ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": `${vatAmt}`, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000004689679", "TrdAmt": `${netAmt}`, "TrdDate": "240902182728", "TrdType": "A15"}
            return result; 
        }
        /* 
        var kocessAppPay = new KocesAppPay();
        const result = await kocessAppPay.requestKocesPayment(amtData).catch((err)=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            dispatch(postLog({payData:err,orderData:null}))
            displayErrorPopup(dispatch, "XXXX", err?.Message);
            return ""
        });
        console.log("pay result: ",result); 
        if(result == "") {
            return rejectWithValue();
        }
        */
        // 테스트
        
    }

   
    //console.log("numPpl: ",numPpl);
    //console.log("rest: ",rest);
    //console.log("payAmt: ",payAmt);
    //console.log("loopCnt: ",loopCnt);
    /* 
    for(var i=0;i<loopCnt;i++) {
        const netAmt = Math.round(payAmt/10);
        const vatAmt = payAmt-netAmt;
        console.log("netAmt: ",netAmt);
        console.log("vatAmt: ",vatAmt);
        console.log("total: ",Number(vatAmt)+Number(netAmt));
       
    }
    */
    return;
})
export const startDutchPayment = createAsyncThunk("order/startDutchPayment",  async(data,{dispatch, getState,extra, rejectWithValue}) =>{
    const { dutchOrderList, dutchOrderToPayList, dutchOrderPaidList, dutchSelectedTotalAmt } = getState().order;
    const { allItems } = getState().menu;
    var monthSelected = "00";
    if(Number(dutchSelectedTotalAmt)>50000){
        const installmentResult = await openInstallmentPopup(dispatch, getState,"할부","완료","취소",true).catch(err=>err);
        if(installmentResult.code == "0000") {
            if(installmentResult?.response=="ok") {
                const data = installmentResult?.data;
                monthSelected = data.installment;
            }else {
                return;
            }
        }else {
            return;
        }
    }
    /* 
    const payResultData = 
    {
        "PcPoint":"null",
        "GiftAmt":"",
        "Message":"000001198053 ",
        "Keydate":"",
        "OrdCd":"1102",
        "AnsCode":"0000",
        "Month":"",
        "InpNm":"현대카드",
        "BillNo":"",
        "EDCYn":"0",
        "PcCard":"null",
        "ChargeAmt":"null",
        "QrKind":"null",
        "PcCoupon":"null",
        "TaxAmt":"2818",
        "AuthType":"null",
        "TrdType":"A15",
        "PcKind":"null",
        "TrdDate":"240828111720",
        "DDCYn":"1",
        "SvcAmt":"0",
        "AuNo":"00306921",
        "OrdNm":"현대카드",
        "TrdAmt":"28182",
        "CardNo":"4033-0200-****-****",
        "RefundAmt":"null",
        "InpCd":"1102",
        "MchData":"wooriorder",
        "AnswerTrdNo":"null",
        "MchNo":"870733654",
        "TermID":"1612401212",
        "TradeNo":"000001198053",
        "CardKind":"1",
        "DisAmt":"null",
        "TaxFreeAmt":"0"
    }

    return payResultData;
     */
    
    const bsnNo = await AsyncStorage.getItem("BSN_NO");
    const tidNo = await AsyncStorage.getItem("TID_NO");
    const serialNo = await AsyncStorage.getItem("SERIAL_NO");
    if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
        displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
        return;
    }
    var orderData = await metaPostPayFormat(dutchOrderToPayList,{}, allItems).catch(err=>"err");
    if(!isEmpty(orderData)) {
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
        console.log("amtData: ",amtData);
        /* 
        var kocessAppPay = new KocesAppPay();
        const result = await kocessAppPay.requestKocesPayment(amtData).catch((err)=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            dispatch(postLog({payData:err,orderData:null}))
            displayErrorPopup(dispatch, "XXXX", err?.Message);
            return ""
        });
        console.log("pay result: ",result); 
        if(result == "") {
            return rejectWithValue();
        }
        */
        // 테스트
        const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "28872915", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "9411-9400-****-****", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 109                     ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": `${vatAmt}`, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000004689679", "TrdAmt": `${payAmt}`, "TrdDate": "240902182728", "TrdType": "A15"}

        // 결제 진행끝이다.
       
        return result;
    }
})
export const completeDutchPayment = createAsyncThunk("order/completeDutchPayment",  async(data,{dispatch, getState,extra}) =>{
    const { orderList, dutchOrderList, dutchOrderDividePaidList,dutchOrderPayResultList, dutchOrderPaidList, dutchSelectedTotalAmt } = getState().order;
    const { allItems } = getState().menu;
    
    //console.log("orderResultData: ",orderResultData);
    if(!isEmpty(dutchOrderPayResultList)) {
        const orderResultData = await metaPostPayFormat(orderList,dutchOrderPaidList, allItems);
        dispatch(postLog({payData:dutchOrderPayResultList,orderData:orderResultData}))
        await dispatch(postOrderToPos({isQuick:false, payData:dutchOrderPayResultList,orderData:orderResultData, isMultiPay:true}));
        await dispatch(adminDataPost({payData:dutchOrderPayResultList,orderData:orderResultData}));
    }
    else if(!isEmpty(dutchOrderDividePaidList)) {
        const orderResultData = await metaPostPayFormat(orderList,orderList, allItems);
        dispatch(postLog({payData:dutchOrderDividePaidList,orderData:orderResultData}))
        await dispatch(postOrderToPos({isQuick:false, payData:dutchOrderDividePaidList,orderData:orderResultData, isMultiPay:true}));
        await dispatch(adminDataPost({payData:dutchOrderDividePaidList,orderData:orderResultData}));
    }
    dispatch(setCartView(false));
    dispatch(initOrderList());
    dispatch(regularUpdate());
    dispatch(initDutchPayOrder());  
    setTimeout(() => {
        openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
    }, 3000);
    openFullSizePopup(dispatch, {innerFullView:"", isFullPopupVisible:false}); 
    return;
})


// Slice
export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        vatTotal:0,
        grandTotal:0,
        totalItemCnt:0,
        orderList:[],
        orderPayData:{},
        orderStatus:[],
        orgOrderNo:"",
        orderNo:"",
        metaOrderData:null,
        onProcess:false,

        quickOrderList:[],
        isQuickShow:false,

        // dutchpay
        //dutchOrderList:[{"prod_cd": "900014", "qty": 3, "set_item": []}, {"prod_cd": "1016", "qty": 4, "set_item": []}, {"prod_cd": "900022", "qty": 1, "set_item": []}, {"prod_cd": "900032", "qty": 2, "set_item": []}],
        dutchOrderList:[],
        dutchOrderToPayList:[],
        dutchOrderPaidList:[],
        dutchOrderPayResultList:[],
        dutchSelectedTotalAmt:0,
        // 1/n결제
        dutchOrderDividePaidList:[],

    },
    extraReducers:(builder)=>{
        builder.addCase(setOrder.fulfilled,(state,action)=>{
            var currentState = Object.assign({},state);
            var payload = action.payload;
            var newState = {...currentState,...payload};
            console.log("newState: ",newState);
            state.vatTotal = newState.vatTotal;
            state.grandTotal = newState.grandTotal;
            state.totalItemCnt = newState.totalItemCnt;
            state.orderList = newState.orderList;
            state.orderPayData = newState.orderPayData;
            state.orderStatus = newState.orderStatus;
            state.orgOrderNo = newState.orgOrderNo;
            state.orderNo = newState.orderNo;
            state.metaOrderData = newState.metaOrderData;
            state.onProcess = newState.onProcess;
            state.quickOrderList = newState.quickOrderList;
            state.isQuickShow = newState.isQuickShow;  
            state.dutchOrderList = newState.dutchOrderList;
            state.dutchOrderToPayList = newState.dutchOrderToPayList;
            state.dutchOrderPaidList = newState.dutchOrderPaidList;
            state.dutchOrderPayResultList = newState.dutchOrderPayResultList;
            state.dutchSelectedTotalAmt = newState.dutchSelectedTotalAmt;
            state.dutchOrderDividePaidList = newState.dutchOrderDividePaidList;
        })
        builder.addCase(initOrder.fulfilled,(state,action)=>{
            state.vatTotal = 0
            state.grandTotal = 0
            state.totalItemCnt = 0
            state.orderList = []
            state.orderPayData = {}
            state.orderStatus = []
            state.orgOrderNo = ""
            state.orderNo = ""
            state.metaOrderData = null
            state.onProcess = false
            state.quickOrderList = []
            state.isQuickShow = false  
            state.dutchOrderList = []
            state.dutchOrderToPayList = []
            state.dutchOrderPaidList = []
            state.dutchOrderPayResultList = []
            state.dutchSelectedTotalAmt = 0
            state.dutchOrderDividePaidList = []
        })
        // dutchpay
        builder.addCase(initDutchPayOrder.fulfilled, (state,action)=>{
            state.dutchOrderList = [];
            state.dutchOrderToPayList = [];
            state.dutchOrderPaidList = [];
            state.dutchOrderPayResultList=[];
            state.dutchOrderDividePaidList=[];
            state.dutchSelectedTotalAmt=0;
        })
        builder.addCase(initDutchPayOrder.rejected, (state,action)=>{

        })
        builder.addCase(initDutchPayOrder.pending, (state,action)=>{

        })  
        builder.addCase(setDutchOrderList.fulfilled, (state,action)=>{
            state.dutchOrderList = state.orderList;
        })
        builder.addCase(setDutchOrderList.rejected, (state,action)=>{

        })
        builder.addCase(setDutchOrderList.pending, (state,action)=>{

        })  
        builder.addCase(setDutchOrderToPayList.fulfilled, (state,action)=>{
            if(action.payload) {
                state.dutchOrderList = action.payload.dutchOrderList;
                state.dutchOrderToPayList = action.payload.dutchOrderToPayList;
                state.dutchOrderPaidList = action.payload.dutchOrderPaidList;
                state.dutchSelectedTotalAmt = action.payload.dutchSelectedTotalAmt;
                //var currentItems = Object.assign([],state.dutchOrderToPayList);
                //currentItems.push(action.payload);
                //state.dutchOrderToPayList = currentItems;
            }
        })
        builder.addCase(setDutchOrderToPayList.rejected, (state,action)=>{

        })
        builder.addCase(setDutchOrderToPayList.pending, (state,action)=>{

        })
        
        builder.addCase(setQuickShow.fulfilled, (state,action)=>{
            state.isQuickShow = action.payload;
        })
        // 어드민 데이터 보내기
        builder.addCase(adminDataPost.fulfilled, (state,action)=>{

        })
        builder.addCase(adminDataPost.rejected, (state,action)=>{

        })
        builder.addCase(adminDataPost.pending, (state,action)=>{

        })
        // 주문할 데이터 세팅
        builder.addCase(presetOrderData.fulfilled,(state,action)=>{
            state.metaOrderData = action.payload;
        })
        builder.addCase(presetOrderData.rejected, (state,action)=>{
            state.metaOrderData = null;
        })
        builder.addCase(presetOrderData.pending, (state,action)=>{
            state.metaOrderData = null;
        })
        // 포스로 주문 넘기기
        builder.addCase(postOrderToPos.fulfilled,(state,action)=>{
            console.log("pos order complete");
        })
        builder.addCase(postOrderToPos.rejected,(state,action)=>{
            console.log("pos order reject");
        })
        builder.addCase(postOrderToPos.pending,(state,action)=>{
            console.log("pos order pending");
        })


        // 주문 셋
        builder.addCase(setOrderList.fulfilled,(state, action)=>{
            state.orderList = action.payload;
        })
        // 주문 추가
        builder.addCase(addToOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = Object.assign([], action.payload.orderList);
                /* 
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
                state.vatTotal = action.payload.vatTotal;
                */
            }
        })
        // 주문 추가
        builder.addCase(addToOrderList.rejected,(state, action)=>{
            
        })
        // 주문 추가
        builder.addCase(addToOrderList.pending,(state, action)=>{
            
        })

        // 빠른주문주문 초기화
        builder.addCase(initToQuickOrderList.fulfilled,(state, action)=>{
            state.quickOrderList = [];
        })
        // 빠른주문주문 추가
        builder.addCase(addToQuickOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.quickOrderList = Object.assign([], action.payload.quickOrderList);
            }
        })
        // 주문 추가
        builder.addCase(addToQuickOrderList.rejected,(state, action)=>{
            
        })
        // 주문 추가
        builder.addCase(addToQuickOrderList.pending,(state, action)=>{
            
        })
        // order list empty
        builder.addCase(emptyOrderList.fulfilled,(state, action)=>{
            state.orderList = [];
        })
        // 주문 수량 수정
        builder.addCase(resetAmtOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
            }
        })
         // 주문 삭제
         builder.addCase(deleteItem.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
            }
        })
        // 주문 초기화
         builder.addCase(initOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
            }
        })
        // 주문 목록
        builder.addCase(getOrderStatus.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderStatus = action.payload;
            }
        })
        // 주문 목록 클리어
        builder.addCase(clearOrderStatus.fulfilled,(state, action)=>{
                state.orderStatus = [];
        })
        // 주문 중 상태 setOrderProcess
        builder.addCase(setOrderProcess.fulfilled,(state, action)=>{
            state.onProcess = action.payload;
        })
        
        // 더치페이
        builder.addCase(startDutchPayment.fulfilled,(state, action)=>{
            const pyaResult = action.payload;
            var currentPayResultList = state.dutchOrderPayResultList;
            var currentOrderPaidList = Object.assign([],state.dutchOrderPaidList);
            // 결제된 메뉴추가
            //var paidList = [...currentOrderPaidList,...state.dutchOrderToPayList];
            var paidList = {paidIdx:currentPayResultList.length,data:state.dutchOrderToPayList};
            currentOrderPaidList.push(paidList);
            currentPayResultList.push(action.payload);

            state.dutchOrderPaidList = currentOrderPaidList;
            state.dutchOrderPayResultList = currentPayResultList;
            state.dutchOrderToPayList = [];
            state.dutchSelectedTotalAmt = 0;

        })
        // 더치페이
        builder.addCase(startDutchPayment.rejected,(state, action)=>{
        })
        // 더치페이
        builder.addCase(startDutchPayment.pending,(state, action)=>{

        })
        // 더치페이 끝
        builder.addCase(completeDutchPayment.fulfilled,(state, action)=>{

        })
        builder.addCase(completeDutchPayment.pending,(state, action)=>{

        })
        builder.addCase(completeDutchPayment.rejected,(state, action)=>{

        })

        // 1/n페이 
        builder.addCase(startDutchSeparatePayment.fulfilled,(state, action)=>{
    
            var dutchOrderDividePaidList = Object.assign([],state.dutchOrderDividePaidList);
            dutchOrderDividePaidList.push(action.payload)
            state.dutchOrderDividePaidList = dutchOrderDividePaidList;
            
        })
        builder.addCase(startDutchSeparatePayment.pending,(state, action)=>{

        })
        builder.addCase(startDutchSeparatePayment.rejected,(state, action)=>{

        })
        
    }
});

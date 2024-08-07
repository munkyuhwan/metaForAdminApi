import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
//import { SERVICE_ID, STORE_ID } from '../resources/apiResources';
import { addOrderToPos, getOrderByTable } from '../utils/apis';
import { getIP, getStoreID, getTableInfo, grandTotalCalculate, numberPad, openPopup, openTransperentPopup, orderListDuplicateCheck, setOrderData } from '../utils/common';
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
    //console.log("postOrderDatatoadmin========================================================")
    //console.log(JSON.stringify(postOrderData))

    // 마지막 주문 팝업 추가
    const itemList = postOrderData?.ITEM_INFO
    if(itemList.length > 0) {
        itemList?.map(el=>{
            const itemDetail = allItems.filter(item => item.prod_cd == el.ITEM_CD );
            console.log("itemDetail: ",itemDetail) 
            if(itemDetail?.length>0) {
                const isPopup = itemDetail[0]?.is_popup;
                console.log("is popup: ",isPopup);
                if(isPopup == "Y") {
                    dispatch(setLastOrderItem(itemDetail[0].prod_cd));
                }
            }

        })
    }
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
    console.log("postOrderToPos ========================================================");
    //const {metaOrderData} = getState().order;
    //var orderList = Object.assign({},metaOrderData);
    const { tableStatus } = getState().tableInfo;
    const {payData,orderData} = _;
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
        postOrderData = {...postOrderData,...addOrderData};
    }  
    //console.log("orderData: ",orderList);
    // 포스로 전달
    //let orderData = {"VERSION":"0010","WORK_CD":"8020","ORDER_NO":"2312271703684313782","TBL_NO":"001","PRINT_YN":"Y","USER_PRINT_YN":"Y","PRINT_ORDER_NO":"2312271703684313782","TOT_INWON":4,"ITEM_CNT":1,"ITEM_INFO":[{"ITEM_SEQ":1,"ITEM_CD":"900022","ITEM_NM":"치즈 추가","ITEM_QTY":1,"ITEM_AMT":1004,"ITEM_VAT":91,"ITEM_DC":0,"ITEM_CANCEL_YN":"N","ITEM_GB":"N","ITEM_MSG":"","SETITEM_CNT":0,"SETITEM_INFO":[]}],"TOTAL_AMT":"50004","TOTAL_VAT":"0","TOTAL_DC":"0","ORDER_STATUS":"3","CANCEL_YN":"N","PREPAYMENT_YN":"Y","CUST_CARD_NO":"94119400","CUST_NM":"","PAYMENT_CNT":1,"PAYMENT_INFO":{"PAY_SEQ":1,"PAY_KIND":"2","PAY_AMT":"50004","PAY_VAT":"0","PAY_APV_NO":"02761105","PAY_APV_DATE":"231227113649","PAY_CART_NO":"94119400","PAY_UPD_DT":"231227113649","PAY_CANCEL_YN":"N","PAY_CART_TYPE":"신한카드","PAY_CARD_MONTH":"00"}}
    //console.log("postOrderData=================================================================");
    //console.log(JSON.stringify(postOrderData));
    const {POS_IP} = await getIP();
    try {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        const data = await callApiWithExceptionHandling(`${POS_BASE_URL(POS_IP)}`,postOrderData, {}); 
        if(data) {
            if(data.ERROR_CD == "E0000") {
                dispatch(setCartView(false));
                dispatch(initOrderList());
                dispatch(regularUpdate());
                if( tableStatus?.now_later == "선불") {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                }else {
                    openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
                    setTimeout(() => {
                        openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true, param:{timeOut:10000} });
                    }, 3000);
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
    },
    extraReducers:(builder)=>{
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

        
    }
});

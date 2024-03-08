import axios from "axios";
import { ADMIN_BANNER, ADMIN_BASE_URL, ADMIN_CALL_SERVICE, ADMIN_CATEGORIES, ADMIN_GOODS, ADMIN_OPTION, ADMIN_POST_BULLETIN, ADMIN_POST_CALL_SERVICE, ADMIN_TABLE_STATUS, POS_BASE_URL_REAL, POS_BASE_URL_TEST, POS_ORDER_ADD, POS_ORDER_NEW, POS_POST_MENU_EDIT, POS_POST_MENU_STATE, POS_POST_ORDER, POS_POST_ORDER_CANCEL, POS_POST_TABLE_LIST/* , SERVICE_ID, STORE_ID  */} from "../resources/apiResources";
import { errorHandler, posErrorHandler } from "./errorHandler/ErrorHandler";
import {isEmpty} from "lodash";
import { getStoreID, numberPad, openPopup, openTransperentPopup } from "./common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initOrderList } from "../store/order";
import { setCartView } from "../store/cart";
import LogWriter from "./logWriter";
import { EventRegister } from "react-native-event-listeners";

const posOrderHeadr = {Accept: 'application/json','Content-Type': 'application/json'}
const adminOrderHeader = {'Content-Type' : "text/plain"};


export const  posOrderNew = async (resolve,reject) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()

    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL_REAL}${POS_ORDER_NEW}`,
            {"STORE_ID":STORE_ID,"SERVICE_ID":SERVICE_ID},
            posOrderHeadr, 
        ) 
        .then((response => { 
            resolve(response);
        })) 
        .catch(error=>reject(error.response.data));
    })
}
export const  posMenuState = async (dispatch) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });

    var lastUpdate="";
    try {
        lastUpdate = await AsyncStorage.getItem("lastUpdate");
        if(lastUpdate == null || lastUpdate== "") {
            lastUpdate = `20200101000000`;
        }
    }catch(err) {
        lastUpdate = `20200101000000`;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_MENU_STATE}`,
            {"STORE_ID":STORE_ID,"SERVICE_ID":SERVICE_ID, "UPDATE_CHECK_DTIME":lastUpdate},
            posOrderHeadr,  
        ) 
        .then((response => { 
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        }))
        .catch(error=>reject(error.response.data));
    })
}
// 포스 메뉴 받기
export const  posMenuEdit = async(dispatch) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    if(isEmpty(STORE_ID) || isEmpty(SERVICE_ID)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_MENU_EDIT}`,
            {"STORE_ID":STORE_ID},
            posOrderHeadr,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data.OBJ[0].ITEM_GROUP_LIST;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    }) 
}


export const posTableList = async(dispatch) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_TABLE_LIST}`,
            {"STORE_ID":STORE_ID,"SERVICE_ID":SERVICE_ID},
            posOrderHeadr,
        )  
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data.OBJ.TABLE_LIST;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    }) 
}
// 새로운 오더
export const postOrderToPos = async(dispatch, data) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    
    return await new Promise(function(resolve, reject){
        if(isEmpty(data) ) {
            posErrorHandler(dispatch, {ERRCODE:'XXXX',MSG:"메뉴를 선택 해 주세요.",MSG2:""});
            reject();
            return;
        }
        var postData = {
            "DISC_AMT": data.DISC_AMT, 
            "FLR_CODE": data.FLR_CODE, 
            "ITEM_LIST": [], 
            "MCHT_ORDERNO": data.MCHT_ORDERNO, 
            "MEMB_TEL": data.MEMB_TEL, 
            "OEG_ORDER_PAY_AMT": data.OEG_ORDER_PAY_AMT, 
            "ORDERNO": data.ORDERNO, 
            "ORDER_MEMO": data.ORDER_MEMO, 
            "ORDER_PAY_AMT": data.ORDER_PAY_AMT, 
            "ORDER_PRT_FLAG": data.ORDER_PRT_FLAG, 
            "ORD_PAY_LIST":data.ORD_PAY_LIST, 
            "ORG_ORDERNO": data.ORG_ORDERNO, 
            "OS_GBN": data.OS_GBN, 
            "PREPAY_FLAG": data.PREPAY_FLAG,
            "REPT_PRT_FLAG": data.REPT_PRT_FLAG, 
            "SERVICE_ID": data.SERVICE_ID, 
            "STORE_ID":data.STORE_ID, 
            "TBL_CODE": data.TBL_CODE
        };
        let itemList = data.ITEM_LIST;
        let newItemList = [];
        itemList.map((item)=>{
            let newItem = Object.assign({},item)
            let addItemList= newItem.ADDITIVE_ITEM_LIST;
            let newAddItem = [];
            addItemList.map((addItem)=>{
                newAddItem.push(addItem.menuOptionSelected);
            })
            newItem.ADDITIVE_ITEM_LIST = newAddItem;
            newItemList.push(newItem);
        })
        postData.ITEM_LIST = newItemList;
        //console.log("post dta: ",postData);
        axios.post(
            `${POS_BASE_URL_REAL}${POS_ORDER_NEW}`,
            {
                "STORE_ID":STORE_ID,
                "SERVICE_ID":SERVICE_ID,
                ...postData
            },
            posOrderHeadr,
        )  
        .then((response => {
            const lw = new LogWriter();
            const logPosResponse = `\nPOST POS RESPONSE DATA==================================\ndata:${JSON.stringify(response)}\n`
            lw.writeLog(logPosResponse);

            if(posErrorHandler(dispatch, response.data)){
                const responseData = response.data
                if(responseData){
                    if(responseData?.OBJ) {
                        const orderNo = responseData?.OBJ?.ORDERNO;
                        const orgOrderNo = responseData?.OBJ?.ORG_ORDERNO;
                        const mchtOrderNo = responseData?.OBJ?.MCHT_ORDERNO;
                        const posOrderNo = responseData?.OBJ?.POS_ORDERNO;
                        const orderData = {"ORDERNO":orderNo,"ORG_ORDERNO":orgOrderNo,"MCHT_ORDERNO":mchtOrderNo, }
                        AsyncStorage.setItem("orderResult",JSON.stringify(orderData));
                    }
                }
                openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true});
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                dispatch(initOrderList());
                dispatch(setCartView(false));
                resolve(responseData); 
            }else {
                reject();
            } 
        }))
        .catch(error=>reject(error.response.data));
    }) 
}
// 오더 추가
export const addOrderToPos = async(dispatch, data) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        if(isEmpty(data) ) {
            posErrorHandler(dispatch, {ERRCODE:'XXXX',MSG:"메뉴를 선택 해 주세요.",MSG2:""});
            reject();
            return;
        } 
        var postData = {
            "DISC_AMT": data.DISC_AMT, 
            "FLR_CODE": data.FLR_CODE, 
            "ITEM_LIST": [], 
            "MCHT_ORDERNO": data.MCHT_ORDERNO, 
            "MEMB_TEL": data.MEMB_TEL, 
            "OEG_ORDER_PAY_AMT": data.OEG_ORDER_PAY_AMT, 
            "ORDERNO": data.ORDERNO, 
            "ORDER_MEMO": data.ORDER_MEMO, 
            "ORDER_PAY_AMT": data.ORDER_PAY_AMT, 
            "ORDER_PRT_FLAG": data.ORDER_PRT_FLAG, 
            "ORD_PAY_LIST":data.ORD_PAY_LIST, 
            "ORG_ORDERNO": data.ORG_ORDERNO, 
            "OS_GBN": data.OS_GBN, 
            "PREPAY_FLAG": data.PREPAY_FLAG,
            "REPT_PRT_FLAG": data.REPT_PRT_FLAG, 
            "SERVICE_ID": data.SERVICE_ID, 
            "STORE_ID":data.STORE_ID, 
            "TBL_CODE": data.TBL_CODE
        };
        //console.log("post dta: ",postData);
        let itemList = data.ITEM_LIST;
        let newItemList = [];
        itemList.map((item)=>{
            let newItem = Object.assign({},item)
            let addItemList= newItem.ADDITIVE_ITEM_LIST;
            let newAddItem = [];
            addItemList.map((addItem)=>{
                newAddItem.push(addItem.menuOptionSelected);
            })
            newItem.ADDITIVE_ITEM_LIST = newAddItem;
            newItemList.push(newItem);
        })
        postData.ITEM_LIST = newItemList;
 
        axios.post(
            `${POS_BASE_URL_REAL}${POS_ORDER_ADD}`,
            {
                "STORE_ID":STORE_ID,
                "SERVICE_ID":SERVICE_ID,
                ...postData
            },
            posOrderHeadr,
        )  
        .then((response => {
            const lw = new LogWriter();
            const logPos = `\nPOST POS ADD DATA RESPONSE==================================\ndata:${JSON.stringify(response)}\n`
            lw.writeLog(logPos);
            
            if(posErrorHandler(dispatch, response.data)){
                const responseData = response.data
                openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true});
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                dispatch(initOrderList());
                dispatch(setCartView(false));
                resolve(responseData); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
        
    }) 

}
// 테이블 주문 체크
export const checkTableOrder = async(dispatch, data ) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        if(isEmpty(data.tableInfo) ) {
            posErrorHandler(dispatch, {ERRCODE:'XXXX',MSG:"테이블을 선택 해 주세요.",MSG2:""});
            reject();
            return;
        }
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_ORDER}`,
            {
                "STORE_ID":STORE_ID,
                "SERVICE_ID":SERVICE_ID,
                "FLR_CODE":data.tableInfo.FLR_CODE,
                "TBL_CODE":data.tableInfo.TBL_CODE,
            },
            posOrderHeadr,
        )  
        .then( response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                const obj = data.OBJ;
                const orderList = obj.ORDER_LIST;
                // SMRO000068-접수 / SMRO000069-완료 / SMRO000070-취소 / SMRO000071-반품 / SMRO000088-결제완료
                // SMRO000068-접수 / SMRO000069-완료 경우 추가 주문
                //console.log(orderList.length)
                const orderStatus = orderList.filter(el=> (el.ORDER_STATUS ==  "SMRO000068"||el.ORDER_STATUS ==  "SMRO000069")  );
                const isAdd = orderStatus?.length>0;
                //console.log(orderStatus.length)
                /* 
                orderStatus.map((el)=>{
                    console.log("===============================================================");
                    console.log(el);
                    console.log();
                    console.log("===============================================================");
                })
                 */
                //if(orderList.length > 0 ) {
                    resolve({hasOrderList:true, orderNo:orderList[0]?.ORDERNO, mchatOrderNo:orderStatus[0]?.MCHT_ORDERNO, orgOrderNo:orderStatus[0]?.ORG_ORDERNO, isAdd:isAdd })
                //}else {
                //    resolve({hasOrderList:false, orderNo:orderList[0].ORDERNO, isAdd:isAdd })
                //}
            }
        })
        .catch(err=>{
            console.log("check err: ",err);
            reject();

        })
    });
}

export const cancelOrder = async(dispatch, data) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        if(isEmpty(data.tableInfo) ) {
            posErrorHandler(dispatch, {ERRCODE:'XXXX',MSG:"테이블을 선택 해 주세요.",MSG2:""});
            reject();
            return;
        }
        console.log("============================================================================");
        console.log("tableINfo: ",data.tableInfo);
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_ORDER_CANCEL}`,
            {
                "STORE_ID":STORE_ID,
                "SERVICE_ID":SERVICE_ID,
                "ORG_ORDERNO":"TO202311020006162",
                "ORD_PAY_LIST":[{"AUTH_DATE": "", "AUTH_NO": "", "AUTH_TIME": "", "BEE_AUTH_DATE": "", "BEE_AUTH_NO": "", "BEE_AUTH_TIME": "", "CAN_FLAG": "", "CAN_PAY_SEQ": 0, "CARD_ACQHID": "", "CARD_ACQ_NAME": "", "CARD_ACSHID": "", "CARD_MCHTNO": "", "CARD_NO": "", "CARD_PAY_TYPE": "", "CASH_AUTH_TYPE": "", "CRD_HID_NAME": "", "DDCEDI": "", "ISTM_TERM": "", "ORDERNO": "", "PAY_SEQ": 0, "PAY_TYPE": "", "SALE_AMT": 0, "SALE_VAT_AMT": 0, "SVC_AMT": 0, "TML_NO": ""}]
            },
            posOrderHeadr,
        )  
        .then( response => {
            if(posErrorHandler(dispatch, response.data)){
               
                resolve();
            }
        })
        .catch(err=>{
            console.log("check err: ",err);
            reject();

        })
    });

}

// 테이블 주문목록 받아오기
export const getOrderByTable = async(dispatch, data) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        if(isEmpty(data.tableInfo) ) {
            posErrorHandler(dispatch, {ERRCODE:'XXXX',MSG:"테이블을 선택 해 주세요.",MSG2:""});
            reject();
            return;
        }
        
        axios.post(
            `${POS_BASE_URL_REAL}${POS_POST_ORDER}`,
            {
                "STORE_ID":STORE_ID,
                "SERVICE_ID":SERVICE_ID,
                "FLR_CODE":data.tableInfo.FLR_CODE,
                "TBL_CODE":data.tableInfo.TBL_CODE,
            },
            posOrderHeadr,
        )  
        .then( (response => {
            if(posErrorHandler(dispatch, response.data)){
                const responseData = response.data
                if(responseData.RESULT=="SUCCESS") {
                    //console.log("responseData: ",responseData);
                    const obj = responseData.OBJ;
                    const orderList = obj.ORDER_LIST;
                    
                    const orderData = (data?.orderData);
                    let filteredData = orderList.filter(el=>el.ORG_ORDERNO == orderData.ORG_ORDERNO);

                    if(filteredData.length <=0) {
                        filteredData = [];
                    }
                    
                    resolve(filteredData); 

                }else {
                    reject();
                }
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}

///// 관리자 apis


// 관리자 메뉴 받기
export const adminMenuEdit = async(dispatch) => {
    //let data = '{"STORE_ID":12312001}'
    const {STORE_IDX} = await getStoreID()
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_GOODS}`,
            {STORE_ID:STORE_IDX},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}
// 관리자 옵션 받기
export const adminOptionEdit = async(dispatch) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    //let data = '{"STORE_ID":12312001}'
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_OPTION}`,
            {"STORE_ID":STORE_ID},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}
// 관리자 카테고리 받기
export const getAdminCategories = async(dispatch) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    //let data = '{"STORE_ID":12312001}'
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_CATEGORIES}`,
            {"STORE_ID":STORE_ID},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}

// 관리자 직원호출 목록 받기
export const getAdminServices = async(dispatch) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    //let data = '{"STORE_ID":12312001}'
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_CALL_SERVICE}`,
            {"STORE_ID":SERVICE_ID},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}

// 관리자 직원호출 하기
export const postAdminServices = async(dispatch,data) => {
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    //let data = '{"STORE_ID":12312001}'    
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_POST_CALL_SERVICE}`,
            data,
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}

// 관리자 테이블 상태 받아오기
export const getAdminTableStatus = async(dispatch,data) => {
    const {STORE_IDX} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID 입력 해 주세요.',MSG2:""})
    });

    const TABLE_INFO =  await AsyncStorage.getItem("TABLE_INFO")
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'테이블 번호를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_TABLE_STATUS}`,
            {"STORE_ID":STORE_IDX, "t_num":TABLE_INFO},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data);
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}

// 관리자 직원호출 하기
export const postAdminBulletin = async(dispatch) => {
    const {STORE_IDX} = await getStoreID()
    //let data = '{"STORE_ID":12312001}'    
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_POST_BULLETIN}`,
            {"STORE_ID":STORE_IDX},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data?.data); 
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}
// 관리자 배너 받아오기
export const getAdminBanners = async(dispatch) => {
    const {STORE_IDX, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_BANNER}`,
            {"STORE_ID":STORE_IDX},
            adminOrderHeader,
        ) 
        .then((response => {
            if(posErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data);
            }else {
                reject();
            } 
        })) 
        .catch(error=>reject(error.response.data));
    })
}
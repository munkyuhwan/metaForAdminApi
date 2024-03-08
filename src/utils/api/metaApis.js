import axios from "axios";
import { posErrorHandler } from "../errorHandler/ErrorHandler";

import { POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_IS_MENU_CHANGE, POS_WORK_CD_MAIN_CAT, POS_WORK_CD_MENU_ITEMS, POS_WORK_CD_MID_CAT, POS_WORK_CD_REQ_STORE_INFO, POS_WORK_CD_SET_GROUP_INFO, POS_WORK_CD_SET_GROUP_ITEM_INFO, POS_WORK_CD_TABLE_CAN_LOCK, POS_WORK_CD_TABLE_INFO, POS_WORK_CD_TABLE_LOCK, POS_WORK_CD_TABLE_ORDER_LIST, POS_WORK_CD_VERSION } from "../../resources/apiResources";
import { displayErrorPopup, metaErrorHandler } from "../errorHandler/metaErrorHandler";
import { getIP, getStoreID, getTableInfo, openPopup } from "../common";
import { EventRegister } from "react-native-event-listeners";
import {isEmpty} from 'lodash';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { postOrderLog } from "./adminApi";
import { ERROR_CODE, ERROR_STRING, SUCCESS_CODE, SUCCESS_STRING } from "../../resources/defaults";

const posOrderHeader = {Accept: 'application/json','Content-Type': 'application/json'}
const adminOrderHeader = {'Content-Type' : "text/plain"};

// 포스 메인카테고리
export const  getPosMainCategory = async(dispatch) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MAIN_CAT,PROD_L1_CD:"",PROD_L1_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const catMainList = data.PROD_L1_LIST;
                resolve(catMainList);
            }else {
                EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            }     
        })) 
        .catch(error=>{
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 포스 중 카테고리
export const  getPosMidCategory = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const selectedMainCategory = data?.selectedMainCategory;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MID_CAT, PROD_L1_CD:selectedMainCategory, PROD_L2_CD:"", PROD_L2_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const catMidList = data.PROD_L2_LIST;
                resolve(catMidList);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 전체 메뉴 받아오기
export const getPosItemsAll = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MENU_ITEMS, PROD_L1_CD:"", PROD_L2_CD:"",PROD_L3_CD:"", PROD_CD:"",PROD_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const itemList = data.PROD_LIST;
                resolve(itemList);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 포스 카테고리별 메뉴 받아오기
export const getPosItemsWithCategory = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {selectedMainCategory,selectedSubCategory,menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MENU_ITEMS, PROD_L1_CD:selectedMainCategory, PROD_L2_CD:selectedSubCategory=="0000"?"":selectedSubCategory,PROD_L3_CD:"", PROD_CD:menuDetailID?menuDetailID:"",PROD_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const itemList = data.PROD_LIST;
                resolve(itemList);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 세트 그룹 받기
export const getPosSetGroup = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_SET_GROUP_INFO, PROD_CD:menuDetailID?menuDetailID:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const setgrpInfo = data.SETGRP_INFO;
                resolve(setgrpInfo);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 세트 그룹 아이템 받기
export const getPosSetGroupItem = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {menuOptionGroupCode} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_SET_GROUP_ITEM_INFO, GROUP_NO:menuOptionGroupCode?menuOptionGroupCode:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const setgrpItemInfo = data.SETITEM_INFO;
                resolve(setgrpItemInfo);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 주문하기 
export const postMetaPosOrder = async(dispatch, data) =>{
    EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"주문 중 입니다."})
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const tableNo = await getTableInfo().catch({TABLE_INFO:""});
    const storID = await AsyncStorage.getItem("STORE_IDX").catch("");

    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            data,
            posOrderHeader,
        ) 
        .then((response => {
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            if(metaErrorHandler(dispatch, response?.data)) {
                //console.log("true");
                //openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true});
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve({result:SUCCESS_STRING,code:SUCCESS_CODE})
            } else {
                if(response?.data){
                    const ERROR_CD = response?.data?.ERROR_CD;
                    const ERROR_MSG = response?.data?.ERROR_MSG;
                    const postData = {"storeID":storID,"tableNo":tableNo?.TABLE_INFO,"ERROR_CD":ERROR_CD,"ERROR_MSG":ERROR_MSG, "orderData":JSON.stringify(data),"time":moment().format("YYYY-MM-DD HH:mm:ss")};
                    postOrderLog(postData);

                    /* 
                    const date = new Date();
                    let logdata = {
                        time:`${date.getFullYear()}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}`,
                        storeID: `${storID}`,
                        tableNo:`${tableNo.TABLE_INFO}`,
                        auData:JSON.stringify([{date:`${date.getFullYear()}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}`, AuNo:``,TrdAmt:`` }]),
                        orderList:JSON.stringify(data),
                        payResult:JSON.stringify(postData)
                    }
                    postOrderLog(logdata);
                     */
                }else {

                }
                resolve({result:ERROR_STRING,code:ERROR_CODE})

                //reject({});
            }
        })) 
        .catch(error=>{
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 포스 주문전송 실패시 재전송
export const repostMetaPosOrder = async(dispatch, data) =>{
    EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"주문 재요청 중 입니다."})
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            data,
            posOrderHeader,
        ) 
        .then((response => {
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            if(metaErrorHandler(dispatch, response?.data)) {
                //console.log("true");
                //openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true});
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve({result:SUCCESS_STRING,code:SUCCESS_CODE})
            } else {
                EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
                resolve({result:ERROR_STRING,code:ERROR_CODE})
                if(response?.data){
                    const ERROR_CD = response?.data?.ERROR_CD;
                    const ERROR_MSG = response?.data?.ERROR_MSG;
                    const postData = {"storeID":storID,"tableNo":tableNo?.TABLE_INFO,"ERROR_CD":ERROR_CD,"ERROR_MSG":ERROR_MSG, "orderData":JSON.stringify(data),"time":moment().format("YYYY-MM-DD HH:mm:ss")};
                    postOrderLog(postData);
                    
                }
            }
        })) 
        .catch(error=>{
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}


// 테이블 주문 목록 받기
export const getTableOrderList = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {TABLE_INFO} = await getTableInfo()
    if(isEmpty(TABLE_INFO)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'테이블 정보가 없습니다.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_TABLE_ORDER_LIST,
                "TBL_NO" : TABLE_INFO
            },
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const itemInfo = response?.data?.ITEM_INFO;
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve(itemInfo)
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 테이블 주문 목록 받기
export const getTableListInfo = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    if(!data?.floor) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'층을 선택 해 주세요.',MSG2:""})
        return;
    }

    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_TABLE_INFO,
                "FLOOR" : data?.floor,
                "TBL_NO":"",
                "TBL_NM":"",
            },
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const itemInfo = response?.data?.TBL_LIST;
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve(itemInfo)
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 매장 정보 요청
export const getStoreInfo = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    .catch((err)=>{
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});      
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP 가져오기 실패.',MSG2:""})
    }
    )
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_REQ_STORE_INFO,
                "ACCESS_CODE" : "NICE"

            },
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});  
                resolve(response?.data)
            }    
        })) 
        .catch(error=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});   
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 메뉴 업데이트 체크
export const  getMenuUpdateState = async (dispatch) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    var lastUpdate="";
    try {
        lastUpdate = await AsyncStorage.getItem("lastUpdate");
        if(lastUpdate == null || lastUpdate== "") {
            lastUpdate = `2018-08-01 12:13:02`;
        }
    }catch(err) {
        lastUpdate = `2018-08-01 12:13:02`;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_IS_MENU_CHANGE,
                "PROD_L1_CD" : "",
                "PROD_L2_CD" : "",
                "PROD_L3_CD" : "",
                "PROD_CD" : "",
                "UPD_DT" : lastUpdate,
            },
            posOrderHeader,
        ) 
        .then((response => { 
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            if(metaErrorHandler(dispatch, response.data)){
                const data = response.data;
                resolve(data); 
            }else {
                //reject();
            } 
        }))
        .catch(error=>{
            console.log("error: ",error)    
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    })
}

// 주문 가능 여부 체크
export const getTableAvailability = async(dispatch) =>{
    const {POS_IP} = await getIP()
    .catch((err)=>{
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP 가져오기 실패.',MSG2:""})
        return;
    }
    )
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {TABLE_INFO} = await getTableInfo()
    if(isEmpty(TABLE_INFO)) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'테이블 정보가 없습니다.',MSG2:""})
        return;
    }
 
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_TABLE_LOCK,
                "TBL_NO" : TABLE_INFO,
                "LOCK_SW":"0"
            },
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
                resolve(response?.data)
            } else {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
            }
        })) 
        .catch(error=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
     
}


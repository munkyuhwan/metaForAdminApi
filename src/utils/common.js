import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFullPopupContent, setFullPopupVisibility, setPopupContent, setPopupVisibility, setTransPopupContent, setTransPopupVisibility } from '../store/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEqual} from 'lodash';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { addImageStorage } from '../store/imageStorage';
import { getAD, setAdImgs } from '../store/ad';
import { fetch } from "@react-native-community/netinfo";
// device info
import DeviceInfo, { getUniqueId, getManufacturer } from 'react-native-device-info';
import moment from 'moment';
import { ADMIN_API_BASE_URL, ADMIN_API_MENU_CHECK, ADMIN_API_MENU_UPDATE } from '../resources/newApiResource';
import { callApiWithExceptionHandling } from './api/apiRequest';
import { EventRegister } from 'react-native-event-listeners';
import { displayErrorNonClosePopup, displayErrorPopup } from './errorHandler/metaErrorHandler';
import { getPosStoreInfo, getTableAvailability } from './api/metaApis';
import { getAdminCategories } from '../store/categories';
import { getAdminItems, regularUpdate } from '../store/menu';
import { getAdminBulletin } from '../store/menuExtra';
import { setMonthPopup } from '../store/monthPopup';
import { PAY_SEPRATE_AMT_LIMIT } from '../resources/defaults';
import { initDispatchPopup, setDispatchPopup } from '../store/dispatchPopup';

export const waitFor = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay)) //이와 같이 선언 후


export function getDeviceInfo () {
    DeviceInfo.getBatteryLevel().then((batteryLevel) => {
        //console.log("batteryLevel: ",batteryLevel)
    });
}

export function openPopup (dispatch, {innerView, isPopupVisible, param}) {
    if(isPopupVisible) {
        dispatch(setPopupContent({innerView:innerView,param:param})); 
        dispatch(setPopupVisibility({isPopupVisible:isPopupVisible}));    
    }else {
        dispatch(setPopupVisibility({isPopupVisible:isPopupVisible}));        
        dispatch(setPopupContent({innerView:innerView})); 
    }
}
export function openTransperentPopup (dispatch, {innerView, isPopupVisible, param}) {
    if(isPopupVisible) {
        dispatch(setTransPopupContent({innerView:innerView,param:param})); 
        dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible,param:param}));    
    }else {
        dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible,param:param}));    
        const disapearTimeout = setInterval(()=>{
            dispatch(setTransPopupContent({innerView:innerView,param:param})); 
            clearInterval(disapearTimeout);
        },500)
    } 
    dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible}));    
}

export function openFullSizePopup (dispatch, {innerFullView, isFullPopupVisible}) {
    if(isFullPopupVisible) {
        dispatch(setFullPopupContent({innerFullView:innerFullView})); 
        dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
    }else {
        dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
        const disapearTimeout = setInterval(()=>{
            dispatch(setFullPopupContent({innerFullView:innerFullView})); 
            clearInterval(disapearTimeout);
        },500)
    } 
    dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
}

export function numberWithCommas(x) {
    if(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }else {
        return "0";
    }
}

export function grandTotalCalculate(data) {
    let amt = 0;
    let itemCnt = 0;
    let vatTotal = 0;
    if(data) {
        data?.map(el=>{
            vatTotal += Number(el?.ITEM_VAT)*Number(el.ITEM_QTY);
            amt += Number(el.ITEM_AMT);
            itemCnt += Number(el.ITEM_QTY);
        })
    }
    return {grandTotal:amt, itemCnt:itemCnt, vatTotal:vatTotal};
}

export function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

export async function getStoreID() {
    return await new Promise(function(resolve, reject){
        AsyncStorage.getItem("STORE_IDX")
        .then((STORE_IDX)=>{
            if(STORE_IDX) {
                resolve({STORE_IDX  })
            }else {
                reject();                
            }
        })
    })
}

export async function getIP() {
    return await new Promise(function(resolve, reject){
        AsyncStorage.getItem("POS_IP")
        .then((POS_IP)=>{
            if(POS_IP) {
                resolve({POS_IP})
            }else {
                reject();                
            }
        })
        .catch(err=>{
            reject();
        })
    })
}

export async function getTableInfo() {
    return await new Promise(function(resolve, reject){
        AsyncStorage.getItem("TABLE_INFO")
        .then((TABLE_INFO)=>{
            if(TABLE_INFO) {
                resolve({TABLE_INFO})
            }else {
                reject();                
            }
        })
    })
}
export function setOrderData (data, orderList) {
    if(data?.length<0) return;
    
    let setMenuData = 
        {
            "ITEM_SEQ" : 0,
            "ITEM_CD" : "",
            "ITEM_NM" : "",
            "ITEM_QTY" : 0,
            "ITEM_AMT" : 0,
            "ITEM_VAT" : 0,
            "ITEM_DC" : 0,
            "ITEM_CANCEL_YN" : "N",
            "ITEM_GB" : "N",
            "ITEM_MSG" : "",
            "SETITEM_CNT" : 0,
            "SETITEM_INFO" : 
            [
            ] 
        }
        setMenuData.ITEM_SEQ=orderList.length+1;
        setMenuData.ITEM_CD = data?.prod_cd;
        setMenuData.ITEM_NM= data?.gname_kr;
        setMenuData.ITEM_QTY=  1;
        setMenuData.ITEM_AMT=  data?.sal_tot_amt;
        setMenuData.ITEM_VAT=  data?.sal_vat;
        setMenuData.ITEM_DC = 0;
        setMenuData.ITEM_CANCEL_YN= "N";
        setMenuData.ITEM_GB =  "N"; //포장 여부 포장"T"
        setMenuData.ITEM_MSG = "";
        setMenuData.SETITEM_CNT = 0;
        setMenuData.SETITEM_INFO=[];
      
    return setMenuData;
}

// 주문 리스트 중복 체크
export function orderListDuplicateCheck (currentOrderList, orderData) {
    //console.log("new order: ",orderData);
    var tmpOrderList = Object.assign([], currentOrderList);
    if(currentOrderList.length>0) {
        // 중복 체크
        //tmpOrderList.push(orderData);
        const duplicateCheck = tmpOrderList.filter(el=>el.ITEM_CD == orderData?.ITEM_CD&& isEqual(el.SETITEM_INFO,orderData?.SETITEM_INFO));
        if(duplicateCheck.length > 0) {
            //console.log("duplicateCheck: ",duplicateCheck);
            let duplicatedIndex = -1;
            tmpOrderList.map((el,index)=>{
                if(el.ITEM_CD == orderData?.ITEM_CD&& isEqual(el.SETITEM_INFO,orderData?.SETITEM_INFO)) {
                    duplicatedIndex = index;
                }
            })
            let addedQty = tmpOrderList[duplicatedIndex].ITEM_QTY+1;
            let addedPrice = orderData?.ITEM_AMT*addedQty;
            tmpOrderList[duplicatedIndex] = Object.assign({},{...tmpOrderList[duplicatedIndex],...{ITEM_QTY:addedQty,ITEM_AMT:addedPrice}})
     
        }else {
            tmpOrderList.unshift(orderData);
        }
        return tmpOrderList;
    }else {
        
        return [orderData];
    }
}

// 파일 다운로드
export async function fileDownloader(dispatch, name,url) {
    const ext = url.split(".");
    const extensionType = ext[ext.length-1]
    return await new Promise(function(resolve, reject){
        RNFetchBlob.config({
            fileCache: true
        })
        .fetch("GET", url)
        // the image is now dowloaded to device's storage
        
        .then( (resp) => {
          // the image path you can use it directly with Image component
            imagePath = resp.path();
            //console.log("create path=======",name);
            //console.log("create and read file")
            return resp.readFile("base64");
        })
        .then( async (base64Data) => {
            // here's base64 encoded image
            dispatch(addImageStorage({name:name,imgData:`data:image/${extensionType};base64,`+base64Data}));
            //console.log("add to store=======",base64Data);
            // remove the file from storage
            //console.log("get base 64");
            //console.log("====================================")
            resolve({name:name,data:base64Data});
            fs.unlink(imagePath);
            //return fs.unlink(imagePath);
        
        })
        .catch(ee=>{
            reject()
        })
    })
}

// 파일 다운로드
export async function adFileDownloader(dispatch, name,url) {
    const ext = url.split(".");
    const extensionType = ext[ext.length-1]
    return await new Promise(function(resolve, reject){
        RNFetchBlob.config({
            fileCache: true
        })
        .fetch("GET", url)
        // the image is now dowloaded to device's storage
        .then( (resp) => {
          // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
        })
        .then( async (base64Data) => {
            //dispatch(addImageStorage({name:name,imgData:`data:image/${extensionType};base64,`+base64Data}));
            //dispatch(addImageStorage({name:name,imgData:`data:image/${extensionType};base64,`+base64Data}));
            dispatch(setAdImgs({name:name,imgData:`data:image/${extensionType};base64,`+base64Data}))
            resolve({name:name,data:base64Data});
            return fs.unlink(imagePath);
            
        })
        .catch(ee=>{
            reject()
        })
    })
}
export const isAvailable = (item) => {
    const startTimeAm = Number(`${item?.use_timea}${item?.use_timeaa}`);
    const endTimeAm = Number(`${item?.use_timeb}${item?.use_timebb}`);

    const startTimePm = Number(`${item?.use_time1a}${item?.use_time1aa}`);
    const endTimePm = Number(`${item?.use_time1b}${item?.use_time1bb}`);
    
    const currentTime = Number(moment().format("HHmm"));
    const hourNow = Number(moment().format("HH"));
    
    const amTimes = [item?.use_timea,item?.use_timeaa,item?.use_timeb,item?.use_timebb];
    const pmTimes = [item?.use_time1a,item?.use_time1aa,item?.use_time1b,item?.use_time1bb];

    const emptyAm = amTimes.filter(el=>el == "");
    const emptyPm = pmTimes.filter(el=>el == "");

    var isAmPass = true;
    var isPmPass = true;

    // 수량 오전 오후 시간 설정이 안되어 있다면 그냥 판매
    if(emptyAm?.length>0 && emptyPm?.length >0) {
        return true;
    }else {
        if(emptyAm?.length>0 && emptyPm?.length <=0) {
            // 오전만 비있다.
            if(currentTime>=startTimePm && currentTime<=endTimePm ) {
            }else {
                // 현재 시간이 오후에 해당되는 시간이 아니다
                return false;
            }
        }

        if(emptyAm?.length<=0 && emptyPm?.length>0) {
            // 오후만 비있다.
            if(currentTime>=startTimePm && currentTime<=endTimePm ) {
            }else {
                // 현재 시간이 오전에 해당하는 시간이 아니다.
                return false;

            }
        }

    }




    // 1. 수량제한 시간이 있는지 확인 
    if(emptyAm?.length <= 0) {
        // 오전 시간 설정 되어 있다면 체크
        if(currentTime>=startTimeAm && currentTime<=endTimeAm ) {
            //현 시간이 오전시간 사이에 있으면 판매중 
            isAmPass = true;
        }else {
            isAmPass = false;
        }
    }
    if(emptyPm?.length <= 0) {
        // 오후 시간 설정 되어 있다면 체크
        if(currentTime>=startTimePm && currentTime<=endTimePm ) {
            //현 시간이 오전시간 사이에 있으면 판매중 
            isPmPass = true;
        }else {
            isPmPass = false;
        }
    }
    return isAmPass || isPmPass;
    // 2. 시간이 수량제한1에 해당하는지 2에 해당하는지 확인 해 함.


   /*  const startTimeAm = Number(`${item?.use_timea}${item?.use_timeaa}`);
    const endTimeAm = Number(`${item?.use_timeb}${item?.use_timebb}`);

    const startTimePm = Number(`${item?.use_time1a}${item?.use_time1aa}`);
    const endTimePm = Number(`${item?.use_time1b}${item?.use_time1bb}`);
    
    const currentTime = Number(moment().format("HHmm"));
    const hourNow = Number(moment().format("HH"));

    if(hourNow<12) {
        return currentTime>startTimeAm && currentTime<endTimeAm
    }else {
        return currentTime>startTimePm && currentTime<endTimePm
    } */
}

// 인터넷 연결 체크
export const isNetworkAvailable = async () => {
    return new Promise((resolve, reject) =>{
        fetch().then(state => {
            if(state.isConnected == true) {
                resolve(true);
            }else {
                resolve(false);
            }
        })
        .catch(err=>{
            reject();
        })
        ;
    } )
}

// 주문 가능 여부 체크
export const itemEnableCheck = async (STORE_IDX, items) => {
    var checkItemList = [];
    const rearrangeList = (checkItem) =>{
        const duplicated = checkItemList.filter(el=>el.prod_cd == checkItem.prod_cd);
        var excepted = checkItemList.filter(el=>el.prod_cd != checkItem.prod_cd);
        if(duplicated?.length>0) {
            // 중복이 있으면 카운트를 올린다.
            // duplicated[0]?.qty 앞에 저장된 수량, items[i].qty 추가될 수량
            const qtyChanged = {prod_cd:checkItem.prod_cd, qty:Number(duplicated[0]?.qty)+Number(checkItem.qty)};
            excepted.push(qtyChanged);
            checkItemList = Object.assign([],excepted);
        }else {
            // 중복이 없으면 그냥 배열에 추가
            checkItemList.push(checkItem);
        }

    }
    for(var i=0;i<items.length;i++) {
        const itemSet = {prod_cd:items[i].prod_cd,qty:items[i].qty};
        // 이미 있는지 확인
        rearrangeList(itemSet);
        const setItems = items[i].set_item;
        for(var j=0;j<setItems.length;j++) {
            const setItemSet = {prod_cd:setItems[j].optItem,qty:setItems[j].qty};
            rearrangeList(setItemSet);
        }
    }
    //console.log("==============================================================================");
    console.log("url: ",`${ADMIN_API_BASE_URL}${ADMIN_API_MENU_CHECK}`)
    console.log("checkItemList: ",{"STORE_ID":`${STORE_IDX}`,"order":checkItemList});

    return new Promise((resolve,reject)=>{
        callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_MENU_CHECK}`,{"STORE_ID":`${STORE_IDX}`,"order":checkItemList}, {})
        .then((response)=>{
            if(response) {
                if(response?.result == true) {
                    if(response?.data?.length> 0) {
                        const data = response?.data[0];
                        const unserviceableItems = data?.unserviceable_items;
                        if(unserviceableItems?.length>0) {
                            resolve({isAvailable:false, result:response?.data});
                        }else {
                            resolve({isAvailable:true, result:response?.data});
                        }
                    }else {
                        reject();
                    }
                }else {
                    reject();
                }
            }else {
                reject();
            }
        })
        .catch(err=>{
            reject();
        })
    }) 
    

}

// 더치페이 선택 
export function dutchPayItemCalculator(dutchOrderList,dutchOrderToPayList, dutchOrderPaidList, itemToAdd) {
    // dutchOrderList: 주문내역
    // dutchOrderToPayList: 현재 선택 내역
    // dutchOrderPaidList: 결제한 내역
    // itemToAdd: 선택내역에 추가할 메뉴
    //console.log("dutchOrderList: ",dutchOrderList);
    //console.log("dutchOrderToPayList: ",dutchOrderToPayList);
    //console.log("dutchOrderPaidList: ",dutchOrderPaidList);
    //console.log("itemToAdd: ",itemToAdd);
    var returnDutchOrderToPayList = Object.assign([],dutchOrderToPayList);
    var returnDutchOrderList = Object.assign([],dutchOrderList);
    var returnDutchOrderPaitList = dutchOrderPaidList;

    const isAdd = itemToAdd.isAdd;
    const orderIndex = itemToAdd.orderIndex;
    var selectIndex=null;
    if(itemToAdd.selectIndex!=undefined) {
        selectIndex = itemToAdd.selectIndex;
    }else {
        if(returnDutchOrderToPayList?.length>0) {
            for(var i=0;i<returnDutchOrderToPayList.length;i++) {
                if(returnDutchOrderToPayList[i].index == orderIndex) {
                    selectIndex = i;
                }
            }
        }else {
            selectIndex = itemToAdd.selectIndex;
        }
    }
    // 선택한 메뉴
    var selectedItem = dutchOrderList[orderIndex];
    var qty = selectedItem.qty;
    if(isAdd){
        if(qty<=0) {
            return;
        }
    }
    // 카트에 담긴 수량 조절
    if(!isAdd){
        returnDutchOrderList[orderIndex] =  Object.assign({},returnDutchOrderList[orderIndex],{qty:Number(returnDutchOrderList[orderIndex].qty)+1});
    }else {
        returnDutchOrderList[orderIndex] =  Object.assign({},returnDutchOrderList[orderIndex],{qty:Number(returnDutchOrderList[orderIndex].qty)-1});
    }
    // 선택한 메뉴 수량조절
    // 1. 메뉴에서는 하나 빼고
    // 2. 선택한 메뉴 수량은 1로 한다.
    selectedItem = {...selectedItem,...{qty:1}, index:orderIndex};

    // 선택한 아이템이 기존에 추가되어 있는 아이템인지 체크
    const checkSelected = dutchOrderToPayList.filter(el=> el.index == orderIndex);
    if(checkSelected.length>0) {
        // 선택된 아이템이 있으면 수량만 올린다.
        var newSelected = Object.assign({},checkSelected[0]);
        if(!isAdd){
            if(Number(newSelected.qty)<=1) {
                //delete returnDutchOrderToPayList[index];
                returnDutchOrderToPayList = returnDutchOrderToPayList.filter(el=>el.index!=orderIndex);
            }else {
                newSelected = {...newSelected, ...{qty:Number(newSelected.qty)-1}};
                returnDutchOrderToPayList[selectIndex] = newSelected;
            }
        }else {
            newSelected = {...newSelected, ...{qty:Number(newSelected.qty)+1}};
            returnDutchOrderToPayList[selectIndex] = newSelected;
        }
        console.log("new selected: ",newSelected)
    }else {
        returnDutchOrderToPayList.push(selectedItem);
    }


    return {
        dutchOrderList:returnDutchOrderList,
        dutchOrderToPayList:returnDutchOrderToPayList,
        dutchOrderPaidList:returnDutchOrderPaitList
    }
}

export async function isOrderAvailable (dispatch) {
    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"메뉴 확인 중 입니다."});
    return await new Promise(async function(resolve, reject){
        const isPostable = await isNetworkAvailable()
        .catch(()=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            reject({result:false,msg:"네트워크에 연결할 수 없습니다."})
        });
        if(!isPostable) {
            displayErrorNonClosePopup(dispatch, "XXXX", "인터넷에 연결할 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            reject({result:false,msg:"인터넷에 연결할 수 없습니다."})
        }
        const storeInfo = await getPosStoreInfo()
        .catch((err)=>{
            displayErrorNonClosePopup(dispatch, "XXXX", "상점 정보를 가져올 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); 
            reject({result:false,msg:"상점 정보를 가져올 수 없습니다."})
        })
        // 개점정보 확인
        if(!storeInfo?.SAL_YMD) {
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            displayErrorPopup(dispatch, "XXXX", "개점이 되지않아 주문을 할 수 없습니다.");
            reject({result:false,msg:"개점이 되지않아 주문을 할 수 없습니다."})
        }else {
            //테이블 주문 가능한지 체크            
            const tableAvail = await getTableAvailability(dispatch)
            .catch(()=>{
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                reject({result:false,msg:"주문을할 수 없습니다."})
            });
            if(!tableAvail) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                reject({result:false,msg:"테이블 상태를 확인 해 주세요."})
            }else {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); 
                // 주문할 수 있음
                resolve({result:true,msg:""})
            }
        }
    })
}


// 할부 팝업
export async function openInstallmentPopup(dispatch,getState,title, okTitle, cancelTitle, isCancelUse) {
    dispatch(setDispatchPopup({isShowPopup:true,title:title,okTitle:okTitle,cancelTitle:cancelTitle,isCancelUse:isCancelUse}));
    return new Promise((resolve, reject)=>{
        var timeInterval;
        try{
            timeInterval = setInterval(()=>{
                const {popupType,isShowPopup,isOkClicked,isCancelClicked, isCloseClicked, returnData } = getState().dispatchPopup;
                if(isCancelClicked || isOkClicked || isCloseClicked) {
                    clearInterval(timeInterval);
                    dispatch(initDispatchPopup());
                    //dispatch(setPopup({isOkClicked:false,isCancelClicked:false,title:"",isShowPopup:false}));
                    var msg = "";
                    if(isCancelClicked){msg="cancel"}
                    if(isOkClicked){msg="ok"}
                    if(isCloseClicked){msg="close"}
                    resolve({code:"0000",response:msg,data:returnData});
                }
            },500)
        }
        catch(err) {
            reject({code:"XXXX",response:"error",data:{}});
        }
    })
}

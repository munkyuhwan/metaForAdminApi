import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFullPopupContent, setFullPopupVisibility, setPopupContent, setPopupVisibility, setTransPopupContent, setTransPopupVisibility } from '../store/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEqual} from 'lodash';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { addImageStorage } from '../store/imageStorage';
import { setAdImgs } from '../store/ad';
import { fetch } from "@react-native-community/netinfo";

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

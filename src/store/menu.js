import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { MENU_DATA } from '../resources/menuData';
import axios, { all } from 'axios';
import { adminMenuEdit, adminOptionEdit, getAdminCategories, posMenuEdit, posMenuState, posOrderNew } from '../utils/apis';
import { getAdminCategoryData, getMainCategories, setAllCategories, setMainCategories, setSelectedMainCategory } from './categories';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdminMenuItems, setMenuCategories, setMenuExtra, setOptionExtra } from './menuExtra';
import { CALL_SERVICE_GROUP_CODE } from '../resources/apiResources';
import { setCallServerList } from './callServer';
import { DEFAULT_CATEGORY_ALL_CODE } from '../resources/defaults';
import { getMenuUpdateState, getPosItemsAll, getPosItemsWithCategory, getPosMainCategory, getPosMidCategory, getPosSetGroup, getPosSetGroupItem } from '../utils/api/metaApis';
import { scanFile } from 'react-native-fs';
import { setMenuOptionGroupCode } from './menuDetail';
import { displayErrorNonClosePopup, displayErrorPopup } from '../utils/errorHandler/metaErrorHandler';
import { isNetworkAvailable, openPopup } from '../utils/common';
import { Alert } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import { setCartView } from './cart';
import { initOrderList } from './order';
import { getItems } from '../utils/api/newApi';
export const clearAllItems = createAsyncThunk("menu/clearAllItems", async(_,{dispatch,getState}) =>{ 
    return [];
})

export const getAdminItems = createAsyncThunk("menu/getAdminItems", async(_,{dispatch,getstate})=>{
    console.log("get menu======================================================");
    getItems();
    return[];
})


export const initMenu = createAsyncThunk("menu/initMenu", async(_,{dispatch,getState}) =>{
    EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"메뉴 업데이트 중입니다. "})
    const isPostable = await isNetworkAvailable().catch(()=>{
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); 
        return false;
    });
    if(!isPostable) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
        displayErrorNonClosePopup(dispatch, "XXXX", "인터넷에 연결할 수 없습니다.");
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        return [];
    }
    // 포스 메인 카테고리
    const mainCategories = await getPosMainCategory(dispatch).catch(err=>{EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""}); return [];});
    let allCategories = Object.assign([],mainCategories);
    if(allCategories?.length > 0 ) {
        // 메인 카테고리 하위 메뉴 받기
        for(var i=0;i<allCategories?.length;i++) {
            const subCategoryResult = await getPosMidCategory(dispatch,{selectedMainCategory:allCategories[i].PROD_L1_CD})
            allCategories[i]["PROD_L2_LIST"] = Object.assign([],subCategoryResult);
        }
        dispatch(setAllCategories({allCategories}));
    }
    
    // 관리자 카테고리 추가 정보
    dispatch(getAdminCategoryData());
    // 관리자 메뉴 정보 받아오기;
    dispatch(getAdminMenuItems());
    // 전체 메뉴 받아오기
    await dispatch(getAllItems());
    await dispatch(setSelectedMainCategory(allCategories[0]?.PROD_L1_CD));
    dispatch(getDisplayMenu());
    
    EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});
    return [];
})

export const getDisplayMenu = createAsyncThunk("menu/getDisplayMenu", async(_, {dispatch, getState}) =>{
    //console.log("getDisplayMenu==========================================");
    const {selectedMainCategory,selectedSubCategory, mainCategories} = getState().categories
    const {allItems} = getState().menu;
    const {menuExtra} = getState().menuExtra;

    let mCat ="";
    let sCat = "";
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        mCat=mainCategories[0];
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        sCat= "0000"
    } 

    let selectedItems = []
    //let itemResult = [];
    //itemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory:mCat,selectedSubCategory:sCat});
    if(selectedMainCategory!=0) {
        if(selectedSubCategory == "0000") {
            selectedItems = allItems.filter(el=>el.PROD_L1_CD == selectedMainCategory); 
        }else {
            selectedItems = allItems.filter(el=>el.PROD_L1_CD == selectedMainCategory && el.PROD_L2_CD == selectedSubCategory ); 
        }
    }
    selectedItems = selectedItems.filter(el=>el.PROD_NM != "공란");
    
    // 어드민에서 데이터 확인 후 노출 여부 정함
    let itemsToDisplay = [];
    for(var i=0;i<selectedItems?.length;i++) {
        const itemExtra = menuExtra?.filter(el=>el.pos_code == selectedItems[i]?.PROD_CD);
        if(itemExtra?.length>0) {
            if(itemExtra[0]?.is_use == "Y" && itemExtra[0]?.is_view == "Y" ) {
                itemsToDisplay.push(selectedItems[i]);
            }
        }
    }
    
    return itemsToDisplay;
})

export const updateMenu = createAsyncThunk("menu/updateMenu", async(_,{rejectWithValue}) =>{
    return await posOrderNew();
})
// 전체 아이템 받아오기
export const getAllItems = createAsyncThunk("menu/getAllItems",async(_,{dispatch,getstate})=>{
    // 메뉴 전부 받아오기
    let result = await getPosItemsAll().catch(err=>{return;});
    result = result.filter(el=> el.USE_YN=="Y");
    let setGroupData = [];
    // 세트 그룹받아오기
    for(var i=0;i<result.length;i++) {
        if(result[i]?.USE_YN == "Y") {
            // set dataform;
            let dataForm = {
                "PROD_CD":0,
                "SET_GROUP":[],
            }
            //console.log("result: ",result[i]);
            dataForm.PROD_CD = result[i].PROD_CD;
            // 옵션 그룹 받기
            const optGroup = await getPosSetGroup(dispatch,{menuDetailID:result[i].PROD_CD}).catch(err=>{return[];});
            dataForm.SET_GROUP = Object.assign([],optGroup);
            for(var j=0;j<optGroup.length;j++) {
                const optItem = await getPosSetGroupItem(dispatch,{menuOptionGroupCode:optGroup[j]?.GROUP_NO})
                dataForm.SET_GROUP[j].OPT_ITEMS = optItem;
            }
            setGroupData.push(dataForm);
        }
    }
    return {allItems:result,allSets:setGroupData};
})
// 메뉴 상태 받아오기
export const getMenuState = createAsyncThunk("menu/menuState", async(_,{dispatch, getState}) =>{
    const {isProcessPaying} = getState().menu;
    if(isProcessPaying) {
        return;
    }
    const resultData = await getMenuUpdateState(dispatch).catch(err=>{return []});
    if(!resultData) {
        return
    }else {
        const isUpdated = resultData?.ERROR_CD == "E0000" ;
        const updateDateTime = resultData?.UPD_DT;
        const msg = resultData?.ERROR_MSG;
        if(isUpdated) {

            // 날짜 기준 메뉴 업트가 있으면 새로 받아 온다.
            const lastUpdateDate = await AsyncStorage.getItem("lastUpdate");   
            const currentDate = moment(lastUpdateDate||moment().format("YYYY-MM-DD HH:mm:ss")).format("x");
            const updateDate = moment(updateDateTime).format("x");
            if(resultData?.ERROR_MSG == "업데이트 된 데이터가 있습니다.") {
                dispatch(initMenu());
                const saveDate = moment().format("YYYY-MM-DD HH:mm:ss");
                AsyncStorage.setItem("lastUpdate",saveDate);
                dispatch(setCartView(false));
                dispatch(initOrderList());
            }
/* 
            if(updateDate<currentDate) {
                console.log("go update==========================");
                //await dispatch(getAllItems());
                dispatch(initMenu());
                const saveDate = moment().format("YYYY-MM-DD HH:mm:ss");
                AsyncStorage.setItem("lastUpdate",saveDate);
                dispatch(setCartView(false));
                dispatch(initOrderList());
                //dispatch(getDisplayMenu());
            }else {
               
            } */

        }
    } 
})

// 메뉴 상태 받아오기
export const setProcessPaying = createAsyncThunk("menu/setProcessPaying", async(isPaying,{dispatch}) =>{
    return isPaying;
})


// Slice
export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: [],
        displayMenu:[],
        allItems:[],
        allSets:[],
        isProcessPaying:false,
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(getDisplayMenu.fulfilled,(state, action)=>{
            if(action.payload) {
                state.displayMenu = action.payload;
            }
        })
        builder.addCase(initMenu.fulfilled,(state, action)=>{
            state.menu = action.payload;
        })
        builder.addCase(setProcessPaying.fulfilled,(state, action)=>{
            state.isProcessPaying = action.payload;
        })

        builder.addCase(updateMenu.fulfilled,(state, action)=>{
            //console.log("update fulfilled: ",action.payload);
            //const payload = action.payload;
            //console.log("data: ",payload.data) 
            //console.log("status: ",payload.status)
            //console.log("state: ",state);
            /* if(payload.ERRCODE != "") { 
                state.menu = action.payload;
            }else {
                state.errorCode = action.payload.ERRORCODE
                state.errorCode = action.payload.MSG
            } */
        })
        builder.addCase(getMenuState.fulfilled,(state, action)=>{

        })
        builder.addCase(getAllItems.fulfilled,(state, action)=>{
            state.allItems = action.payload.allItems;
            state.allSets = action.payload.allSets;
        })
        builder.addCase(clearAllItems.fulfilled,(state, action)=>{
            state.allItems = [];
        })
        
        /* 
        builder.addCase(getMenuEdit.fulfilled,(state, action)=>{
            state.menu = action.payload.menu;
            state.allItems = action.payload.allItems;
        })
 */
    }
});


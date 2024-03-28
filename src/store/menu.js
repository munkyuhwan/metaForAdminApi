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
import { getStoreID, isNetworkAvailable, openPopup } from '../utils/common';
import { Alert } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import { setCartView } from './cart';
import { initOrderList } from './order';
import { getItems } from '../utils/api/newApi';
import {isEmpty} from 'lodash';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_GOODS, TMP_STORE_DATA } from '../resources/newApiResource';

export const clearAllItems = createAsyncThunk("menu/clearAllItems", async(_,{dispatch,getState}) =>{ 
    return [];
})

// 전체 메뉴 받기
export const getAdminItems = createAsyncThunk("menu/getAdminItems", async(_,{dispatch,getstate, rejectWithValue})=>{
    const {STORE_IDX} = await getStoreID();

    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_GOODS}`,{"STORE_ID":`${STORE_IDX}`}, {});
        if(data) {
            if(data?.result==true) {
                return data;
            }else {
                return rejectWithValue(error.message)
            }
        }else {
            return rejectWithValue(error.message)
        }
      } catch (error) {
        // 예외 처리
        return rejectWithValue(error.message)

    }
})
// 카테고리 선택 후 메뉴 보여주기
export const setSelectedItems = createAsyncThunk("menu/setSelectedItems", async(_,{dispatch, getState, rejectWithValue})=>{
    const {allItems} = getState().menu;
    const {selectedMainCategory, selectedSubCategory} = getState().categories;
    var displayItems = [];
    if(selectedSubCategory=="0000") {
        displayItems = allItems.filter(item => item.prod_l1_cd == selectedMainCategory);
    }else {
        displayItems = allItems.filter(item => item.prod_l1_cd == selectedMainCategory && item.prod_l2_cd == selectedSubCategory );
    }
    return displayItems;
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
    // 카테고리 받기
    dispatch(getAdminCategories());
    // 메뉴 받아오기
    dispatch(getAdminItems());
    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
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



// Slice
export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: [],
        displayMenu:[],
        allItems:[],
        allSets:[],
        isProcessPaying:false,
        menuError:{ERROR_MSG:"",IS_ERROR:false},
        isMenuLoading:false,
    },
    extraReducers:(builder)=>{

        // 전체 아이템셋
        builder.addCase(getAdminItems.fulfilled,(state, action)=>{
            if(!isEmpty(action.payload)) { 
                state.allItems = action?.payload.order;
                state.isMenuLoading = false;
            }
        }) 
        builder.addCase(getAdminItems.rejected,(state, action)=>{
            state.isMenuLoading = false;
            state.menuError = {ERROR_MSG:action?.payload,IS_ERROR:true}
        }) 
        builder.addCase(getAdminItems.pending,(state, action)=>{
            state.isMenuLoading = true;
        }) 

        // 보여줄 아이템셋
        builder.addCase(setSelectedItems.fulfilled,(state, action)=>{
            state.displayMenu = action?.payload;
        }) 
        builder.addCase(setSelectedItems.rejected,(state, action)=>{
            
        }) 
        builder.addCase(setSelectedItems.pending,(state, action)=>{
            
        }) 

        // 메인 카테고리 받기
        builder.addCase(getDisplayMenu.fulfilled,(state, action)=>{
            if(action.payload) {
                state.displayMenu = action.payload;
            }
        })
        builder.addCase(initMenu.fulfilled,(state, action)=>{
            state.menu = action.payload;
        })
        builder.addCase(clearAllItems.fulfilled,(state, action)=>{
            state.allItems = [];
        })

        /*** 이하 삭제 */
        
        
    }
});


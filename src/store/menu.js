import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { MENU_DATA } from '../resources/menuData';
import axios, { all } from 'axios';
import { getAdminCategories, getAdminCategoryData, getMainCategories, setAllCategories, setSelectedMainCategory } from './categories';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CALL_SERVICE_GROUP_CODE } from '../resources/apiResources';
import { setCallServerList } from './callServer';
import { DEFAULT_CATEGORY_ALL_CODE } from '../resources/defaults';
import { getMenuUpdateState, getPosItemsAll, getPosItemsWithCategory, getPosMainCategory, getPosMidCategory, getPosSetGroup, getPosSetGroupItem } from '../utils/api/metaApis';
import { scanFile } from 'react-native-fs';
import { setMenuOptionGroupCode } from './menuDetail';
import { displayErrorNonClosePopup, displayErrorPopup } from '../utils/errorHandler/metaErrorHandler';
import { fileDownloader, getStoreID, isNetworkAvailable, openPopup } from '../utils/common';
import { Alert } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import { setCartView } from './cart';
import { initOrderList } from './order';
import { getItems } from '../utils/api/newApi';
import {isEmpty} from 'lodash';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_GOODS, ADMIN_API_MENU_UPDATE, TMP_STORE_DATA } from '../resources/newApiResource';

export const clearAllItems = createAsyncThunk("menu/clearAllItems", async(_,{dispatch,getState}) =>{ 
    return [];
})

// 전체 메뉴 받기
export const getAdminItems = createAsyncThunk("menu/getAdminItems", async(_,{dispatch,getState, rejectWithValue})=>{
    const {STORE_IDX} = await getStoreID();
    
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_GOODS}`,{"STORE_ID":`${STORE_IDX}`}, {});
        if(data) {
            if(data?.result==true) {
                const menuData = data?.order.filter(el=> el.is_view == "Y");
                console.log("menu length: ",menuData.length);
                if(menuData.length > 0) {
                    menuData?.map(async (el)=>{
                        await fileDownloader(dispatch, `${el.prod_cd}`,`${el.gimg_chg}`).catch("");
                    });
                    return menuData;
                }else {
                    return rejectWithValue("")
                }
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

// menu update check

export const menuUpdateCheck = createAsyncThunk("menu/menuUpdateCheck", async(_,{dispatch,getState}) =>{
    const {STORE_IDX} = await getStoreID();
    const lastUpdateDate = await AsyncStorage.getItem("lastUpdate").catch(err=>"");   
    const {allCategories} = getState().categories;

    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_MENU_UPDATE}`,{"STORE_ID":`${STORE_IDX}`,"currentDateTime":lastUpdateDate}, {});
        if(data) {
            if(data?.result==true) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"메뉴 업데이트 중입니다."})
                if(data?.isUpdated == "true") {
                    AsyncStorage.setItem("lastUpdate",data?.updateDateTime);
                    dispatch(setCartView(false));
                    dispatch(initOrderList());
                    // 카테고리 받기
                    await dispatch(getAdminCategories());
                    // 메뉴 받아오기
                    await dispatch(getAdminItems());
                    dispatch(setSelectedItems());

                }else {

                }
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
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
                state.allItems = action?.payload;
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

        builder.addCase(initMenu.fulfilled,(state, action)=>{
            state.menu = action.payload;
        })
        builder.addCase(clearAllItems.fulfilled,(state, action)=>{
            state.allItems = [];
        })

        /*** 이하 삭제 */
        
        
    }
});


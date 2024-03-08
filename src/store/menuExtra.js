import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { MENU_DATA } from '../resources/menuData';
import axios from 'axios';
import { adminMenuEdit, posMenuEdit, posMenuState, posOrderNew, postAdminBulletin } from '../utils/apis';
import { setMainCategories } from './categories';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fileDownloader } from '../utils/common';
import { addImageStorage, initImageStorage } from './imageStorage';

export const initMenuExtra = createAsyncThunk("menu/initMenuExtra", async() =>{
    return [];
})
export const setMenuExtra = createAsyncThunk("menu/setMenuExtra", async(data) =>{
    return data;
})
export const setMenuCategories = createAsyncThunk("menu/setMenuCategories", async(data) =>{
    return data; 
})
export const setOptionExtra = createAsyncThunk("menu/setOptionExtra", async(data) =>{
    return data;
})
export const getAdminMenuItems = createAsyncThunk("menu/getAdminMenuItems", async(data,{dispatch}) =>{
    await dispatch(initImageStorage());
    const adminItems = await adminMenuEdit(dispatch);
    if(adminItems?.result) {
        const order = adminItems.order;
        order.map(async(el)=>{
            const basesix = await fileDownloader(dispatch, `${el.pos_code}`,`https:${el.gimg_chg}`).catch("");
            //console.log("basexis: ",basesix)
            //const ext = el?.gimg_chg?.split(".");
            //const extensionType = ext[ext.length-1]
            //console.log("code: ",el.pos_code);
            //await dispatch(addImageStorage({name: `${el.pos_code}`,imgData:`data:image/${extensionType};base64,`+basesix.data}));
            //fileDownloader(dispatch, `${el.pos_code}`,`https://wooriorder.co.kr/metacity/upload_file/goods/1702298033-cyyxh.jpg`);
        })
        return order;
    }else {
        return [];
    }
})
// 관리자 공지사항 받기
export const getAdminBulletin = createAsyncThunk("menu/getAdminBulletin", async(data,{dispatch}) =>{
    const adminBulletin = await postAdminBulletin(dispatch).catch(err=>[]);
    return adminBulletin;
})

// Slice
export const menuExtraSlice = createSlice({
    name: 'menuExtra',
    initialState: {
        menuExtra: [],
        optionCategoryExtra:[],
        optionExtra:[],
        menuCategories:[],
        bulletin:[],
    },
    extraReducers:(builder)=>{
        // 관리자 공지사항
        builder.addCase(getAdminBulletin.fulfilled,(state, action)=>{
            state.bulletin = action.payload;
        })
        // 메뉴 기타 초기화 받기
        builder.addCase(initMenuExtra.fulfilled,(state, action)=>{
            state.menuExtra = action.payload;
        })
        // 메뉴 기타 세팅
        builder.addCase(setMenuExtra.fulfilled,(state, action)=>{
            state.menuExtra = action.payload;
        })
        // 옵션 기타 세팅
        builder.addCase(setOptionExtra.fulfilled,(state, action)=>{
            state.optionCategoryExtra = action.payload.option_category;
            state.optionExtra = action.payload.option;
        })
        // 메뉴 카테고리 세팅
        builder.addCase(setMenuCategories.fulfilled,(state, action)=>{
            state.menuCategories = action.payload;
        })
        // 메뉴 아이템 세팅
        builder.addCase(getAdminMenuItems.fulfilled,(state, action)=>{
            state.menuExtra = action.payload;
        })


    }
});


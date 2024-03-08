import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
import { stat } from 'react-native-fs';
import { getPosMainCategory, getPosMidCategory } from '../utils/api/metaApis';
import { getAdminMainCategory } from '../utils/api/adminApi';
import { setMenuCategories } from './menuExtra';
import { getCategories } from '../utils/api/newApi';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_CATEGORY, TMP_STORE_DATA } from '../resources/newApiResource';
import {isEmpty} from 'lodash';

export const setCategories = createAsyncThunk("categories/setCategories", async(data) =>{
    return data;
})
// 어드민 카테고리 받기
export const getAdminCategories = createAsyncThunk("categories/getAdminCategories", async(_,{dispatch,rejectWithValue}) =>{
    console.log("get categoreis======================================================");
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_CATEGORY}`,TMP_STORE_DATA, {});
        //console.log('카테고리 데이터:', data);
        return data;
      } catch (error) {
        // 예외 처리
        console.error(error.message);
        return rejectWithValue(error.message);
    }
})
// 메인 카테고리 선택
export const setSelectedMainCategory = createAsyncThunk("categories/setSelectedMainCategory", async(index,{getState,dispatc, rejectWithValue}) =>{
    if(isEmpty(index)) {
        return rejectWithValue()
    }else {
        return index;
    }
})


/***** 이하 삭제 */
// delete 어드민 카테고리 추가 정보 받아오기
export const getAdminCategoryData = createAsyncThunk("categories/getAdminCategoryData", async(_,{dispatch}) =>{
    const adminResult = await getAdminMainCategory(dispatch);
    dispatch(setMenuCategories(adminResult));
    return []; 
})
// delete 전체 카테고리 전체 세팅
export const setAllCategories = createAsyncThunk("categories/setAllCategories", async(_,{dispatch}) =>{
    const {allCategories} = _;
    return allCategories;
})
// delete 메인 카테고리 전체 세팅
export const setAllMainCategories = createAsyncThunk("categories/setAllMainCategories", async(_,{dispatch}) =>{
    return [];
})
// delete 서브 카테고리 전체 세팅
export const setAllSubCategories = createAsyncThunk("categories/setAllSubCategories", async(_,{dispatch}) =>{
    return [];
})


export const setMainCategories = createAsyncThunk("categories/setMainCategories", async(_)=>{
    return _;
});

export const setSelectedSubCategory = createAsyncThunk("categories/setSelectedSubCategory", async(index) =>{
    return index
})
// Slice
export const cagegoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        allCategories:[],
        categoryData:[],
        mainCategories:[],
        subCategories:[],
        selectedMainCategory:0,
        selectedSubCategory:0,
    },
    extraReducers:(builder)=>{
        // 카테고리 받아오기
        builder.addCase(getAdminCategories.fulfilled, (state, action)=>{
            const payload = action?.payload.goods_category;
            const result = payload?.filter(item => (item?.is_del=='N' && item?.is_use=="Y")  );
            state.allCategories = result;
        })
        builder.addCase(getAdminCategories.pending, (state, action)=>{
            console.log("admin category set state pending=================");
        })
        builder.addCase(getAdminCategories.rejected, (state, action)=>{
            console.log("admin category set state rejected=================");
        })

        // 메인 카테고리 선택
        builder.addCase(setSelectedMainCategory.fulfilled,(state, action)=>{
            //state.subCategories = MENU_DATA.categories[action.payload].subCategories||[]
            const payload = action.payload;
            state.selectedMainCategory = payload;
            state.selectedSubCategory = "0000";
        })
        builder.addCase(setSelectedMainCategory.pending,(state, action)=>{
        })
        builder.addCase(setSelectedMainCategory.rejected,(state, action)=>{
        })

        /** 이하 삭제 */



        // set categories
        builder.addCase(setCategories.fulfilled,(state, action)=>{
            const payload = action.payload;
            const keys = Object.keys(payload)
            if(keys.length>0) {
                keys.map(el=>{
                    state[el] = action.payload[el];
                })
            }
        })
        


        // 전체 카테고리 세팅
        builder.addCase(setAllCategories.fulfilled,(state,action)=>{
            state.allCategories = action.payload;
        })
        // 메인 카테고리 전체
        builder.addCase(setAllMainCategories.fulfilled,(state, action)=>{
            state.mainCategories = action.payload;
        })
        // 서브 카테고리 전체
        builder.addCase(setAllSubCategories.fulfilled,(state, action)=>{
            state.subCategories = action.payload;
        })

        // 메인 카테고리 업데이트
        builder.addCase(setMainCategories.fulfilled,(state, action)=>{
            state.mainCategories = action.payload;
        })
       
        // 서브 카테고리 선택
        builder.addCase(setSelectedSubCategory.fulfilled,(state, action)=>{
            state.selectedSubCategory = action.payload;
        })
    }
});


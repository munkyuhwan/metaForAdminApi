import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';
import { openPopup } from '../utils/common';

export const initMenuDetail = createAsyncThunk("menuDetail/initMenuDetail", async() =>{
    //return {menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],setGroupItem:[]};
    //return { menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],setGroupItem:[],menuRecommendItems:[],}
    return {menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],setGroupItem:[],menuRecommendItems:[]}
})

export const setItemDetail = createAsyncThunk("menuDetail/setItemDetail", async({itemID},{dispatch,getState}) =>{
    return itemID;
})

export const setMenuOptionSelected = createAsyncThunk("menuDetail/setMenuOptionSelected", async(_,{dispatch, getState}) =>{
    const {menuOptionSelected, menuOptionGroupCode} = getState().menuDetail;
    const {data, isAdd, isAmt} = _;
    let newOptSelect= Object.assign([], menuOptionSelected);
    if(!isAmt){
        let dupleCheck = newOptSelect.filter(el=>el.PROD_I_CD == data.PROD_I_CD);
        if(dupleCheck.length <=0 ) {
            newOptSelect.push(data)
        }else {
            newOptSelect = newOptSelect.filter(el=>el.PROD_I_CD != data.PROD_I_CD);
        }
    }else {
            newOptSelect = newOptSelect.filter(el=>el.PROD_I_CD != data.PROD_I_CD);
            if(data?.QTY>0) {
                newOptSelect.push(data)
            }
    }
    if(isAdd) {

    }else {
        newOptSelect = newOptSelect.filter(el=>el.PROD_I_CD!=data.PROD_I_CD);
    } 
    return newOptSelect;
});

/*** 이하 삭제 */
export const getSingleMenu = createAsyncThunk("menuDetail/getSingleMenu", async(itemID,{getState}) =>{
    const {displayMenu} = getState().menu;
    const selectedMenuDetail = displayMenu.filter(el=>el.ITEM_ID == itemID);
    return selectedMenuDetail[0];
});
// 추천 메뉴를 위한 단일 메뉴 받기

export const getSingleMenuForRecommend = createAsyncThunk("menuDetail/getSingleMenuForRecommend", async(_,{dispatch, getState}) =>{
    const {selectedMainCategory,selectedSubCategory} = getState().categories
    const {menuDetailID} = getState().menuDetail;
    const {related} = _;
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        return
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        return
    } 
});


export const setMenuOptionSelect = createAsyncThunk("menuDetail/setMenuOptionSelect", async(data) =>{
    return data;
});
export const setMenuOptionSelectInit = createAsyncThunk("menuDetail/setMenuOptionSelectInit", async() =>{
    return {menuOptionSelect: []};
});
export const setMenuOptionGroupCode = createAsyncThunk("menuDetail/setMenuOptionGroupCode", async(data) =>{
    return data;
});

// Slice
export const menuDetailSlice = createSlice({
    name: 'menuDetail',
    initialState: {
        menuDetailID: null,
        menuDetail:{},
        menuOptionGroupCode:"",
        menuOptionList:[],
        menuOptionSelected:[],
        setGroupItem:[],
        menuRecommendItems:[],
    },
    extraReducers:(builder)=>{
        // 메뉴 상세 
        builder.addCase(setItemDetail.fulfilled, (state, action)=>{
            state.menuDetailID = action.payload
        } )
        builder.addCase(setItemDetail.rejected, (state, action)=>{

        } )
        builder.addCase(setItemDetail.pending, (state, action)=>{

        } )

        /*** 이하 삭제 */
        // 메뉴 상세 초기화
        builder.addCase(initMenuDetail.fulfilled,(state, action)=>{
            state.menuDetailID = action.payload.menuDetailID;
            state.menuDetail = action.payload.menuDetail;
            state.menuOptionGroupCode = action.payload.menuOptionGroupCode;
            state.menuOptionList = action.payload.menuOptionList;
            state.menuOptionSelected = action.payload.menuOptionSelected;
            state.setGroupItem = [];
            state.menuRecommendItems = [];
        })
        // 메뉴 상세 받기
        builder.addCase(getSingleMenu.fulfilled,(state, action)=>{
            state.menuDetail = action.payload;
        })
        // 메뉴 옵션 셋
        builder.addCase(setMenuOptionSelect.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 옵션 초기화
        builder.addCase(setMenuOptionSelectInit.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 옵션 선택
        builder.addCase(setMenuOptionSelected.fulfilled,(state, action)=>{
            state.menuOptionSelected = action.payload;
        })
        
        // 메뉴 옵션 그룹
        builder.addCase(setMenuOptionGroupCode.fulfilled,(state, action)=>{
            state.menuOptionGroupCode = action.payload;
        })
        // 추천 메뉴
        builder.addCase(getSingleMenuForRecommend.fulfilled,(state, action)=>{
            state.menuRecommendItems = action.payload;
        })
        
    }
});


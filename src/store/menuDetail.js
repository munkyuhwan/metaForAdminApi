import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { getPosItemsWithCategory, getPosSetGroup, getPosSetGroupItem } from '../utils/api/metaApis';
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';
import { openPopup } from '../utils/common';

export const initMenuDetail = createAsyncThunk("menuDetail/initMenuDetail", async() =>{
    //return {menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],setGroupItem:[]};
    return { menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],setGroupItem:[],menuRecommendItems:[],}
})

export const setMenuDetail = createAsyncThunk("menuDetail/setMenuDetail", async(_,{dispatch,getState}) =>{
    const {allItems, allSets} = getState().menu;
    const index = _.itemID;

    // 아이템 상세
    const allItemsFiltered = allItems.filter(el=>el.PROD_CD == index);
    let menuDetail = {}
    if(allItemsFiltered?.length>0) {
        menuDetail = allItemsFiltered[0];
    }

    // 아이템 옵션
    const setFiltered = allSets.filter(el=>el.PROD_CD == index);
    let filterdSetList = []
    if(setFiltered?.length>0) {
        filterdSetList = setFiltered[0];
    }

    return {menuDetailID:index,menuDetail:menuDetail, menuOptionList:filterdSetList.SET_GROUP};
})
export const getSingleMenu = createAsyncThunk("menuDetail/getSingleMenu", async(itemID,{getState}) =>{
    const {displayMenu} = getState().menu;
    const selectedMenuDetail = displayMenu.filter(el=>el.ITEM_ID == itemID);
    return selectedMenuDetail[0];
});
export const getSingleMenuFromAllItems = createAsyncThunk("menuDetail/getSingleMenuFromAllItems", async(itemID,{dispatch, getState}) =>{
    const {selectedMainCategory,selectedSubCategory} = getState().categories
    const {menuDetailID} = getState().menuDetail;
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        return
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        return
    } 
    const singleItemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID});
    return singleItemResult[0];
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
    //const singleItemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID});
    //return singleItemResult[0];
    //const {allItems} = getState().menu;
    //const selectedMenuDetail = allItems.filter(el=>el.ITEM_ID == itemID);
    //return selectedMenuDetail[0];
});

// 세트 그룹 받기
export const getItemSetGroup = createAsyncThunk("menuDetail/getItemSetGroup", async(data,{dispatch,getState}) =>{
    const {menuDetailID} = getState().menuDetail;
    const setGroup = await getPosSetGroup(dispatch,{menuDetailID} );
    return setGroup;
});
// 세트 그룹 아이템 받기
export const getSetItems = createAsyncThunk("menuDetail/getSetItems", async(data,{dispatch,getState}) =>{
    const{allItems} = getState().menu;
    const {setGroup} = data;
    const setGroupItem = await getPosSetGroupItem(dispatch,{menuOptionGroupCode:setGroup.GROUP_NO}).catch(err=>{ posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"통신",MSG2:"아이템을 받아올 수 없습니다."}); return;});
    //console.log(setGroupItem);
    const displaySetItem = [];
    if(setGroupItem) {
        if(setGroupItem.length > 0) {
            for(var i=0;i<setGroupItem.length;i++) {
                const groupItemDetail = await getPosItemsWithCategory(dispatch,{selectedMainCategory:"",selectedSubCategory:"",menuDetailID:setGroupItem[i].PROD_I_CD});
                displaySetItem.push(groupItemDetail[0]);
            }
        }
    }
   /*  for(var i=0;i<setGroupItem.length;i++) {
        let selectedItem = allItems.filter(el=>el.PROD_CD == setGroupItem[i].PROD_I_CD );
        displaySetItem.push(selectedItem[0]);
    } */
    return displaySetItem;
  
    /* const setGroupItem = await getPosSetGroupItem(dispatch,{menuOptionGroupCode}).catch(err=>{ posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"통신",MSG2:"아이템을 받아올 수 없습니다."}); return;});
    //const setGroup = await getPosSetGroup(dispatch,{menuDetailID} );
    const displaySetItem = [];
    if(setGroupItem) {
        if(setGroupItem.length > 0) {
            for(var i=0;i<setGroupItem.length;i++) {
                const groupItemDetail = await getPosItemsWithCategory(dispatch,{selectedMainCategory:"",selectedSubCategory:"",menuDetailID:setGroupItem[i].PROD_I_CD});
                displaySetItem.push(groupItemDetail[0]);
            }
        }
    } */
    //return displaySetItem;
});

export const setMenuOptionSelect = createAsyncThunk("menuDetail/setMenuOptionSelect", async(data) =>{
    return data;
});
export const setMenuOptionSelectInit = createAsyncThunk("menuDetail/setMenuOptionSelectInit", async() =>{
    return {menuOptionSelect: []};
});
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
       //openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:"옵션을 추가할 수 없습니다."}});

        newOptSelect = newOptSelect.filter(el=>el.PROD_I_CD!=data.PROD_I_CD);
        //newOptSelect = newOptSelect.slice(0,newOptSelect.length-1);
    } 

    return newOptSelect;
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
        initMenuDetail
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
        // 메인 카테고리 받기
        builder.addCase(setMenuDetail.fulfilled,(state, action)=>{
            state.menuDetailID = action.payload.menuDetailID;
            state.menuDetail = action.payload.menuDetail;
            state.menuOptionList = action.payload.menuOptionList;
        })
        // 메뉴 상세 받기
        builder.addCase(getSingleMenu.fulfilled,(state, action)=>{
            state.menuDetail = action.payload;
        })
        // 메뉴 상세 받기 전체 메 스테이트에서
        builder.addCase(getSingleMenuFromAllItems.fulfilled,(state, action)=>{
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

        // 메뉴 세트 그룹 
        builder.addCase(getItemSetGroup.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 세트 그룹 아이템 
        builder.addCase(getSetItems.fulfilled,(state, action)=>{
            let currentItems = Object.assign([],state.setGroupItem);
            //let itemsToSet = [...currentItems,...action.payload];
            currentItems.push(action.payload);
            /* const itemResult = itemsToSet.filter(function(elem, pos) {
                return itemsToSet.indexOf(elem) == pos;
            }); */ 
            state.setGroupItem = currentItems;
        })
        // 추천 메뉴
        builder.addCase(getSingleMenuForRecommend.fulfilled,(state, action)=>{
            state.menuRecommendItems = action.payload;
        })
        
    }
});


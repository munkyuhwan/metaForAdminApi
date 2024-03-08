import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminBanners } from '../utils/apis';
import { adFileDownloader } from '../utils/common';
import { ADMIN_BANNER_DIR } from '../resources/apiResources';

export const getAD = createAsyncThunk("ads/getAD", async(_,{dispatch}) =>{
    const result = await getAdminBanners(dispatch).catch(err=> {return []});
    let payload = result?.data;
    payload = payload?.filter(el=>el.isuse=='Y');
    for(var i=0;i<payload.length;i++) {
        await adFileDownloader(dispatch, `${payload[i].img_chg}`,ADMIN_BANNER_DIR+payload[i].img_chg).catch("");
    }
    return payload;
})

export const setAdImgs = createAsyncThunk("ads/setAdImgs", async(data,{dispatch, getState}) =>{
    const {adImgs} = getState().ads;
    let prevImgs = Object.assign([],adImgs)
    prevImgs = prevImgs.filter(el=>el.name!=data.name);
    prevImgs.push(data); 
    return prevImgs;
})
export const setAdScreen = createAsyncThunk("ads/setAdScreen", async(data,{dispatch}) =>{
    const {isMain, isShow} = data;
    if(isMain) {
        // 메인에서 넘어갈 경우 배너 길이 확인해서 1보다 크면 넘김
        const result = await getAdminBanners(dispatch).catch(err=> {return []});
        let payload = result?.data;
        payload = payload?.filter(el=>el.isuse=='Y');
        if(payload?.length>0) {
           await dispatch(getAD());
        }
        return payload?.length>0    
    }
    return isShow;
})


// Slice
export const adSlice = createSlice({
    name: 'ads',
    initialState: {
        adList:[],
        adImgs:[],
        isShow:false,
    },
    extraReducers:(builder)=>{
        // 고ㅏㅇ고  받기
        builder.addCase(getAD.fulfilled,(state, action)=>{
            state.adList = action.payload;
        })
        builder.addCase(setAdImgs.fulfilled,(state, action)=>{
            state.adImgs = action.payload;
        })
        builder.addCase(setAdScreen.fulfilled,(state, action)=>{
            state.isShow = action.payload;
        })

    }
});


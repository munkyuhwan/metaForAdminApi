import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminBanners } from '../utils/apis';
import { adFileDownloader, getStoreID, openPopup } from '../utils/common';
import { ADMIN_BANNER_DIR } from '../resources/apiResources';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { ADMIN_API_BANNER, ADMIN_API_BANNER_DIR, ADMIN_API_BASE_URL } from '../resources/newApiResource';
import { setErrorData } from './error';

export const getAD = createAsyncThunk("ads/getAD", async(_,{dispatch,rejectWithValue}) =>{
    const {STORE_IDX, SERVICE_ID} = await getStoreID()
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_BANNER}`,{"STORE_ID":`${STORE_IDX}`}, {});
        if(data) {
            if(data?.result==true) {
                let payload = data?.data;
                payload = payload?.filter(el=>el.isuse=='Y');
                for(var i=0;i<payload.length;i++) {
                    await adFileDownloader(dispatch, `${payload[i].img_chg}`,ADMIN_API_BANNER_DIR+payload[i].img_chg).catch("");
                }
                return payload;
            }else {
                return rejectWithValue("")
            }
        }else {
            return rejectWithValue("")
        }
    } catch (error) {
        // 예외 처리
        dispatch(setErrorData({errorCode:"XXXX",errorMsg:`어드민 광고 ${error.message}`})); 
        openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
        return rejectWithValue(error.message)
    }

})

export const setAdImgs = createAsyncThunk("ads/setAdImgs", async(data,{dispatch, getState}) =>{
    const {adImgs} = getState().ads;
    let prevImgs = Object.assign([],adImgs)
    prevImgs = prevImgs.filter(el=>el.name!=data.name);
    prevImgs.push(data); 
    return prevImgs;
})

/**이하삭제 */
export const setAdScreen = createAsyncThunk("ads/setAdScreen", async(data,{dispatch,getState, rejectWithValue}) =>{
    const {isMain, isShow} = data;
    const {innerTransView} = getState().popup;
    if(innerTransView == "CameraView") {
        return rejectWithValue()
    }
    if(isMain) {
        // 메인에서 넘어갈 경우 배너 길이 확인해서 1보다 크면 넘김
        const {STORE_IDX, SERVICE_ID} = await getStoreID()
        try {
            const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_BANNER}`,{"STORE_ID":`${STORE_IDX}`}, {});
            if(data) {
                if(data?.result==true) {
                    let payload = data?.data;
                    payload = payload?.filter(el=>el.isuse=='Y');
                    if(payload?.length>0) {
                        await dispatch(getAD());
                    }
                    return payload?.length>0    
                }else {
                    return rejectWithValue()
                }
            }else {
                return rejectWithValue()
            }
        } catch (error) {
            // 예외 처리
            return rejectWithValue(error.message)

        }   
    }else {
        return isShow;
    }
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
        builder.addCase(getAD.rejected,(state, action)=>{
            //state.adList=[]
        })
        builder.addCase(getAD.pending,(state, action)=>{
            //state.adList=[]
        })


        builder.addCase(setAdImgs.fulfilled,(state, action)=>{
            state.adImgs = action.payload;
        })
        builder.addCase(setAdScreen.fulfilled,(state, action)=>{
            state.isShow = action.payload;
        })

    }
});


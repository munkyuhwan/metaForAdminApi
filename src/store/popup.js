import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const setPopupVisibility = createAsyncThunk("popup/setPopupVisibility", async(popup) =>{
    return popup;
})
export const setPopupContent = createAsyncThunk("popup/setPopupContent", async(popup) =>{
    return popup;
})
export const setTransPopupVisibility = createAsyncThunk("popup/setTransPopupVisibility", async(popup) =>{
    return popup;
})
export const setTransPopupContent = createAsyncThunk("popup/setTransperentPopupContent", async(popup) =>{
    return popup;
})
export const setFullPopupVisibility = createAsyncThunk("popup/setFullPopupVisibility", async(popup) =>{
    return popup;
})
export const setFullPopupContent = createAsyncThunk("popup/setFullSizePopupContent", async(popup) =>{
    return popup;
})
// Slice
export const popupsSlice = createSlice({
    name: 'popup',
    initialState: {
        isPopupVisible:false,
        isTransPopupVisible:false,
        isFullPopupVisible:false,
        innerView:"",
        innerTransView:"",
        innerFullView:"",
        popupMsg:"",
        param:{},
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setPopupVisibility.fulfilled,(state, action)=>{
            state.isPopupVisible = action.payload.isPopupVisible;
        })
        builder.addCase(setPopupContent.fulfilled,(state, action)=>{
            state.innerView = action.payload.innerView;
            state.param = action.payload.param
        })

        builder.addCase(setTransPopupVisibility.fulfilled,(state, action)=>{
            state.isTransPopupVisible = action.payload.isPopupVisible;
        })
        builder.addCase(setTransPopupContent.fulfilled,(state, action)=>{
            state.innerTransView = action.payload.innerView;
            state.param = action.payload.param
        })

        builder.addCase(setFullPopupVisibility.fulfilled,(state, action)=>{
            state.isFullPopupVisible = action.payload.isFullPopupVisible;
        })
        builder.addCase(setFullPopupContent.fulfilled,(state, action)=>{
            state.innerFullView = action.payload.innerFullView;
        })
    }
});


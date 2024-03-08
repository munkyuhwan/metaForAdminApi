import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const initError = createAsyncThunk("error/initError", async(category) =>{
    return [];
})
export const setErrorData = createAsyncThunk("error/setErrorData", async(data) =>{
    return data;
})

// Slice
export const errorSlice = createSlice({
    name: 'error',
    initialState: {
        errorMsg: "",
        errorCode:"", 
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(initError.fulfilled,(state, action)=>{
            state.errorMsg = action.payload;
        })
        builder.addCase(setErrorData.fulfilled,(state, action)=>{
            state.errorMsg = action.payload.errorMsg;
            state.errorCode = action.payload.errorCode;
        })
       
    }
});


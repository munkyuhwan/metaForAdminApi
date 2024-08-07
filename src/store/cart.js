import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const setCartView = createAsyncThunk("cartView/setCartView", async(isOn) =>{
    return new Promise((resolve, reject)=>{
        resolve(isOn)
    })
})
export const setQuickOrder = createAsyncThunk("cartView/setQuickOrder", async(data) =>{
    return data;
})

// Slice
export const cartViewSlice = createSlice({
    name: 'cartView',
    initialState: {
        isOn: false,
        isQuickOrder:false,
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setCartView.fulfilled,(state, action)=>{
            state.isOn = action.payload;
        })
        builder.addCase(setQuickOrder.fulfilled,(state, action)=>{
            state.isQuickOrder = action.payload;
        })
    }
});


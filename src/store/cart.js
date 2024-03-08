import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const setCartView = createAsyncThunk("cartView/setCartView", async(isOn) =>{
    return new Promise((resolve, reject)=>{
        resolve(isOn)
    })
})

// Slice
export const cartViewSlice = createSlice({
    name: 'cartView',
    initialState: {
        isOn: false,
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setCartView.fulfilled,(state, action)=>{
            state.isOn = action.payload;
        })
        
    }
});


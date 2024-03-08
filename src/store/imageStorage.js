import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
export const initImageStorage = createAsyncThunk("cartView/initImageStorage", async() =>{
    return [];
})
export const addImageStorage = createAsyncThunk("cartView/setImageStorage", async(data) =>{
    return data;
})

// Slice
export const imageStorageSlice = createSlice({
    name: 'imageStorage',
    initialState: {
        images: [],
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(addImageStorage.fulfilled,(state, action)=>{
            let currentImages = Object.assign([],state.images);
            currentImages.push(action.payload)
            state.images = currentImages;
        })
        // 이미지 배열 초기화
        builder.addCase(initImageStorage.fulfilled,(state, action)=>{
            state.images = [];
        })
        
    }
});


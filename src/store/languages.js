import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const setLanguage = createAsyncThunk("languages/setLanguage", async(language) =>{
    return language;
})

// Slice
export const languagesSlice = createSlice({
    name: 'languages',
    initialState: {
        language: "",
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setLanguage.fulfilled,(state, action)=>{
            state.language = action.payload;
        })
    }
});


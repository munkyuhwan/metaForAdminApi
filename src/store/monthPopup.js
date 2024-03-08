import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const initMonthPopup = createAsyncThunk("monthSelect/initMonthPopup", async(category) =>{
    return {
        isMonthSelectShow:false,
        monthSelected:"",
    };
})

export const setMonthPopup = createAsyncThunk("monthSelect/setMonthPopup", async(data,{dispatch}) =>{
    const {isMonthSelectShow} = data;
    return isMonthSelectShow;
})
export const setSelectedMonth =  createAsyncThunk("monthSelect/setSelectedMonth", async(data,{dispatch}) =>{
    return data;
})

// Slice
export const monthSelectSlice = createSlice({
    name: 'monthSelect',
    initialState: {
        isMonthSelectShow:false,
        monthSelected:"",
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(initMonthPopup.fulfilled,(state, action)=>{
            state.isMonthSelectShow = action.isMonthSelectShow;
            state.monthSelected = action.monthSelected;
        })
        
        builder.addCase(setMonthPopup.fulfilled,(state, action)=>{
            state.isMonthSelectShow = action.payload;
        })
        builder.addCase(setSelectedMonth.fulfilled,(state, action)=>{
            state.monthSelected = action.payload;
        })
    }
});


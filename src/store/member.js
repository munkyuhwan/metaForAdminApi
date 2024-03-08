import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { posTableList } from '../utils/apis';
import { setTableInfo } from './tableInfo';

export const initMember = createAsyncThunk("memberInfo/init", async(data) =>{
    return {};
})
export const setMember = createAsyncThunk("memberInfo/setMember", async(data) =>{
    return data;
})
export const memberLogin = createAsyncThunk("memberInfo/memberLogin", async(data,{dispatch}) =>{
    dispatch(setTableInfo({"FLR_CODE": "0001", "FLR_NAME": "001", "TBL_CODE": "0001", "TBL_NAME": "1"}));
    return {memberInfo:{member_name:'test',member_pk:'1'}};
})

// Slice
export const memberInfoSlice = createSlice({
    name: 'memberInfo',
    initialState: {
        memberInfo:{}
    },
    extraReducers:(builder)=>{
        // 회원 정보 초기화
        builder.addCase(initMember.fulfilled,(state, action)=>{
            state.memberInfo = action.payload;
        })
        // 회원 정보
        builder.addCase(setMember.fulfilled,(state, action)=>{
            state.memberInfo = action.payload;
        })
        // 회원 로그인
        builder.addCase(memberLogin.fulfilled,(state, action)=>{
            state.memberInfo = action.payload.memberInfo;
        })
        
        
    }
});


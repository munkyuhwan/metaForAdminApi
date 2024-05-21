import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminTableStatus, posTableList } from '../utils/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo, { getUniqueId, getManufacturer, getAndroidId } from 'react-native-device-info';
import { getTableListInfo } from '../utils/api/metaApis';
import { ADMIN_API_BASE_URL, ADMIN_API_CATEGORY, TMP_STORE_DATA, ADMIN_API_TABLE_STATUS, ADMIN_API_STORE_INFO } from '../resources/newApiResource';
import { getStoreID } from '../utils/common';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import {isEmpty} from 'lodash';



// 관리자 테이블 상테 받아오기
export const getTableStatus = createAsyncThunk("tableInfo/getTableStatus", async(data,{dispatch,rejectWithValue}) =>{
    const {STORE_IDX} = await getStoreID();
    const TABLE_INFO =  await AsyncStorage.getItem("TABLE_INFO");
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_TABLE_STATUS}`,{"STORE_ID":`${STORE_IDX}`, "t_num":TABLE_INFO}, {});
        if(data?.data == null) {
            return rejectWithValue("DATA DOES NOT EXIST");
        }else {
            if(data?.data[0].table) {
                if(data?.data[0].table?.length>0) {
                    return data?.data[0];
                }else {
                    return rejectWithValue("DATA DOES NOT EXIST");
                }
            }else {
                return rejectWithValue("DATA DOES NOT EXIST");
            }
        }
      } catch (error) {
        // 예외 처리
        console.error(error.message);
        return rejectWithValue(error.message);
    }
})
export const setTableStatus = createAsyncThunk("tableInfo/setTableStatus", async(data,{dispatch,rejectWithValue}) =>{
    //console.log("setTableStatus: ",data);
    return data;            
})

// 지점정보 받아오기
export const getStoreInfo = createAsyncThunk("tableInfo/getStoreInfo", async(data, {dispatch,rejectWithValue})=>{
    const {STORE_IDX} = await getStoreID();
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_STORE_INFO}`,{"STORE_ID":`${STORE_IDX}`}, {});
        if(data?.data == null) {
            return rejectWithValue("DATA DOES NOT EXIST");
        }else {
            return data?.data;
        }
      } catch (error) {
        // 예외 처리
        console.error(error.message);
        return rejectWithValue(error.message);
    }
})
export const setStoreInfo = createAsyncThunk("tableInfo/setStoreInfo", async(data, {dispatch,rejectWithValue})=>{
    const storeID = data?.store_id;
    const prevStoreID = await AsyncStorage.getItem("STORE_IDX");
    //await messaging().unsubscribeFromTopic(prevStoreID);
    await messaging().unsubscribeFromTopic(prevStoreID);
    await messaging().subscribeToTopic(storeID)
   return data;   
})

/**이하 삭제 */

export const initTableInfo =  createAsyncThunk("tableInfo/initTableInfo", async() =>{
    const getTableInfo = await AsyncStorage.getItem("tableInfo");
    if(getTableInfo==null) {
        return{};
    }else {
        return JSON.parse(getTableInfo);
    }
})
export const clearTableInfo = createAsyncThunk("tableInfo/clearTableInfo", async() =>{
    return {};
})
export const setTableInfo = createAsyncThunk("tableInfo/setTableInfo", async(data) =>{
    const result = await AsyncStorage.setItem("tableInfo", JSON.stringify(data) );
    const uniqueId = await getAndroidId();

    return data;    
})
export const changeTableInfo = createAsyncThunk("tableInfo/changeTableInfo", async(data) =>{
  
    return data;    
})
/* 
export const getTableList = createAsyncThunk("tableInfo/getTableList", async(data,{dispatch}) =>{
    const result = await getTableListInfo(dispatch,{floor:data?.floor}).catch(err=>[]);
    return result
})
 */
// Slice
export const tableInfoSlice = createSlice({
    name: 'tableInfo',
    initialState: {
        tableInfo:{},
        tableList:[],
        tableStatus:{},
        cardDeviceInfo:{},
        orderHistory:[],
        tableCode:"0001",
        posIP:"",
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(changeTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        /* 
        builder.addCase(getTableList.fulfilled,(state, action)=>{
            state.tableList = action.payload;
        }) */
        builder.addCase(clearTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(initTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(getTableStatus.fulfilled, (state,action)=>{
            const payload = action.payload;
            if(!isEmpty(payload)) {
                state.tableStatus = payload.table[0];
                state.cardDeviceInfo = payload.card_device_info;
                state.orderHistory = payload.order_list;
            }
        })
        builder.addCase(setTableStatus.fulfilled, (state,action)=>{
            const payload = action.payload;
            if(!isEmpty(payload)) {
                state.tableStatus = payload.table[0];
                state.cardDeviceInfo = payload.card_device_info;
                state.orderHistory = payload.order_list;
            }
        })

        // 스토어 정보, 아이피/테이블 리스트
        builder.addCase(getStoreInfo.fulfilled,  (state,action)=>{
            const payload = action.payload;
            if(!isEmpty(payload)) {
                state.posIP = payload.ip;
                //state.posIP = "192.168.35.95";
                state.tableList = payload.table_list;
            }
        })
        builder.addCase(getStoreInfo.rejected,  (state,action)=>{
            
        })
        builder.addCase(getStoreInfo.pending,  (state,action)=>{
            
        })

        builder.addCase(setStoreInfo.fulfilled, (state,action)=>{
            const payload = action.payload;
            if(!isEmpty(payload)) {
                state.posIP = payload.ip;
                //state.posIP = "192.168.35.95";
                state.tableList = payload.table_list;
            }
        })
        
    }
});


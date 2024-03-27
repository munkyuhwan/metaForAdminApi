import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SERVICE_ID, STORE_ID } from '../resources/apiResources';
import { addOrderToPos, checkTableOrder, getAdminServices, postAdminServices, postOrderToPos } from '../utils/apis';
import LogWriter from '../utils/logWriter';
import { getStoreID, openFullSizePopup, openPopup, openTransperentPopup } from '../utils/common';
import { ADMIN_API_BASE_URL, ADMIN_API_CALL_SERVICE, ADMIN_API_POST_CALL_SERVICE } from '../resources/newApiResource';
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setErrorData } from './error';

// 직원호출 목록 불러오기
export const getServiceList = createAsyncThunk("callServer/getServiceList", async(_,{dispatch,getstate, rejectWithValue}) =>{
    const {STORE_IDX} = await getStoreID();

    try {
        const result = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_CALL_SERVICE}`,{"STORE_ID":`${STORE_IDX}`}, {}); 
        if(result?.result == true) {
            const data = result?.data;
            return data;
        }else {
            return rejectWithValue(error.message)
        }
      } catch (error) {
        // 예외 처리
        console.error(error.message);
        return rejectWithValue(error.message)
    }
});
// 직원 호출하기
export const postService = createAsyncThunk("callServer/postService", async(data,{dispatch}) =>{    
    const postCallData = data;
    const {STORE_IDX} = await getStoreID()
    .catch(err=>{
        return rejectWithValue("직원호출을 할 수없습니다.")
    });;
    const tableNm = await AsyncStorage.getItem("TABLE_NM").catch(err=>{return rejectWithValue("직원호출을 할 수없습니다.")});
    const tableInfo =  await AsyncStorage.getItem("TABLE_INFO").catch(err=>{return rejectWithValue("직원호출을 할 수없습니다.")});

    const tableData = {"STORE_ID":STORE_IDX,"t_name":tableNm, "t_id":tableInfo}

    try {
        const result = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_POST_CALL_SERVICE}`, {...tableData,...postCallData} , {}); 
        if(result?.result == true) {
            const data = result?.data;
            openFullSizePopup(dispatch, {innerView:"", isFullPopupVisible:false});
            openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:"직원호출을 완료했습니다."}});
            return data;
        }else {
            return rejectWithValue(error.message)
        }
      } catch (error) {
        // 예외 처리
        console.error(error.message);
        return rejectWithValue(error.message)
    }
     
})

// 에러 초기화
export const initError = createAsyncThunk("callServer/initError", async(data,{}) =>{
    return {ERROR_MSG:"",IS_ERROR:false};
})


/** 이하 삭제 */

export const getCallServerItems = createAsyncThunk("callServer/getCallServerItems", async() =>{
    const getCallServerItem = []
    return getCallServerItem;
})
export const setCallServerList = createAsyncThunk("callServer/setCallServerList", async(data) =>{
    return data;
})
export const setCallServerItem = createAsyncThunk("callServer/setCallServerItem", async(index) =>{
    return index;
})
/* 
export const sendServiceToPos = createAsyncThunk("callServer/sendToPos", async(data,{dispatch, getState}) =>{
    const { callServerItems } = getState().callServer;
    const {tableInfo} = getState().tableInfo;
    const serverList = callServerItems.ITEM_LIST

    let selectedItems = [];
    data.map(itemID=>{
        let serviceItem = Object.assign({},serverList.filter(el=>el.ITEM_ID==itemID)[0]);
        serviceItem['ITEM_SEQ'] = "1";
        serviceItem['ITEM_CNT'] = "1";
        serviceItem['SALE_PRICE'] = "0";
        serviceItem['SALE_AMT'] = "0";
        serviceItem['ITEM_MEMO'] = "";
        serviceItem['ADDITIVE_ITEM_LIST'] = [];

        delete serviceItem["ITEM_AMT"];

        //console.log("serviceItem: ",serviceItem);
        selectedItems.push(serviceItem);
    })
    //console.log()
    //console.log(selectedItems)
    let submitData = 
    {
        "STORE_ID": `${STORE_ID}`,
        "SERVICE_ID": `${SERVICE_ID}`,
        "MCHT_ORDERNO": "120",
        "MEMB_TEL": "01012349876",
        "ORDER_MEMO": "직원호출",
        "OEG_ORDER_PAY_AMT": "0",
        "ORDER_PAY_AMT": "0",
        "DISC_AMT": "0",
        "PREPAY_FLAG": "N",
        "OS_GBN": "AND",
        "FLR_CODE": `${tableInfo.FLR_CODE}`,
        "TBL_CODE": `${tableInfo.TBL_CODE}`,
        "REPT_PRT_FLAG": "N",
        "ORDER_PRT_FLAG": "N",
        "ORD_PAY_LIST": [],
        "ITEM_LIST": selectedItems
    }

    const isTableAvailable = await checkTableOrder(dispatch,{tableInfo});
   // console.log("isTableAvailable: ",isTableAvailable)
    //console.log("submitData: ",submitData);


    
    if(isTableAvailable.hasOrderList) {
        submitData["ORD_PAY_LIST"]=[];
        submitData["ORG_ORDERNO"] = isTableAvailable.orderNo;
        return await addOrderToPos(dispatch, submitData)
        .catch(err=>{
            posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"주문 오류",MSG2:"주문을 진행할 수 없습니다."});
            console.log("error: ",err)
        }); 
    }else {
        return await postOrderToPos(dispatch, submitData)
        .catch(err=>{
            posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"주문 오류",MSG2:"주문을 진행할 수 없습니다."});
            const lw = new LogWriter();
            const logPos = `\nPOST POS DATA ERROR==================================\ndata:${JSON.stringify(err)}\n`
            lw.writeLog(logPos);
        });
    }
    
 
})
 */

// Slice
export const callServerSlice = createSlice({
    name: 'callServer',
    initialState: {
        callServerItems:[],
        selectedItem:0,
        error:{ERROR_MSG:"",IS_ERROR:false},

    },
    extraReducers:(builder)=>{
        // 직원호출 셋
        // 관리자 직원호출 목록 불러오기
        builder.addCase(getServiceList.fulfilled,(state, action)=>{
            if(action.payload) {
                state.callServerItems = action.payload;
            }else {
                state.error = {ERROR_MSG:"직원호출 목록을 불러올 수 없습니다.",IS_ERROR:true};
            }
        })
        builder.addCase(getServiceList.pending,(state, action)=>{
            state.error = {ERROR_MSG:"직원호출 목록을 불러올 수 없습니다.",IS_ERROR:true};
        })
        builder.addCase(getServiceList.rejected,(state, action)=>{
            state.error = {ERROR_MSG:"직원호출 목록을 불러올 수 없습니다.",IS_ERROR:true};
        })
        // 관리자 직원호출 하기
        builder.addCase(postService.fulfilled,(state, action)=>{
            // 에러초기화
            state.error = {ERROR_MSG:"",IS_ERROR:false};
        })
        builder.addCase(postService.pending,(state, action)=>{
            state.error = {ERROR_MSG:"직원호출을 할 수 없습니다.",IS_ERROR:true};
        })
        builder.addCase(postService.rejected,(state, action)=>{
            state.error = {ERROR_MSG:"직원호출을 할 수 없습니다.",IS_ERROR:true};
        })

        // error 초기화
        builder.addCase(initError.fulfilled,(state, action)=>{
            state.error = {ERROR_MSG:"",IS_ERROR:false};
        })
        builder.addCase(initError.pending,(state, action)=>{
            state.error = {ERROR_MSG:"",IS_ERROR:false};
        })
        builder.addCase(initError.rejected,(state, action)=>{
            state.error = {ERROR_MSG:"",IS_ERROR:false};
        })



        /** 이하 삭제 */
        // 메인 카테고리 받기
        builder.addCase(getCallServerItems.fulfilled,(state, action)=>{
            if(action.payload) {
                state.callServerItems = action.payload;
            }
        })
        // 메인 카테고리 선택
        builder.addCase(setCallServerItem.fulfilled,(state, action)=>{
            state.selectedItem = action.payload;
        })
        
    }
});


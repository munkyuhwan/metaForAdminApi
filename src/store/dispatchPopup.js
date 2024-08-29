import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initDispatchPopup = createAsyncThunk("calculator/initDispatchPopup", async(data,{dispatch}) =>{
    return {
    popupType:"",
    isShowPopup:false,
    isOkClicked:false,
    isCancelClicked:false,

    title:"",
    okTitle:"",
    cancelTitle:"",

    isCancelUse:true,
    returnData:{}
};
});
export const setDispatchPopup = createAsyncThunk("calculator/setDispatchPopup", async(data,{dispatch}) =>{
    console.log("data: ",data);
    return data;
});



export const dispatchPopupSlice = createSlice({
    name: 'dispatchPopup',
    initialState: {
        popupType:"",
        isShowPopup:false,
        isOkClicked:false,
        isCancelClicked:false,

        title:"",
        okTitle:"",
        cancelTitle:"",

        isCancelUse:true,

        returnData:{},

    },
    extraReducers:(builder)=>{

        // 초기화
        builder.addCase(initDispatchPopup.fulfilled,(state, action)=>{
            const res = Object.assign({},action.payload);
            state.popupType = res.popupType
            state.isShowPopup = res.isShowPopup
            state.isOkClicked = res.isOkClicked
            state.isCancelClicked = res.isCancelClicked
            state.title = res.title
            state.okTitle = res.okTitle
            state.cancelTitle = res.cancelTitle
            state.isCancelUse = res.isCancelUse
            state.returnData = res.isCancelUse

        })
        builder.addCase(initDispatchPopup.rejected,(state, action)=>{

        })
        builder.addCase(initDispatchPopup.pending,(state, action)=>{

        })
        // set
        builder.addCase(setDispatchPopup.fulfilled,(state, action)=>{
            const res = Object.assign({},state,action.payload);
            state.popupType = res.popupType
            state.isShowPopup = res.isShowPopup
            state.isOkClicked = res.isOkClicked
            state.isCancelClicked = res.isCancelClicked
            state.title = res.title
            state.okTitle = res.okTitle
            state.cancelTitle = res.cancelTitle
            state.isCancelUse = res.isCancelUse
            state.returnData = res.returnData;

            
        })
        builder.addCase(setDispatchPopup.rejected,(state, action)=>{

        })
        builder.addCase(setDispatchPopup.pending,(state, action)=>{

        })

    }
});


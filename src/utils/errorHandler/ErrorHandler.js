import { useDispatch } from "react-redux";
import _ from "lodash"
import { setErrorData } from "../../store/error";
import { openPopup, openTransperentPopup } from "../common";
import isEmpty from "lodash";

export const posErrorHandler = (dispatch, data) =>{
    const errorCode = data.ERRCODE;
    if( !_.isEmpty(errorCode) ) {    
        dispatch(setErrorData({errorCode:data.ERRCODE,errorMsg:data.MSG+`\n${data.MSG2}`})); 
        //openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
        openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:data.MSG+`\n${data.MSG2}`}});
        //openTransperentPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
    }
    return _.isEmpty(errorCode)
}
export const hasPayError = (dispatch, data) => {
    if(!(data['deal'])) {
        dispatch(setErrorData({errorCode:"XXXX",errorMsg:"결제 종류를 선택하세요."})); 
        openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
        return true;
    }

    if(data['deal']=='approval') {
        if(!(data['total-amount'])) {
            dispatch(setErrorData({errorCode:"XXXX",errorMsg:"금액을 입력하세요."})); 
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
            return true;
        }
    }
    if(data['deal']=='cancellation') {
        if(!(data['total-amount'])){
            dispatch(setErrorData({errorCode:"XXXX",errorMsg:"금액을 입력하세요."})); 
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
            return true;
        }
        if(!(data['approval-no'])){
            dispatch(setErrorData({errorCode:"XXXX",errorMsg:"승인번호를 입력하세요."})); 
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
            return true;
        }
        if(!(data['approval-date'])){
            dispatch(setErrorData({errorCode:"XXXX",errorMsg:"승인날짜를 입력하세요."})); 
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
            return true;
        }
    }
    return false;
}

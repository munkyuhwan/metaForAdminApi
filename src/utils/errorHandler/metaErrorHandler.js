import { POS_SUCCESS_CD } from "../../resources/apiResources";
import { setErrorData } from "../../store/error";
import { openPopup } from "../common";


export const metaErrorHandler = (dispatch, response) => {
    const ERROR_CD = response?.ERROR_CD;
    const ERROR_MSG = response?.ERROR_MSG;
    if(ERROR_CD == POS_SUCCESS_CD) {
        return true;
    }else {
        displayErrorPopup(dispatch, response.ERROR_CD,response.ERROR_MSG);
        return false;
    }
}
export const displayErrorPopup = (dispatch, errCode, msg) => {
    //dispatch(setErrorData({errorCode:errCode,errorMsg:msg})); 
    openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:msg}});   
}
export const displayErrorNonClosePopup = (dispatch, errCode, msg) => {
    //dispatch(setErrorData({errorCode:errCode,errorMsg:msg})); 
    openPopup(dispatch,{innerView:"NonAutoClose", isPopupVisible:true,param:{msg:msg}});   
}
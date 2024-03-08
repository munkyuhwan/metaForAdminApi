import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";

const ErrorPopup = () => {

    const dispatch = useDispatch();
    const {errorMsg, errorCode} = useSelector(state=>state.error);

    useState(()=>{
        if(errorMsg!="") {
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true});
        } 
    },[errorMsg])

    return(
        <>
            <ErrorTitle>{errorCode=="XXXX"?"":errorCode+":"} {errorMsg||"error"}</ErrorTitle>
        </>
    )
}
export default ErrorPopup;
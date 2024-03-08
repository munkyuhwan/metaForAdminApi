import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
let to=null;
const AutoClosePopup = () => {

    const dispatch = useDispatch();
    const {popupMsg, param, isPopupVisible} = useSelector(state=>state.popup);
    useState(()=>{
        to = setInterval(() => {
            clearInterval(to);
            to=null;
            openPopup(dispatch,{innerView:"", isPopupVisible:false});
        }, 3000);
    },[])

    return(
        <>
            {param?.msg &&
                <ErrorTitle>{param?.msg}</ErrorTitle>
            }
        </>
    )
}
export default AutoClosePopup;
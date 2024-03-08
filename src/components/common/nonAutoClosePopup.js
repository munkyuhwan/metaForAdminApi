import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
const NonAutoClosePopup = () => {

    const dispatch = useDispatch();
    const {popupMsg, param, isPopupVisible} = useSelector(state=>state.popup);
  

    return(
        <>
            {param?.msg &&
                <ErrorTitle>{param?.msg}</ErrorTitle>
            }
        </>
    )
}
export default NonAutoClosePopup;
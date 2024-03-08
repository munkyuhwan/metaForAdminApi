import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper } from "../../styles/common/popup";

let to = null;
const OrderCompletePopup = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
    useState(()=>{
         
        to = setInterval(() => {
            clearInterval(to);
            openTransperentPopup(dispatch,{innerView:"", isPopupVisible:false});
        }, 1500);
 
    },[])

    return(
        <>
           <OrderCompleteWrapper>
                <OrderCompleteItemWrapper>
                    <OrderCompleteIcon source={require("../../assets/icons/ico_restaurant.png")}  />
                    <OrderCompleteText>{param?.msg}</OrderCompleteText>
                </OrderCompleteItemWrapper>
           </OrderCompleteWrapper>
           
        </>
    )
}
export default OrderCompletePopup;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import messaging from '@react-native-firebase/messaging';
import { OrderReadyTitle, PopupCloseButton, PopupCloseButtonWrapper } from "../../styles/common/popup";
import { TouchableWithoutFeedback } from "react-native";

const OrderReadyPopup = (props) => {
    const dispatch = useDispatch();
    const [body, setBody] = useState("");
    console.log("msg:",props?.param?.msg)
    return(
        <>
            {props?.param?.msg&&
            <>
                <TouchableWithoutFeedback  onPress={()=>{ openTransperentPopup(dispatch, {innerView:"", isPopupVisible:false,param:{}}); }}>
                    <PopupCloseButtonWrapper  style={{marginLeft:-10, marginTop:10}} >
                        <PopupCloseButton source={require('../../assets/icons/close_red.png')}/>
                    </PopupCloseButtonWrapper>
                </TouchableWithoutFeedback>
                <OrderReadyTitle>{props?.param?.msg}</OrderReadyTitle>
            </>
            }
        </>
    )
}
export default OrderReadyPopup;
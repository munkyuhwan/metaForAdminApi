import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper } from "../../styles/common/popup";
import Video from 'react-native-video';
import { StyleSheet } from "react-native";


const CameraView = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
   
    var player = useRef();
    return(
        <>
            <OrderCompleteWrapper style={{backgroundColor:'red'}}> 
           </OrderCompleteWrapper>
        </>
    )
}
var styles = StyleSheet.create({
    backgroundVideo: {
        backgroundColor:'yellow',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width:300,
        height:400,
    },
  });
  
export default CameraView;
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper } from "../../styles/common/popup";
import Video from 'react-native-video';
import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import WebView from "react-native-webview";


const CameraView = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
   
    var player = useRef();
    return(
        <>
            <OrderCompleteWrapper>
                <TouchableWithoutFeedback style={{padding:15}} onPress={()=>{openTransperentPopup(dispatch, {innerView:"", isPopupVisible:false});}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>닫기</Text>
                </TouchableWithoutFeedback> 
                <WebView source={{uri:"https://youtu.be/JApXlFgOM_U?si=yUzoZ9w2AYMIL4Fu"}} />
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
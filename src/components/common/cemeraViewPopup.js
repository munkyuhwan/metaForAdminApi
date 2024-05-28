import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper } from "../../styles/common/popup";
import Video from 'react-native-video';
import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import WebView from "react-native-webview";
import { VLCPlayer } from "react-native-vlc-media-player";


const CameraView = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
   
    var player = useRef();
    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{console.log("on press!!!!");}}>

                <VLCPlayer
                    style={{width:'100%',height:'100%'}}
                    videoAspectRatio="16:9"
                    source={{ uri: "rtsp://user:1q2w3e4r.@14.35.253.159:556/trackID=1"}}
                    />
            </TouchableWithoutFeedback>
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
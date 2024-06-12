import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper } from "../../styles/common/popup";
import Video from 'react-native-video';
import { Image, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import WebView from "react-native-webview";
import { VLCPlayer } from "react-native-vlc-media-player";
import { CCTVWrapper } from "../../styles/popup/cctvStyle";
import { CategoryScrollView, CategoryWrapper, TopMenuWrapper } from "../../styles/main/topMenuStyle";
import TopMenuList from "../menuComponents/topMenuList";
import CCTVItemList from "../menuComponents/cctvItemList";


const CameraView = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
    const {tableInfo,cctv} = useSelector(state => state.tableInfo);

    var player = useRef();
    function onPressItem(index) {

    }
    //source={{ uri: "rtsp://user:1q2w3e4r.@14.35.253.159:556/trackID=1"}}

    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{console.log("on press!!!!");}}>
                <CCTVWrapper>
                    <TopMenuWrapper>
                            <CategoryScrollView  horizontal showsHorizontalScrollIndicator={false} >
                                <CategoryWrapper>
                                    {
                                        <CCTVItemList
                                            data={cctv}
                                            onSelectItem={(index)=>{ onPressItem(index); }}
                                            initSelect={0}
                                        />
                                    }
                            </CategoryWrapper>
                            </CategoryScrollView>
                    </TopMenuWrapper>
                    <VLCPlayer
                        style={{width:'100%',height:'90%'}}
                        videoAspectRatio="16:9"
                        onLoad={()=>{console.log("on load")}}
                        onPlaying={()=>{console.log("on playing")}}
                        source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
                        />
                </CCTVWrapper>
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
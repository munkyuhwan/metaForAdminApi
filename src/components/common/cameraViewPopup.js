import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, openTransperentPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";
import { OrderCompleteIcon, OrderCompleteItemWrapper, OrderCompleteText, OrderCompleteWrapper, PopupCloseButton, PopupCloseButtonWrapper } from "../../styles/common/popup";
import Video from 'react-native-video';
import { Image, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import WebView from "react-native-webview";
import { VLCPlayer } from "react-native-vlc-media-player";
import { CCTVWrapper } from "../../styles/popup/cctvStyle";
import { CategoryScrollView, CategoryWrapper, TopMenuWrapper } from "../../styles/main/topMenuStyle";
import TopMenuList from "../menuComponents/topMenuList";
import CCTVItemList from "../menuComponents/cctvItemList";
import { EventRegister } from "react-native-event-listeners";


const CameraView = () => {
    const dispatch = useDispatch();
    const {popupMsg, param,innerTransView} = useSelector(state=>state.popup);
    const {tableInfo,cctv} = useSelector(state => state.tableInfo);
    const [currentIndex, setCurrentIndex] = useState();
    const [cctvUrl, setCctvUrl] = useState("");

    var player = useRef();
    function onPressItem(data) {
        setCurrentIndex(data.idx);
    }
    useEffect(()=>{
        if(cctv) {
            setCurrentIndex(cctv[0].idx);
        }
    },[cctv])
    useEffect(()=>{
        EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"로딩중"});
        const filteredCctv = cctv.filter(el=>el.idx==currentIndex);
        if(filteredCctv) {
            if(filteredCctv[0]) {
                setCctvUrl(filteredCctv[0].cctv_url);   
            }
        }
    },[currentIndex])
    return(
        <>  

                <CCTVWrapper>
                    <TopMenuWrapper>
                            <CategoryScrollView  horizontal showsHorizontalScrollIndicator={false} >
                                <CategoryWrapper>
                                    {
                                        <CCTVItemList
                                            data={cctv}
                                            onSelectItem={(selected)=>{ onPressItem(selected); }}
                                            initSelect={0}
                                            currentIndex={currentIndex}
                                        />
                                    }
                            </CategoryWrapper>
                            </CategoryScrollView>
                    </TopMenuWrapper>
                    {cctvUrl &&
                        <VLCPlayer
                            ref={player}
                            style={{width:'100%',height:'90%'}}
                            videoAspectRatio="16:9"
                            onLoad={()=>{ console.log("on playing"); EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});  }}
                            onPlaying={()=>{console.log("on load"); EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""});  }}
                            source={{ uri: cctvUrl}}
                        />
                    }
                </CCTVWrapper>

                <TouchableWithoutFeedback style={{zIndex:999999}} onPress={()=>{ openTransperentPopup(dispatch, {innerView:"", isPopupVisible:false}); }}>
                    <PopupCloseButton  style={{position:'absolute', right:5,top:5}} source={require('../../assets/icons/close_red.png')}/>
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
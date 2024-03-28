import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { LoginActionInputID, LoginActionInputPW, LoginActionSubtitle, LoginActionTitle, LoginActionWrapper, LoginBtnIcon, LoginBtnText, LoginBtnWrapper, LoginLogo, LoginMainWrapper } from '../styles/login/loginStyle'
import { ADOrderBtnIcon, ADOrderBtnText, ADOrderBtnWrapper, ADWrapper, SwiperImage, SwiperScroll, SwiperVideo } from '../styles/ad/adStyle';
import { useDispatch, useSelector } from 'react-redux';
import { LANGUAGE } from '../resources/strings';
import Video from "react-native-video";
import SwipeRender from "react-native-swipe-render";
import Swiper from 'react-native-swiper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TableName, TableNameBig, TableNameSmall } from '../styles/main/topMenuStyle';
import { getAD } from '../store/ad';
import { ADMIN_BANNER_DIR } from '../resources/apiResources';
import {isEmpty} from 'lodash';

const ADScreen = () =>{
    let adInterval;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {adList,adImgs} = useSelector(state=>state.ads);
    const {tableInfo} = useSelector(state=>state.tableInfo);
    // 영상 플레이, 스톱
    const [videoIndex, setVideoIndex] = useState(0);
    const [adIndex, setAdIndex] = useState();
    const [displayUrl, setDisplayUrl] = useState("");

    const swiperRef = useRef(); 
    const onSwipe = (index) =>{
        setVideoIndex(index)
    }

    useFocusEffect(useCallback(()=>{
        //dispatch(getAD()); 
    },[]))
    
    useEffect(()=>{
        console.log("adList: ",adList)
        if( adList?.length > 0) {
            const imgToSet = adImgs.filter(el=>el.name ==adList[0]?.img_chg );
            setDisplayUrl(imgToSet[0]?.imgData)
            setAdIndex(0)
        }
    },[adList]);
    
    let swipeTimeOut;
    useFocusEffect(useCallback(()=>{
        swipeTimeOut=setTimeout(()=>{
            let tmpIndex = adIndex;
            if(!tmpIndex) tmpIndex=0;
            let indexToSet = tmpIndex +1;
            if(indexToSet>=adList.length) {
                indexToSet = 0;
            }
            setAdIndex(indexToSet);
            if(adList[tmpIndex]?.img_chg){
                const imgToSet = adImgs.filter(el=>el.name ==adList[tmpIndex]?.img_chg );
                console.log("imgToSet[0]?.imgData: ",imgToSet[0]?.imgData);
                setDisplayUrl(imgToSet[0]?.imgData)
            }
        },10000)
    },[adIndex]))
    return(
        <>
            <ADWrapper>
                <View style={{position:'absolute', right:158}}>
                    <TableName>
                        <TableNameBig>{tableInfo?.TBL_NAME}</TableNameBig>
                    </TableName>
                </View>
                {displayUrl?.split(";")[0]?.split("/")[1]?.includes('mp4') &&
                    <SwiperVideo
                        key={"aa"}
                        source={{uri: displayUrl}} 
                        paused={false}
                        repeat={true}
                    />
                }
                {!displayUrl?.split(";")[0]?.split("/")[1]?.includes('mp4') &&
                    <>
                        <SwiperImage
                            key={"imageswipe"}
                            source={{ uri: displayUrl }}
                        />
                    </>
                }
                
                
                <TouchableWithoutFeedback onPress={()=>{navigation.navigate("main")}}>
                    <ADOrderBtnWrapper>
                        <ADOrderBtnText>주문하기</ADOrderBtnText>
                        <ADOrderBtnIcon source={require("../assets/icons/folk_nife.png")} />
                    </ADOrderBtnWrapper>
                </TouchableWithoutFeedback>
            </ADWrapper>
        </>
    )
}
export default ADScreen
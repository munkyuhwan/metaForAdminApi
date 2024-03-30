import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { ADOrderBtnIcon, ADOrderBtnText, ADOrderBtnWrapper, ADWrapper, SwiperImage, SwiperScroll, SwiperVideo } from '../../styles/ad/adStyle';
import { useDispatch, useSelector } from 'react-redux';
import { TableName, TableNameBig, TableNameSmall } from '../../styles/main/topMenuStyle';
import { getAD, setAdScreen } from '../../store/ad';
import { SettingWrapper } from '../../styles/common/settingStyle';
import { StatusText } from '../../styles/status/statusScreenStyle';
let swipeTimeOut;
const ADScreenPopup = () =>{
    let adInterval;
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {adList,adImgs} = useSelector(state=>state.ads);
    const {tableInfo} = useSelector(state=>state.tableInfo);
    // 영상 플레이, 스톱
    const [adIndex, setAdIndex] = useState();
    const [displayUrl, setDisplayUrl] = useState("");

    useEffect(()=>{
        console.log("광고 받기");
        dispatch(getAD()); 
    },[])
    
    useEffect(()=>{
        if( adList?.length > 0) {
            const imgToSet = adImgs.filter(el=>el.name ==adList[0]?.img_chg );
            setDisplayUrl(imgToSet[0]?.imgData)
            setAdIndex(0)
        }else {
            clearTimeout(swipeTimeOut); 
            dispatch(setAdScreen({isShow:false,isMain:false}));
        }
    },[adList])
    
    useEffect(()=>{
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
                setDisplayUrl(imgToSet[0]?.imgData)
            }
            //clearTimeout(swipeTimeOut); 
            //swipeTimeOut=null;
        },10000)
    },[adIndex])

    if(adList?.length<=0) {
        return(
            <></>
        )
    }

    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{ clearTimeout(swipeTimeOut); swipeTimeOut=null; dispatch(setAdScreen({isShow:false,isMain:false})) /* navigation.navigate("main") */}}>
                <ADWrapper>
                    {/* <View style={{position:'absolute', right:158}}>
                        <TableName>
                            <TableNameBig>{tableInfo?.TBL_NAME}</TableNameBig>
                        </TableName>
                    </View> */}
                    
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
                    
                        <ADOrderBtnWrapper>
                                <ADOrderBtnText>주문하기</ADOrderBtnText>
                                <ADOrderBtnIcon source={require("../../assets/icons/folk_nife.png")} />
                        </ADOrderBtnWrapper>
                    </ADWrapper>
                </TouchableWithoutFeedback>
        </>
    )
}
export default ADScreenPopup
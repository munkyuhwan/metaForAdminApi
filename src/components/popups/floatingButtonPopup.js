import { useDispatch, useSelector } from "react-redux";
import { FloatingBackgroundInnerdWrapper, FloatingBackgroundWrapper, FloatingImg, FloatingWrapper } from "../../styles/popup/floatingButtonPopupStyle";
import { useCallback, useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import { RADIUS_DOUBLE } from "../../styles/values";
import { Animated, Dimensions, TouchableWithoutFeedback, View } from "react-native";
import { addToOrderList } from "../../store/order";
import { setItemDetail } from "../../store/menuDetail";
import {isEmpty, isEqual} from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import { setLastOrderItem } from "../../store/tableInfo";
import { EventRegister } from "react-native-event-listeners";
import { setQickOrder, setQuickOrder } from "../../store/cart";

const FloatingBtn = (props) => {

    const dispatch = useDispatch();

    const {lastOrderItem} = useSelector(state => state.tableInfo);
    const {allItems} = useSelector(state=>state.menu);
    const {images} = useSelector(state=>state.imageStorage);
    const {isOn} = useSelector((state)=>state.cartView);
    const [lastItemDetail, setLastItemDetail] = useState([]);
    const filteredImg = images.filter(el=>el.name==lastOrderItem);

    const [slideAnimationX, setSlideAnimationX] = useState(new Animated.Value(0));
    const [slideAnimationY, setSlideAnimationY] = useState(new Animated.Value(0));
    const [scaleX, setScaleX] = useState(new Animated.Value(0));
    const [scaleY, setScaleY] = useState(new Animated.Value(0));


    const slideInterpolateX = slideAnimationX.interpolate({
        inputRange:[0,1,2],
        //outputRange:[(windowWidth > 1200 ? windowWidth*0.274:windowWidth*0.266),(windowWidth*0.004)]
        outputRange:[800,780,800]
    })
    const slideInterpolateY = slideAnimationY.interpolate({
        inputRange:[0,1,2,3],
        //outputRange:[(windowWidth > 1200 ? windowWidth*0.274:windowWidth*0.266),(windowWidth*0.004)]
        outputRange:[10,0,20,10]
    })

    const interpolateScaleX = scaleX.interpolate({
        inputRange:[0,1,2],
        //outputRange:[(windowWidth > 1200 ? windowWidth*0.274:windowWidth*0.266),(windowWidth*0.004)]
        outputRange:[0.95,1.05,0.95]
    })

    const interpolateScaleY = scaleY.interpolate({
        inputRange:[0,1,2],
        //outputRange:[(windowWidth > 1200 ? windowWidth*0.274:windowWidth*0.266),(windowWidth*0.004)]
        outputRange:[0.95,1.05,0.95]
    })

    const boxStyle = {
        transform: [
            {translateX:slideInterpolateX},
            {translateY:slideInterpolateY},
            {scaleX:interpolateScaleX},
            {scaleY:interpolateScaleY},
        ],
    };

    useEffect(()=>{
            Animated.loop(
                Animated.parallel([
                    Animated.timing(slideAnimationX,{
                        toValue:2,
                        duration:2000,
                        useNativeDriver:true
                    }), 
                    Animated.timing(slideAnimationY,{
                        toValue:3,
                        duration:3000,
                        useNativeDriver:true
                    }), 
                    Animated.timing(scaleX,{
                        toValue:2,
                        duration:3000,
                        useNativeDriver:true
                    }), 
                    Animated.timing(scaleY,{
                        toValue:2,
                        duration:3000,
                        useNativeDriver:true
                    }), 
                ])
            ).start();
    },[lastOrderItem, allItems])

    useEffect(()=>{
        if(lastOrderItem!="") {
            if(allItems?.length>0) {
                const selected = allItems?.filter(el=>el.prod_cd == lastOrderItem);
                //console.log("selected: ",selected)
                if(selected[0]?.is_popup=="Y"){
                    setLastItemDetail(selected);
                }else {
                    setLastItemDetail({});
                    dispatch(setLastOrderItem(""));
                }
            }
        }
    },[lastOrderItem, allItems])

    if(!filteredImg[0]) {
        return(
            <></>
        )
    }
    if(isOn) {
        return(
            <></>
        )
    } 

    async function makeLastOrder() {
        if(lastItemDetail[0]?.prod_gb=="09"||lastItemDetail[0]?.prod_gb=="02"){
            //props?.setDetailShow(true);  
            dispatch(setItemDetail({itemID:lastItemDetail[0].prod_cd}));
        } else { 
            await dispatch(addToOrderList({isAdd:true, isDelete: false, item:lastItemDetail[0],menuOptionSelected:[]}));
            dispatch(setQuickOrder(true));
            //doPayment();
        } 
    }

    return(
        <>
            {lastItemDetail?.length>0 &&
                <FloatingBackgroundWrapper style={[{...boxStyle}]}  size={"150"} >
                    <FloatingBackgroundInnerdWrapper  size={"140"} >
                        <TouchableWithoutFeedback onPress={()=>{                         
                           makeLastOrder();
                        }} >
                            <FloatingWrapper>
                                <FastImage style={{ width:'100%',height:'100%', borderRadius:200}} source={{uri:filteredImg[0].imgData}} resizeMode={FastImage.resizeMode.cover} />
                                <FastImage style={{width:30, height:30, position:'absolute',right:-7,bottom:-3}} source={require('../../assets/icons/add.png')} resizeMode={FastImage.resizeMode.cover} />
                            </FloatingWrapper>
                        </TouchableWithoutFeedback>
                    </FloatingBackgroundInnerdWrapper>
                </FloatingBackgroundWrapper>
            }
        </>
    )
}

export default FloatingBtn;
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
import { QuickMenuItemBottomWRapper, QuickMenuItemName, QuickMenuItemPrice, QuickMenuItemWrapper, QuickOrderWrapper, QuickTopMenuWrapper } from "../../styles/popup/quickOrderPopupStyle";
import { FlatList } from "react-native-gesture-handler";
import MenuItem from "../mainComponents/menuItem";
import { MenuImageDefault, MenuImageDefaultWrapper, MenuItemBottomWRapper, MenuItemButton, MenuItemButtonInnerWrapperLeft, MenuItemButtonInnerWrapperRight, MenuItemButtonWrapper, MenuItemHotness, MenuItemHotnessWrapper, MenuItemImageWrapper, MenuItemName, MenuItemPrice, MenuItemSpiciness, MenuItemTopWrapper, MenuItemWrapper } from "../../styles/main/menuListStyle";
import { isAvailable, numberWithCommas } from "../../utils/common";
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from "../../styles/main/detailStyle";
import { LANGUAGE } from '../../resources/strings';
import { colorRed } from "../../assets/colors/color";
import { CategorySelected, TopMenuText, TopMenuWrapper } from "../../styles/main/topMenuStyle";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const FloatingBtn = (props) => {

    const dispatch = useDispatch();

    const {language} =  useSelector(state=>state.languages);
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
/* 
    if(!filteredImg[0]) {
        return(
            <></>
        )
    }
    if(isOn) {
        return(
            <></>
        )
    }  */

    async function makeLastOrder(item) {
        if(item?.prod_gb=="09"||item?.prod_gb=="02"){
            //props?.setDetailShow(true);  
            dispatch(setItemDetail({itemID:item.prod_cd}));
        } else { 
            await dispatch(addToOrderList({isAdd:true, isDelete: false, item:item,menuOptionSelected:[]}));
            dispatch(setQuickOrder(true));
            //doPayment();
        } 
    }

    const QuickItem = (props) =>{ 
        const item = props?.item;
        const quickItem = images.filter(el=>el.name==item.prod_cd);
        const itemTitle = () => {
            let selTitleLanguage = "";
                if(language=="korean") {
                    selTitleLanguage = item.gname_kr;
                }
                else if(language=="japanese") {
                    selTitleLanguage = item?.gname_jp;
                }
                else if(language=="chinese") {
                    selTitleLanguage = item?.gname_cn;
                }
                else if(language=="english") {
                    selTitleLanguage = item?.gname_en;
                }
            
            return selTitleLanguage;
        }
        const imgUrl = item?.gimg_chg;
        const itemPrice= Number(item.sal_tot_amt);

        return(
            <>
                <QuickMenuItemWrapper>
                    <MenuItemTopWrapper>

                        {imgUrl &&
                        <TouchableWithoutFeedback onPress={()=>{makeLastOrder(item); }} >
                            <FastImage style={{ width:200,height:height*0.25, borderRadius:RADIUS_DOUBLE}} source={{uri:quickItem[0]?.imgData}} resizeMode={FastImage.resizeMode.cover} />
                            {/*<FastImage style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}} source={{uri:item?.gimg_chg}} resizeMode={FastImage.resizeMode.cover} />*/}
                        </TouchableWithoutFeedback>
                        }
                        {!imgUrl &&
                            <TouchableWithoutFeedback onPress={()=>{setDetailShow(true); dispatch(setItemDetail({itemID})); }} >
                                <MenuImageDefaultWrapper>
                                    <MenuImageDefault source={require("../../assets/icons/logo.png")}/>
                                </MenuImageDefaultWrapper>
                            </TouchableWithoutFeedback>
                        }
                    <MenuItemImageWrapper>
                        <MenuItemHotnessWrapper>
                            {item?.is_new=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/new_menu.png')} />
                            }
                            {item?.is_best=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/best_menu.png')} />
                            }
                            {item?.is_on=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/hot_menu.png')} />
                            }
                        </MenuItemHotnessWrapper>

                    <MenuItemButtonWrapper>
                            {
                                item.spicy == "1" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "1.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "3" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "HOT" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/hot_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "COLD" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/cold_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                        </MenuItemButtonWrapper>
                        
                    </MenuItemImageWrapper>

                    {item?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    {(item?.sale_status!='3'&&!isAvailable(item)) &&
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>준비중</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    </MenuItemTopWrapper>
                    <QuickMenuItemBottomWRapper>
                        <QuickMenuItemName>{itemTitle()||item.gname_kr}</QuickMenuItemName>
                        <QuickMenuItemPrice>{numberWithCommas(itemPrice)}원</QuickMenuItemPrice>
                    </QuickMenuItemBottomWRapper>

                </QuickMenuItemWrapper>
            </>
        )

    }
    
    return(
        <>
            <QuickTopMenuWrapper>
                <CategorySelected isSelected={true} >
                    <TopMenuText key={"subcatText_"} >{"빠른 주문"}</TopMenuText>
                </CategorySelected>
            </QuickTopMenuWrapper>
            <QuickOrderWrapper>
                <FlatList
                    style={{height:'100%', zIndex: 99, paddingBottom:10,flex:1}}
                    data={lastOrderItem}
                    horizontal={true}
                    numColumns={1}
                    renderItem={({item, index})=>{ 
                        return(
                        <>
                            <QuickItem
                                item={item}
                            />
                        </>
                        ); 
                    }}
                />

                <BottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ }}>
                        <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.popup.closeTitle}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>
            </QuickOrderWrapper>
        </>
    )

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
import React, { useEffect, useState } from 'react'
import {View, NativeModules, Animated, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { PopupCloseButton, PopupCloseButtonWrapper, PopupContentWrapper, PopupWrapper } from '../../styles/common/popup';
import { setPopupVisibility } from '../../store/popup';
import LanguageSelectPopup from '../popups/languageSelectPopup';
import TogoPopup from '../popups/togoTimePopup';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import OrderListPopup from '../popups/orderListPopup';
import SettingPopup from '../popups/settingPopup';
import CallServerPopup from '../popups/callServerPopup';
import { openPopup } from '../../utils/common';
import ErrorPopup from './errorPopup';
import OptionSelectPopup from '../popups/optionSelectPopup';
import OrderCompletePopup from './orderCompletePopup';
import TimeOutPopup from './orderCompletePopup';
import AutoClosePopup from './autoClosePopup';
import NonAutoClosePopup from './nonAutoClosePopup';
import OrderFailListPopup from '../popups/orderFailList';

const PopUp = (props) =>{
    
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {isPopupVisible, innerView, param} = useSelector(state=>state.popup);
    const [popupZIndex, setPopupZIndex] = useState(0);
    const [size, setSize] = useState("0") 
    

    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0,1.3,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    });
    
    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0,1.3,1],
    });
    const animatedHeightTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    })

    const boxWidthStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        
   };
    const onSelectHandleAnimation = async (popOpen) => {
        Animated.timing(widthAnimation, {
            toValue:popOpen,
            duration: 300,
            useNativeDriver:true,
        }).start(()=>{
            if(popOpen==0) {
                setPopupZIndex(0)
                setSize('0');
            }
        }) 
    }
    useEffect(()=>{
        if(isPopupVisible) {
            setPopupZIndex(999999);
            setSize('100%');
            onSelectHandleAnimation(2);
        }else {
            onSelectHandleAnimation(0);
        }
    },[isPopupVisible])

    return(
        <>
            <Animated.View  style={[{...PopStyle.animatedPop,...boxWidthStyle,...{zIndex:popupZIndex, width:size, height:size}} ]} >   
                <TouchableWithoutFeedback onPress={()=>{ openPopup(dispatch,{innerView:"", isPopupVisible:false}); }}>
                    <PopupWrapper/>
                </TouchableWithoutFeedback>
                <PopupContentWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ openPopup(dispatch,{innerView:"", isPopupVisible:false}); }}>
                        <PopupCloseButtonWrapper>
                            <PopupCloseButton source={require('../../assets/icons/close_red.png')}/>
                        </PopupCloseButtonWrapper>
                    </TouchableWithoutFeedback>
                    {innerView=="LanguageSelectPopup"&&
                        <LanguageSelectPopup/>
                    }
                    {innerView=="TogoPopup"&&
                        <TogoPopup param={param}/>
                    }
                   
                    {/*(innerView=="OrderList") &&
                        <OrderListPopup/>
                */}

                    {(innerView=="OrderFailList") &&
                        <OrderFailListPopup param={param} />
                    }
                    {/*( innerView=="OrderList") &&
                        <PopupBottomButtonWrapper>
                            <TouchableWithoutFeedback onPress={()=>{openPopup(dispatch,{innerView:"", isPopupVisible:false}); }}>
                                <PopupBottomButtonBlack>
                                    <PopupBottomButtonText>{LANGUAGE[language]?.popup.closeTitle}</PopupBottomButtonText>
                                </PopupBottomButtonBlack>
                            </TouchableWithoutFeedback>
                        </PopupBottomButtonWrapper>
                    */}
                    {(innerView=="Setting") &&
                        <SettingPopup/>
                    }
                    {innerView=="CallServer"&&
                        <CallServerPopup/>
                    }
                    {innerView=="Option"&&
                        <OptionSelectPopup/>
                    }

                    {innerView=="Error"&&
                        <ErrorPopup/>
                    }
                    {/*innerView=="OrderComplete"&&
                        <OrderCompletePopup/>
                    */}
                    {innerView=="AutoClose"&&
                        <AutoClosePopup/>
                    }
                    {innerView=="NonAutoClose"&&
                        <NonAutoClosePopup/>
                    }
                </PopupContentWrapper>
            </Animated.View>
        </>
    )
}
const PopStyle = StyleSheet.create({
    animatedPop:{
        position:'absolute',
        width:'100%',
        height:'100%',
        zIndex:99999999,
    }

})
export default PopUp;
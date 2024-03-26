import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableWithoutFeedback} from 'react-native'
import { LogoTop, LogoWrapper, SideBottomButton, SideBottomIcon, SideBottomText, SideBottomWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuScrollView, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import _ from "lodash";
import { colorRed, colorWhite } from '../../assets/colors/color'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import LeftMenuList from '../menuComponents/leftMenuList'
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { setCartView } from '../../store/cart';
import { LANGUAGE } from '../../resources/strings';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';

const SideMenu = () =>{
    const dispatch = useDispatch();
    const {mainCategories, allCategories} = useSelector((state)=>state.categories);
    const {language} = useSelector(state=>state.languages);
    
    // 세팅 터치
    const [settingTouch, setSettingTouch] = useState(0);
    const [isStartCounting, setIsStartCounting] = useState(true);

    let settingCount=null;
    let countTime = 5;
    const countDown = () =>{
        if(isStartCounting) {
            setIsStartCounting(false);
            settingCount = setInterval(() => {
                if(countTime>0) {
                    countTime = countTime-1;
                }else {
                    countTime = 5
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                }
            }, 1000);
        }
    }
    const onSettingPress = () => {
        if(settingTouch<5) {
            setSettingTouch(settingTouch+1);
            if(countTime>0) {
                if(settingTouch>=4) {
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                    setSettingTouch(0);
                    openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true});
                }
            }
        }else {
            setSettingTouch(0);
        }
    } 
    // 문제 없으면 /components/menuComponents/sideMenuItem.js 제거
    if(allCategories.length <=0) {
        return (
            <SideMenuWrapper>
                <TouchableWithoutFeedback onPress={()=>{ countDown(); onSettingPress();} } style={{position:'absolute',  top:0,left:0, zIndex:999999999}}>
                    <LogoWrapper>
                        <LogoTop source={require("../../assets/icons/logo.png")}  />
                    </LogoWrapper>
                </TouchableWithoutFeedback>
                
                <SideBottomWrapper>
                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openPopup(dispatch, {innerView:"LanguageSelectPopup", isPopupVisible:true}); }} >
                            <SideBottomButton borderColor={colorWhite} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.languageSelect}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/korean.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>{/* 
                   <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"CallServer", isFullPopupVisible:true});}} >
                        <SideBottomButton bg={"red"} borderColor={colorRed} >
                            <SideBottomText>{LANGUAGE[language]?.sideMenu.callServer}</SideBottomText>
                            <SideBottomIcon source={require("../../assets/icons/bell_trans.png")}  />
                        </SideBottomButton>
                    </TouchableWithoutFeedback>  */}
                </SideBottomWrapper>
            </SideMenuWrapper>    
        )
    }
    return(
        <>
            <SideMenuWrapper>
                <TouchableWithoutFeedback onPress={()=>{ countDown(); onSettingPress();} } style={{position:'absolute',  top:0,left:0, zIndex:999999999}}>
                    <LogoWrapper>
                        <LogoTop source={require("../../assets/icons/logo.png")}  />
                    </LogoWrapper>
                </TouchableWithoutFeedback>
                <SideMenuScrollView showsVerticalScrollIndicator={false} >
                    <SideMenuItemWrapper>
                        {allCategories &&
                            <LeftMenuList
                                data={allCategories}
                                onSelectItem={(index)=>{}}
                                initSelect={allCategories[0]?.cate_code1}
                            />
                        }
                    </SideMenuItemWrapper>
                </SideMenuScrollView>
                <SideBottomWrapper>
                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"CallServer", isFullPopupVisible:true}); }} >
                            <SideBottomButton bg={"red"} borderColor={colorRed} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.callServer}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/bell_trans.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openPopup(dispatch, {innerView:"LanguageSelectPopup", isPopupVisible:true}); }} >
                            <SideBottomButton borderColor={colorWhite} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.languageSelect}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/korean.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                </SideBottomWrapper>
            </SideMenuWrapper>
        </>
    )
}

export default SideMenu
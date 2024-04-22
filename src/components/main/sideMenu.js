import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableWithoutFeedback} from 'react-native'
import { LogoTop, LogoWrapper, SideBottomButton, SideBottomIcon, SideBottomText, SideBottomWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuScrollView, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import _ from "lodash";
import { colorRed, colorWhite } from '../../assets/colors/color'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import LeftMenuList from '../menuComponents/leftMenuList'
import { LANGUAGE } from '../../resources/strings';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
import { setAdScreen } from '../../store/ad';

const SideMenu = () =>{
    const dispatch = useDispatch();
    const {mainCategories, allCategories} = useSelector((state)=>state.categories);
    const {language} = useSelector(state=>state.languages);
  

    // 문제 없으면 /components/menuComponents/sideMenuItem.js 제거
    if(allCategories.length <=0) {
        return (
            <SideMenuWrapper>
                <TouchableWithoutFeedback onPress={()=>{ console.log("press logo"); dispatch(setAdScreen({isShow:true,isMain:true}));}}>
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
                <TouchableWithoutFeedback onPress={()=>{ dispatch(setAdScreen({isShow:true,isMain:true}));}}>
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
                    {/* 
                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"CallServer", isFullPopupVisible:true}); }} >
                            <SideBottomButton bg={"red"} borderColor={colorRed} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.callServer}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/bell_trans.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                    */}
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
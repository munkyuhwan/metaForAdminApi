import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LanguageIconChecked, LanguageIconDim, LanguageIconImage, LanguageIconWrapper, LanguageSelectSubtitleText, LanguageSelectTitleText, LanguageSelectTitleWrapper, LanguageSelectWrapper, LanguageSelectedText, LanguageSelectedWrapper, LanguageWrapper } from '../../styles/popup/languageSelectPopupStyle';
import { LANGUAGE, LANGUAGE_LIST } from '../../resources/strings';
import { LANGUAGE_KOREAN } from '../../resources/icons';
import { TouchableWithoutFeedback } from 'react-native';
import { setLanguage } from '../../store/languages';
import { PopupSubtitleText, PopupTitleText, PopupTitleWrapper } from '../../styles/common/coreStyle';

const LanguageSelectPopup = () => {
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    return(
        <>
            <LanguageSelectWrapper>
                <PopupTitleWrapper>
                    <PopupTitleText>{LANGUAGE[language]?.languageSelectView.title}</PopupTitleText>
                    <PopupSubtitleText>{LANGUAGE[language]?.languageSelectView.subTitle}</PopupSubtitleText>
                </PopupTitleWrapper>
                <LanguageWrapper>
                    {
                        LANGUAGE_LIST.map(el => {
                            return (
                                <TouchableWithoutFeedback key={el+"_language"} onPress={()=>{dispatch(setLanguage(el))}}>
                                    <LanguageIconWrapper>
                                        {el=="korean" &&
                                            <LanguageIconImage source={require("../../assets/icons/korean.png")} />
                                        }
                                        {el=="japanese" &&
                                            <LanguageIconImage source={require("../../assets/icons/japanese.png")} />
                                        }
                                        {el=="chinese" &&
                                            <LanguageIconImage source={require("../../assets/icons/chinese.png")} />
                                        }
                                        {el=="english" &&
                                            <LanguageIconImage source={require("../../assets/icons/english.png")} />
                                        }
                                        {el==language &&
                                            <LanguageSelectedWrapper>
                                                <LanguageIconDim/>
                                                <LanguageIconChecked source={require("../../assets/icons/check_red.png")} />
                                                <LanguageSelectedText>{LANGUAGE[language]?.languageSelectView.selectedLanguage}</LanguageSelectedText>
                                            </LanguageSelectedWrapper>
                                        }
                                    </LanguageIconWrapper>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </LanguageWrapper>
                
            </LanguageSelectWrapper>
        </>
    )
}
export default LanguageSelectPopup;
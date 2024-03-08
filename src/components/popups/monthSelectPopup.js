import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MonthSelectPickerItem, MonthSelectPickerWrapper, MonthSelectTransparentBackground, MonthSelectWrapper } from '../../styles/popup/monthSelectPopup';
import { Picker } from '@react-native-picker/picker';
import { OptTitleText } from '../../styles/main/detailStyle';
import { LANGUAGE } from '../../resources/strings';
import { PopupBottomButtonBlack, PopupBottomButtonRed, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { TouchableWithoutFeedback, View } from 'react-native';
import { setMonthPopup, setSelectedMonth } from '../../store/monthPopup';
import { colorRed } from '../../assets/colors/color';

const MonthSelectPopup = (props) =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {monthSelected} = useSelector(state=>state.monthSelect);
    const monthPicker = useRef();
    const MONTHS = ["00","03","04","05","06","07","08","09","10","11","12"]

    return(
        <>
            <MonthSelectWrapper>
                <MonthSelectTransparentBackground/>
                <MonthSelectPickerWrapper>
                    <OptTitleText style={{fontSize:50}} >할부개월 선택</OptTitleText>
                    <Picker
                        ref={monthPicker}
                        key={"monthPicker"}
                        mode='dialog'
                        onValueChange = {(itemValue, itemIndex) => {
                            dispatch(setSelectedMonth(itemValue))
                        }}
                        selectedValue={monthSelected}
                        dropdownIconColor={colorRed}
                        style = {{
                            borderStyle:"solid",
                            borderWidth:1,
                            backgroundColor:"#efefef",
                            margin:"auto",
                            width: 230,
                            height: 50,
                            flex:1,
                        }}>
                            <MonthSelectPickerItem style={{fontSize:90,fontWeight:'bold',justifyContent:'center'}}  key={"_"+"none"}  label = {"선택"} value ={""} />
                        {
                                MONTHS.map((el,index)=>{
                                return(
                                    <MonthSelectPickerItem style={{fontSize:110,fontWeight:'bold',justifyContent:'center'}}  key={index+"_"+el}  label = {el} value ={el} />
                                )
                            })
                        }
                    </Picker>
                    <View style={{flexDirection:'row', width:'100%', justifyContent:'center', paddingTop:7 }}>

                            <TouchableWithoutFeedback  onPress={()=>{ dispatch(setMonthPopup({isMonthSelectShow:false}));  }}>
                                <PopupBottomButtonBlack style={{marginRight:10}}>
                                    <PopupBottomButtonText>{LANGUAGE[language]?.popup.okTitle}</PopupBottomButtonText>
                                </PopupBottomButtonBlack>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={()=>{dispatch(setSelectedMonth("")); dispatch(setMonthPopup({isMonthSelectShow:false})); }}>
                                <PopupBottomButtonRed style={{marginLeft:10}}>
                                    <PopupBottomButtonText>{LANGUAGE[language]?.popup.cancelTitle}</PopupBottomButtonText>
                                </PopupBottomButtonRed>
                            </TouchableWithoutFeedback>

                    </View>

                </MonthSelectPickerWrapper>
                
            </MonthSelectWrapper>
        </>
    )
}
export default MonthSelectPopup;
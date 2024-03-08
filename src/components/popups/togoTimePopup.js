import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TogoTimePickerWrapper, TogoWrapper } from '../../styles/popup/togoPopupStype';
import { LANGUAGE, LANGUAGE_LIST } from '../../resources/strings';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper, PopupSubtitleText, PopupTitleText, PopupTitleWrapper } from '../../styles/common/coreStyle';
import DatePicker from 'react-native-date-picker'
import { TouchableWithoutFeedback, View } from 'react-native';
import { setPopupVisibility } from '../../store/popup';
import { numberPad, openPopup } from '../../utils/common';
import { setOrderList } from '../../store/order';

const TogoPopup = (props) =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {orderList} = useSelector(state=>state.order);
    const [timeSelected, setTimeSelected] = useState("");
    
    const param = props?.param;
    // 1009, 1002
    function onComplete () {
        const index = param?.index;
        let tmpOrdList = Object.assign([],orderList);
        let ordToChange = Object.assign({},tmpOrdList[index]);
        ordToChange.ITEM_GB = "T";
        ordToChange.ITEM_MSG = `포장 ${numberPad(timeSelected.getHours(),2)+":"+numberPad(timeSelected.getMinutes(),2)}`;
        tmpOrdList[index] = ordToChange;
        dispatch(setOrderList(tmpOrdList))
        openPopup(dispatch,{innerView:"", isPopupVisible:false}); 
    }
    useEffect(()=>{
        setTimeSelected(new Date())
    },[])

    return(
        <>
            <TogoWrapper>
                <PopupTitleWrapper>
                    <PopupTitleText>{LANGUAGE[language]?.togoView.title}</PopupTitleText>
                </PopupTitleWrapper>
                <TogoTimePickerWrapper>
                    {timeSelected &&
                        <DatePicker mode={"time"} date={timeSelected} androidVariant='nativeAndroid' is24hourSource="locale" onDateChange={(time)=>{ setTimeSelected(time) /* setTimeSelected(numberPad(time.getHours(),2)+":"+numberPad(time.getMinutes(),2)); */  }} />
                    }
                </TogoTimePickerWrapper>
                <View style={{marginTop:45}} />
                <PopupBottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ onComplete(); /* dispatch(setPopupVisibility({isPopupVisible:false})); */ }}>
                        <PopupBottomButtonBlack>
                            <PopupBottomButtonText>{LANGUAGE[language]?.popup.okTitle}</PopupBottomButtonText>
                        </PopupBottomButtonBlack>
                    </TouchableWithoutFeedback>
                </PopupBottomButtonWrapper>
            </TogoWrapper>
        </>
    )
}
export default TogoPopup;
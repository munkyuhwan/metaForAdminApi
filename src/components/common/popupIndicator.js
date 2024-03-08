import { ActivityIndicator, TouchableWithoutFeedback } from "react-native";

const { PopupIndicatorWrapper, PopupIndicatorText, IndicatorWrapper, PopupSpinner } = require("../../styles/common/popupIndicatorStyle")
const { default: WaitIndicator } = require("./waitIndicator")


const PopupIndicator = (props) => {
    return (
        <TouchableWithoutFeedback onPress={()=>{props?.setText("")}} >  
            <PopupIndicatorWrapper>
                <IndicatorWrapper>
                    <PopupSpinner size={'large'}/>
                    <PopupIndicatorText>{props?.text}</PopupIndicatorText>
                </IndicatorWrapper>
            </PopupIndicatorWrapper>
        </TouchableWithoutFeedback>
    )
}
export default PopupIndicator;
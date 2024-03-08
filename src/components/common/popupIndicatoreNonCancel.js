import { ActivityIndicator, TouchableWithoutFeedback } from "react-native";

const { PopupIndicatorWrapper, PopupIndicatorText, IndicatorWrapper, PopupSpinner, PopupIndicatorTransparentWrapper } = require("../../styles/common/popupIndicatorStyle")
const { default: WaitIndicator } = require("./waitIndicator")


const PopupIndicatorNonCancel = (props) => {
    return (
            <PopupIndicatorTransparentWrapper>
                <IndicatorWrapper>
                    <PopupSpinner size={'large'}/>
                    <PopupIndicatorText>{props?.text}</PopupIndicatorText>
                </IndicatorWrapper>
            </PopupIndicatorTransparentWrapper>
    )
}
export default PopupIndicatorNonCancel;
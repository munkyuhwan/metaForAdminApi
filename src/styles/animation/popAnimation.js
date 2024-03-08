const { useState } = require("react");
const { Animated } = require("react-native");

export const PopAnimation = ()=> {

    const [popupZIndex, setPopupZIndex] = useState(0);
    const [size, setSize] = useState("0") 

    const init = () =>{
        setSize("0");
        setPopupZIndex(0);
    }

    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1,1.1,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    });

    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1,1.1,1],
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
    const onSelectHandleAnimation = async (toValue) => {
        Animated.timing(widthAnimation, {
            toValue:toValue,
            duration: 200,
            useNativeDriver:true,
        }).start(()=>{
            /*
            if(popOpen==0) {
                setPopupZIndex(0)
                setSize('0');
            }
            */
        }) 
    }

}

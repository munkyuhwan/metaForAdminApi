const { useState } = require("react");
const { Animated } = require("react-native");

const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));

export const widthAnimationStyle = () => {


    const slideInterpolate = widthAnimation.interpolate({
        inputRange:[0,1],
        outputRange:['100%','65%']
    })
    const widthStyle = {
        transform: [{translateX:slideInterpolate},],
    };

   

    return widthStyle;
}
export const startWidthAnimation = (isOn) =>{
    Animated.parallel([
        Animated.timing(widthAnimation,{
            toValue:isOn?1:0,
            duration:200,
            useNativeDriver:true
        })
    ]).start();
}
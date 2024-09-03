import { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import FastImage from "react-native-fast-image";


const EventPopup = () =>{
    const [imgNow, setImgNow] = useState(0);
    function onTouch() {
        if(imgNow <2) {
            setImgNow(imgNow+1);    
        }else {
            setImgNow(0);    
            EventRegister.emit("openEventPopup",{isOpen:false});
        }
    }
    useEffect(()=>{
        setImgNow(0);
    },[])
    return(
        <>
                {imgNow == 0 &&
                    <TouchableWithoutFeedback onPress={()=>{onTouch()}} >
                        <FastImage source={require("../../assets/imgs/popup02.png")}  resizeMode={FastImage.resizeMode.contain} style={{width:'100%', height:'100%', position:'absolute',zIndex:9999,  }}  />
                    </TouchableWithoutFeedback>
                }
                {imgNow == 1 &&
                    <TouchableWithoutFeedback onPress={()=>{onTouch()}} >
                        <FastImage source={require("../../assets/imgs/popup03.png")}  resizeMode={FastImage.resizeMode.contain} style={{width:'100%', height:'100%', position:'absolute',zIndex:9999,  }}  />
                    </TouchableWithoutFeedback>
                }
                {imgNow == 2 &&
                    <TouchableWithoutFeedback onPress={()=>{onTouch()}} >
                        <FastImage source={require("../../assets/imgs/popup04.png")}  resizeMode={FastImage.resizeMode.contain} style={{width:'100%', height:'100%', position:'absolute',zIndex:9999,  }}  />
                    </TouchableWithoutFeedback>
                }
        </>
    )
}
export default EventPopup;
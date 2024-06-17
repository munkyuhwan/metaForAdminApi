import { useDispatch, useSelector } from "react-redux";
import { FloatingBackgroundInnerdWrapper, FloatingBackgroundWrapper, FloatingImg, FloatingWrapper } from "../../styles/popup/floatingButtonPopupStyle";
import { useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import { RADIUS_DOUBLE } from "../../styles/values";
import { TouchableWithoutFeedback, View } from "react-native";
import { addToOrderList } from "../../store/order";
import { setItemDetail } from "../../store/menuDetail";
import { MenuItemButton, MenuItemButtonInnerWrapperLeft } from "../../styles/main/menuListStyle";


const FloatingBtn = (props) => {

    const dispatch = useDispatch();
    const {lastOrderItem} = useSelector(state => state.tableInfo);
    const {allItems} = useSelector(state=>state.menu);
    const {images} = useSelector(state=>state.imageStorage);
    const {isOn} = useSelector((state)=>state.cartView);

    const [lastItemDetail, setLastItemDetail] = useState({});
    const filteredImg = images.filter(el=>el.name==lastOrderItem);


    useEffect(()=>{
        if(lastOrderItem!="") {
            if(allItems?.length>0) {
                const selected = allItems?.filter(el=>el.prod_cd == lastOrderItem);
                setLastItemDetail(selected);
            }
        }

    },[lastOrderItem])
    if(!filteredImg[0]) {
        return(
            <></>
        )
    }
    if(isOn) {
        return(
            <></>
        )
    }

    return(
        <>
            <FloatingBackgroundWrapper size={"150"} >
                <FloatingBackgroundInnerdWrapper size={"140"} >
                    <TouchableWithoutFeedback onPress={()=>{
                        if(lastItemDetail[0]?.prod_gb=="09"||lastItemDetail[0]?.prod_gb=="02"){
                            props?.setDetailShow(true);  
                            dispatch(setItemDetail({itemID:lastItemDetail[0].prod_cd}));
                        } else { 
                            dispatch(addToOrderList({isAdd:true, isDelete: false, item:lastItemDetail[0],menuOptionSelected:[]}));
                        }
                    }} >
                        <FloatingWrapper>
                            <FastImage style={{ width:'100%',height:'100%', borderRadius:200}} source={{uri:filteredImg[0].imgData}} resizeMode={FastImage.resizeMode.cover} />
                            <FastImage style={{width:30, height:30, position:'absolute',right:-7,bottom:-3}} source={require('../../assets/icons/add.png')} resizeMode={FastImage.resizeMode.cover} />
                        </FloatingWrapper>
                    </TouchableWithoutFeedback>
                </FloatingBackgroundInnerdWrapper>
            </FloatingBackgroundWrapper>
        </>
    )
}

export default FloatingBtn;
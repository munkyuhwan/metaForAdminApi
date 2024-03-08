import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components';
import { colorBlack, colorRed, colorWhite } from '../../assets/colors/color';
import { RADIUS_SMALL, RADIUS_SMALL_DOUBLE } from '../../styles/values';

const SelectItemComponent = (props) =>{

    const data = props?.data;
    const [selectedItems, setSelectedItems] = useState([]);

    const onItemPressed = (index) => {
        let addedItems = selectedItems;
        if(addedItems.includes(index)) {
            //addedItems.splice(addedItems.indexOf(index),)
            addedItems = addedItems.filter(el=>el!=index);
        }else {
            addedItems.push(index);
        }
        props?.onServiceSelected(addedItems);
        setSelectedItems(addedItems);
    }

    return(
        <>
            <SelectItemWrapper>
            <FlatList
                data={data}
                renderItem={({item, index})=>{return(<SelectItem selectedItems={selectedItems} onPress={(index)=>{onItemPressed(index)}} key={index} item={item} /> );}}
                numColumns={4}
                key={({item, index})=>{return "_"+index}}
                keyExtractor={(item,index)=>index}
            />
               
            </SelectItemWrapper>

        </>
    )
}

const SelectItem = (props) => {

    const data = props?.item;

    const selectedItems = props?.selectedItems;
    const [itemTextColor, setItemTextColor] = useState(colorBlack);
    const [isItemChecked, setIsItemChecked] = useState(false);
    const [popupZIndex, setPopupZIndex] = useState(0);
    const [size, setSize] = useState("0") 
    // animation set
    const [popAnimation, setPopAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = popAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1,1.1,1],
    });
    const animatedWidthTranslate = popAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    });
    
    // height interpolation 
    const animatedHeightScale = popAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1,1.1,1],
    });
    const animatedHeightTranslate = popAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    })
    // background color interpopation 
    const animatedColorTranslate = popAnimation.interpolate({
        inputRange: [0,1,2],
        outputRange:[colorWhite ,colorRed, colorRed]
    })

    const popStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        backgroundColor:animatedColorTranslate,
        width:210,
        height:70,
        justifyContents:'center',
        textAlign:'center',
        alignItems:'center',
        margin:6,
        borderRadius:RADIUS_SMALL_DOUBLE,
    };
    const onSelectHandleAnimation = async (toValue) => {
        if(selectedItems.includes(data.idx)){
            setItemTextColor(colorBlack);
            setIsItemChecked(false);
            toValue=0;
        }else {
            setItemTextColor(colorWhite);
            setIsItemChecked(true);    
        }
        Animated.timing(popAnimation, {
            toValue:toValue,
            duration: 200,
            useNativeDriver:true,
        }).start(()=>{
            
        }) 
    }
    const {language} = useSelector(state=>state.languages);

    const languageSelect = () => {
        switch(language){
            case "japanese":
                return data?.subject_jp;
                break;
            case "chinese":
                return data?.subject_cn;
                break;
            case "english":
                return data?.subject_en;
                break;
            default:
                return data?.subject
                break;

        }
    }

    return(
        <>
            <Animated.View  style={[{...popStyle, ...PopStyle.animatedPop,...{zIndex:popupZIndex, width:size, height:size}} ]} >   
                <TouchableWithoutFeedback onPress={()=>{onSelectHandleAnimation(2); props?.onPress(data?.idx);  } }>
                    <SelectItemContentWrapper>
                        <SelectItemText textColor={itemTextColor} >{languageSelect()}</SelectItemText>
                        {isItemChecked &&
                            <SelectItemChecked source={require("../../assets/icons/check_black.png")}/>
                        }
                    </SelectItemContentWrapper>
                </TouchableWithoutFeedback>
            </Animated.View>
        </>
    )
}

const PopStyle = StyleSheet.create({
    animatedPop:{
        width:227,
        height:70,
    }
});

const SelectItemWrapper = styled.View`
    width:100%;
    height:100%;
    flexDirection:row;
    justifyContents:center;
    alignItems:center;

`
const SelectItemContentWrapper = styled.View`
    width:210px;
    height:60px;
    justifyContents:center;
    textAlign:center;
    alignItems:center;
    margin:6px;
    borderRadius:${RADIUS_SMALL};
`

const SelectItemText = styled.Text`
    color:${props=>props.textColor};
    marginTop:auto;
    marginBottom:auto;
    fontSize:24px;
    textAlign:center;
`
const SelectItemChecked = styled.Image`
    position:absolute;
    width:18px;
    height:18px;
    right:9px;
    top:8px;
    resizeMode:contain;
`

export default SelectItemComponent;
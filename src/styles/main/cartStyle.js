import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS, RADIUS_DOUBLE } from '../values';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { colorBlack, colorGrey, colorRed, colorWhite, mainTheme, textColorWhite } from '../../assets/colors/color';
import FastImage from 'react-native-fast-image';

export const CartViewWrapper = styled(Animated.View)`
    backgroundColor:#ffffff; 
    height:100%; 
    width:33%;
    paddingTop:94px;
    position:absolute;
    zIndex:99;
    right:0;
    flexDirection:column;
`

export const CartFlatList = styled.FlatList`
    backgroundColor:${colorWhite};
`
export const Handle = styled.View`
    backgroundColor:${colorWhite};
    height:81px;
    width:28px;
    marginTop:320px;
    position:absolute;
    left:-27px;
    zIndex:999999;
    borderTopLeftRadius:23px;
    borderBottomLeftRadius:22px;
    alignIten:center;
    justfyContent:center;
    paddingLeft:8px;
`
export const ArrowImage = styled.Image`
    resizeMode:contain;
    width:15px;
    flex:1;
`

// cart list item
export const CartItemWrapper = styled.View`
    width:100%;
    height:210px;
    paddingBottom:17px;
    paddingTop:17px; 
    paddingLeft:13px;
    paddingRight:13px;
    borderBottomWidth:1px;
    borderColor:${colorGrey};
    flexDirection:row;
`
// cart 이미지 포장하기 
export const CartItemImageTogoWrapper = styled.View`
    flexDirection:column;
`
export const CartItemImage = styled(FastImage)`
    width:120px;
    height:106px;
    borderRadius:${RADIUS};
`
export const CartItemFastImage = styled(FastImage)`
    width:100px;
    height:62px;
    backgroundColor:brown;
    borderRadius:${RADIUS};
`
export const OperandorText = styled.Text`
    fontSize:48px;
    color:${colorBlack};
    width:100%;
    textAlign:center;
    justifyContent:center;
    lineHeight:58px;

`
export const CartItemTogoWrapper = styled.View`
    width:120px;
    height: 58px;
    backgroundColor:${mainTheme};
    marginTop:12px;
    alignItem:center;
    justifyContent:center;
    flexDirection:row;
    borderRadius:${RADIUS};
`
export const CartItemTogoText = styled.Text`
    color:${textColorWhite};
    textAlign:center;
    fontSize:23px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
`
export const CartItemTogoIcon = styled.Image`
    width:17px;
    height:17px;
    resizeMode:contain;
    marginLeft:6px;
    marginTop:auto;
    marginBottom:auto;
`
// cart 이름, 가격, 수량
export const CartItemTitlePriceWrapper = styled.View`
    width:46%;
    paddingLeft:8px;
    paddingRight:2px;
    paddingTop:2px;
    flexDirection:column;
`
export const CartItemTitle = styled.Text`
    fontSize:16px;
    fontWeight:bold;
    color:${mainTheme};
    flex:1;
    maxWidth:110px;
`
export const CartItemOpts = styled.Text`
    fontSize:12px;
    color:${mainTheme};
    flex:1;
    height:20px;
`
export const CartItemPrice = styled.Text`
    fontSize:34px;
    fontWeight:normal;
    color:${colorRed};
    minHeight:17px;
    textAlignVertical:bottom;
    width:110%;
    
`
// 수량 조절 
export const CartItemAmtWrapper = styled.View`
    width:130%;
    height: 60px;
    backgroundColor:${colorGrey};
    borderRadius:${RADIUS};
    flexDirection:row;
    padding:3px;
    marginTop:17px;
`
export const CartItemAmtController = styled.View`
    width:52px;
    height:52px;
    backgroundColor:${colorWhite};
    borderRadius:${RADIUS};
    marginTop:auto;
    marginBottom:auto;
    flexDirection:row;
    textAlign:center;
`
export const CartItemAmtControllerImage = styled.Image`
    width:52px;
    height:52px;
    flex:1;
    resizeMode:contain;
 `
export const CartItemAmtText = styled.Text`
    fontSize:30px;
    fontWeight:bold;
    flex:1;
    textAlign:center;
    lineHeight:58px;
`
// 수량 조절 메뉴 상세
export const DetailItemAmtWrapper = styled.View`
    width:171px;
    height: 40px;
    backgroundColor:${colorGrey};
    borderRadius:${RADIUS};
    flexDirection:row;
    padding:3px;
    marginTop:3px;
`
export const DetailItemAmtController = styled.View`
    width:32px;
    height:32px;
    backgroundColor:${colorWhite};
    borderRadius:${RADIUS};
    marginTop:auto;
    marginBottom:auto;
    flexDirection:row;
    textAlign:center;
`
export const DetailItemAmtControllerImage = styled.Image`
    width:52px;
    height:52px;
    flex:1;
    resizeMode:contain;
 `
export const DetailItemAmtText = styled.Text`
    fontSize:30px;
    fontWeight:bold;
    flex:1;
    textAlign:center;
    lineHeight:42px;
`
export const DetailOperandorText = styled.Text`
    fontSize:48px;
    color:${colorBlack};
    width:100%;
    textAlign:center;
    justifyContent:center;
    lineHeight:45px;

`


// 취소 버튼
export const CartItemCancelWrapper = styled.View`
    width:30%;
    height:24%;
    flex:1;
`
export const CartItemCancelBtn = styled.Image`
    width:100%;
    height:100%;
    resizeMode:contain;
`
// 주문하기
export const OrderWrapper = styled.View`
    backgroundColor:#D9D9D9;
    width:100%;
    height:30%;
    paddingRight:23px;
    paddingLeft:23px;
    paddingBottom:23px;
    paddingTop:20px;
`

export const PayWrapper = styled.View`

`
export const PayAmtWrapper = styled.View`
    flexDirection:row;
    paddingBottom:7px;
    paddingTop:7px;
    ${(props)=>{
        if(props.isBordered) {
            return (
                "borderBottomWidth:1px;"+
                `borderColor:${colorBlack}`
            )
        }
    }}
`
export const PayAmtTitle = styled.Text`
    flex:1;
    fontSize:20px;
    color:${colorBlack}
`
export const PayAmtNumber = styled.Text`
    fontSize:20px;
    color:${colorBlack};
    fontWeight:bold;
`
export const PayAmtUnit = styled.Text`
    fontSize:20px;
    color:${colorBlack};
`
export const PayBtnWrapper = styled.View`
    flexDirection:row;
`
export const PayBtn = styled.View`
    width: ${(props)=>{ return props?.isFull? "100%" :  "48%" }};
    ${(props)=>{ return props?.isGap?"marginLeft:4px; marginRight:4px;":"" }}
    backgroundColor:${colorRed};
    flexDirection:row;
    textAlign:center;
    justifyContent:center;
    borderRadius:${RADIUS};
    marginTop:10px;
    paddingTop:7px;
    paddingBottom:7px;
`
export const PayTitle = styled.Text`
    color:${colorWhite};
    fontSize:32px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
`
export const PayIcon = styled.Image`
    marginTop:auto;
    marginBottom:auto;
    marginLeft:7px;
    width:25px;
    resizeMode:contain;
`
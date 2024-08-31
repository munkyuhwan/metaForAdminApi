import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorRed, colorWhite, mainTheme } from '../../assets/colors/color';
import { RADIUS, RADIUS_SMALL } from '../values';

export const PopupWrapper = styled.View`
    width:100%;
    height:100%;
    position:absolute;
    backgroundColor:rgba(0,0,0,0.7);
`
export const PopupContentWrapper = styled.View`
    width:415px;
    paddingTop:9px;
    paddingRight:7px;
    paddingLeft:7px;
    paddingBottom:7px;
    backgroundColor:${colorWhite};
    margin:auto;
    borderRadius:${RADIUS};   
`
export const PopupCloseButtonWrapper = styled.View`
    width:100%;
    alignItems:flex-end;
`
export const PopupCloseButton = styled.Image`
    width:48px;
    height:48px;
    resizeMode:contain;
`

// 투명배경 팝업
export const TransparentPopupWrapper = styled.View`
    flex:1;
    marginTop:58px;
    marginRight:96px;
    marginLeft:96px;
    marginBottom:64px;
`
// 투명배경 상단 텍스트
export const TransparentPopupTopWrapper = styled.View`
`
export const TransperentPopupTopTitle = styled.Text`
    fontSize:38px;
    color:${colorRed};
    fontWeight:bold;
`
export const TransperentPopupTopSubTitle = styled.Text`
    paddingTop:40px;
    color:${colorBlack};
    lineHeight:31px;
    fontSize:24px;
`
// 투명배경 팝업 중간 뷰
export const TransperentPopupMidWrapper = styled.View`
    flex:1;
    width:100%;
    justifyContents:center;
    alignItems:center;
`   
// 하단 버튼 선택
export const TransparentPopupBottomWrapper = styled.View`
    width:100%;
    flexDirection:column;
    justifyContents:center;
    alignItems:center;
`
export const TransparentPopupBottomInnerWrapper = styled.View`
    flexDirection:row;
    justifyContents:space-between;
`
export const TransparentPopupBottomButtonWraper  = styled.View`
    backgroundColor:${(props)=>props.bgColor};
    flexDirection:row;
    alignItems:center;
    paddingTop:16px;
    paddingBottom:14px;
    paddingRight:34px;
    paddingLeft:38px;
    borderRadius:${RADIUS_SMALL};
    marginLeft:10px;
    marginRight:10px;
`
export const TransparentPopupBottomButtonText = styled.Text`
    color:${colorWhite};
    fontSize:18px;
    paddingRight:12px;
`
export const TransparentPopupBottomButtonIcon = styled.Image`
    width:15px;
    height:15px;
    resizeMode:contain;
`

export const FullsizePopupWrapper = styled.View`
    width:100%;
    height:100%;
    position:absolute;
    backgroundColor:${colorBlack};
`

// 주문완료 스타일
export const OrderCompleteWrapper = styled.View`
    width:100%;
    height:100%;
    flex:1;
    padding:40px;
`
export const OrderCompleteItemWrapper = styled.View`
    margin:auto;
    textAlign:center;
`
export const OrderCompleteIcon = styled.Image`
    width:100px;
    height:100px;
    marginLeft:auto;
    marginRight:auto;
`
export const OrderCompleteText = styled.Text`
    fontSize:90px;
    color:${colorRed};
    fontWeight:bold;
`

// 투명배경 상단 텍스트
export const TransparentQuickOrderTopWrapper = styled.View`
    backgroundColor:${colorRed};
    marginBottom:5px;
`

export const TransperentQuickOrderTopSubTitle = styled.Text`
    color:${colorWhite};
    lineHeight:31px;
    fontSize:24px;
`
export const OrderReadyTitle = styled.Text`
    color:${colorWhite};
    fontSize:150px;
    margin:auto;
    
`
import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS, RADIUS_CATEGORY } from '../values';
import { colorRed, colorWhite, sideMenuColor } from '../../assets/colors/color';
//width:15.9%;
export const SideMenuWrapper = styled.View`
    height:100%;
    width:220px;
    backgroundColor:${sideMenuColor};
    borderTopRightRadius:${RADIUS};
    borderBottomRightRadius:${RADIUS};
    zIndex:999;
`
export const LogoWrapper = styled.View`
    width:180px;
    displaty:flex;
    align-items: center;
    paddingTop:15px;
    paddingBottom:15px
`
export const LogoTop = styled.Image` 
    resizeMode:contain;
    height:58px;
    width:150px;
    backgroundColor:${sideMenuColor};
`

// 사이드메뉴 뤱퍼
export const SideMenuScrollView = styled.ScrollView`
    width:105%;
    height:490px; 
`
export const SideMenuItemWrapper = styled.View`
    display:flex;
    width:100%;
`
// 사에드 메뉴 아이템 터쳐블
export const SideMenuItemOff = styled.View`
    backgroundColor:#404040;
    width:95%;
    height:60px;
    marginTop:5px;
`
export const SideMenuItem = styled.View`
    backgroundColor:#404040;
    width:190px;
    borderTopRightRadius:${RADIUS};
    borderBottomRightRadius:${RADIUS};
`
export const SideMenuItemOn = styled.View`
    width:100%;
    height:60px;
    backgroundColor:#ed3810;
    borderTopRightRadius:${RADIUS_CATEGORY};
    borderBottomRightRadius:${RADIUS_CATEGORY};
    marginTop:5px;
`
/// 사이드 메뉴 텍스트스타일
export const SideMenuText = styled.Text`
    lineHeight:70px;
    paddingRight:22px;
    paddingLeft:22px;
    fontSize:28px;
    fontWeight:bold;
    color: #ffffff;
    textAlign:center;
`;

// language & call wrapper
export const SideBottomWrapper = styled.View`
    padding:7px;
`
export const SideBottomButton = styled.View`
    width:100%;
    height:61px;
    ${(props)=>{return (props.bg=="red"?"backgroundColor:"+colorRed:"")}};
    flexDirection:row;
    justyfyContent:center;
    textAlign:center;
    borderWidth:1px;
    borderColor:${(props)=>{return(props.borderColor)}};
    borderRadius:${RADIUS};
    marginTop:8px;
    paddingLeft:22px;
    paddingRight:22px;
`
export const SideBottomText = styled.Text`
    fontSize:21px;
    fontWeight:bold;
    color:${colorWhite};
    textAlign:center;
    margin:auto;
`
export const SideBottomIcon = styled.Image`
    width:24px;
    height:24px;
    resizeMode:contain;
    margin:auto;
`

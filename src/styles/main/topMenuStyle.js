import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS, RADIUS_DOUBLE } from '../values';
import { colorBrown, colorRed, tabBaseColor, textColorWhite } from '../../assets/colors/color';
import { ScrollView } from 'react-native';

export const TopMenuWrapper = styled.View`
    flexDirection:row;
    height: 80px;
    display: flex;
    justifyContent: flex-start;
    zIndex:99999;
`
// 공지사항 텍스트
export const BulletinWrapper = styled(ScrollView)`
    width:600px;

`
export const BulletinText = styled.Text`
    fontSize:45px;
    color:${colorRed};
    fontWeight:bold;
`

export const CategoryWrapper = styled.View` 
    flexDirection:row;
    height: 80px;
    marginRight:50px;
    display: flex;
    justifyContent: flex-start;
`;
export const CategoryScrollView = styled.ScrollView`
    paddingLeft:30px;
    marginRight:36%;
    flex:1;
    flowDirection:column;
`
export const CategoryDefault = styled.View`
    backgroundColor: ${tabBaseColor};
    width:160px;
    height:90%;
    marginRight:7px;
    justifyContent: flex-end;
    marginTop:24px;
    borderTopLeftRadius:${RADIUS_DOUBLE}px;
    borderTopRightRadius:${RADIUS_DOUBLE}px;
`
export const CategorySelected = styled.View`
    backgroundColor: ${ props => props?.isSelected?colorRed:colorBrown };
    width:160px;
    height:90%;
    marginRight:7px;
    justifyContent: flex-end;
    marginTop:24px;
    borderTopLeftRadius:${RADIUS_DOUBLE}px;
    borderTopRightRadius:${RADIUS_DOUBLE}px;
`
export const FloatingCategorySelected = styled.View`
    backgroundColor: ${ props => props?.isSelected?colorRed:colorBrown };
    width:100%;
    height:90%;
    marginRight:7px;
    textAlign:center;
    marginTop:24px;
    borderTopLeftRadius:${RADIUS_DOUBLE}px;
    borderTopRightRadius:${RADIUS_DOUBLE}px;
    
`
/// 탑 메뉴 텍스트스타일
export const TopMenuText = styled.Text`
    flex:1;
    textAlign:center;
    justifyContent:center;
    display:flex;
    alignItems:center;
    fontSize:24px;
    fontWeight:bold;
    paddingTop:10%;
    color: ${textColorWhite};
`;
export const FloatingTopMenuText = styled.Text`
    flex:1;
    textAlign:center;
    justifyContent:center;
    display:flex;
    alignItems:center;
    fontSize:24px;
    fontWeight:bold;
    paddingTop:1%;
    color: ${textColorWhite};
`;

// talbe name
export const TableName = styled.View`
    backgroundColor: ${colorRed};
    width:163px;
    height:80px;
    paddingTop:4%;
    paddingBottom:8px;
    borderBottomRightRadius:${RADIUS};
    borderBottomLeftRadius:${RADIUS};
    zIndex:99999;
    flexDirection:column;
    marginLeft:4px;
    position:absolute;
    left:64%;
`
// talbe name smallTitle
export const TableNameSmall = styled.Text`
    flex:1;
    textAlign:center;
    justifyContent:center;
    display:flex;
    alignItems:center;
    fontSize:18px;
    fontWeight:bold;
    color: ${textColorWhite};
`
// talbe name bigTitle
export const TableNameBig = styled.Text`
    textAlign:center;
    justifyContent:center;
    display:flex;
    alignItems:center;
    fontSize:31px;
    fontWeight:bold;
    color: ${textColorWhite};
`

// iconWRapper
export const IconWrapper = styled.View`
    flexDirection:row;
    justifyContent:flex-end;
    height:80px;
    marginBottom:14px;
    display:flex;
    alignItems:center;
    zIndex:99999;
    position:absolute;
    right:10;
    top:3px;
`
export const TouchIcon = styled.Image`
    resizeMode:contain;
    width:47px;
    height:47px;
    marginLeft:5px;
    marginRight:5px;
    zIndex:99999;
`
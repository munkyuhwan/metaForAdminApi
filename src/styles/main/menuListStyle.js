import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS } from '../values';
import { colorBlack, colorWhite } from '../../assets/colors/color';

export const MenuListWrapper = styled.View`
    width:100%;
    height:100%;
    paddingTop:10px;
    paddingLeft:31px;
    paddingRight:36px;
    paddingBottom:80px;
`;


// menu item style
export const MenuImageDefaultWrapper = styled.View`
    width:100%;
    height:183px;
    borderRadius:${RADIUS};
    backgroundColor:${colorWhite};
`
export const MenuImageDefault = styled.Image`
    margin:auto;
    width:360px;
    height:250px;
    resizeMode:contain;
`
export const MenuItemTopWrapper = styled.View`
    flex:1;
`
export const MenuItemWrapper = styled.View`
    width:32.5%;    
`
export const MenuItemImageWrapper = styled.View`
    width:100%;
    height:100%;    
    position:absolute;
    paddingTop:7px;
    paddingBottom:15px;
    paddingLeft:12px;
    paddingRight:12px;
`
export const MenuItemImage = styled.Image`
    width:100%;
    height:183px;
    resizeMode:background;
    borderRadius:${RADIUS}
`
export const MenuItemButtonWrapper = styled.View`
    flexDirection:row;
`
export const MenuItemButtonInnerWrapperRight = styled.View`
    width:100%;
    flex:0.35;
    flexDirection: row;
    justifyContent: flex-start;
    paddingTop:5px;
 `
export const MenuItemDetailSpicenessWrapper = styled.View`
    width:100%;
    flex:2;
    flexDirection: row;
    justifyContent: flex-start;
`
export const MenuItemButtonInnerWrapperLeft = styled.View`
    width:100%;
    flex:1;
    flexDirection: row;
    justifyContent:flex-end;
`
export const MenuItemButton = styled.Image`
    width:56px;
    height:56px;
    resizeMode:contain;
`
export const MenuItemSpiciness = styled.Image`
    width:46px;
    height:46px;
    resizeMode:contain;
`
export const MenuItemHotnessWrapper = styled.View`
    flexDirection:row;
    flex:1;
`
export const MenuItemHotness = styled.Image`
    marginRight:6px;
    width:52px;
    resizeMode:contain;
    backgroundColor:#00000000;
`
export const MenuItemBottomWRapper = styled.View`
    width:100%; 
    height:100px;
    flex:1;
    flexDirection:column;  
    paddingTop:16px;
    alignItems:center;
`
export const MenuItemName = styled.Text`
    fontSize:30px;
    color:${colorWhite};
    fontWeight:900;
`
export const MenuItemPrice = styled.Text`
    fontSize:26px;
    color:${colorWhite};
 
`
export const SoldOutLayer = styled.View`
    with:300px;
    height:183px;
    position:absolute;
    z-index:99999;
    flex:1;
`
export const SoldOutDimLayer = styled.View`
    background:${colorBlack};
    opacity:0.5;
    width:300px;
    height:183px;
`
export const SoldOutDimLayerAbs = styled.View`
    background:${colorBlack};
    opacity:0.2;
    width:300px;
    height:183px;
    position:absolute;
    zIndex:2;
`
export const SoldOutText = styled.Text`
    position:absolute;
    zIndex:9999999;
    margin:auto;
    color:${colorWhite};
    fontWeight:bold;
    fontSize:45px;
    backgroundColor:#00000000;
    textAlignVertical:center;
    textAlign:center;
    width:100%;
    height:100%;
`


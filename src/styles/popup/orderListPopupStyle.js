import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorGrey, colorRed, colorWhite } from '../../assets/colors/color';
import { RADIUS, RADIUS_SMALL } from '../values';

export const OrderListPopupWrapper = styled.View`
    width:90%;
    height:90%;
    backgroundColor:${colorWhite};
    margin:auto;
    paddingTop:25px;
    paddingLeft:50px;
    paddingRight:50px;
    paddingBottom:15px;
    borderRadius:${RADIUS};
`
// 제목 뤠퍼
export const OrdrListTopWrapper = styled.View`
    flexDirection:row;
    textAlign:base-line;
`
export const OrderListTopTitle = styled.Text`
    fontSize:30px;
    color:${colorRed};
    fontWeight:bold;
`
export const OrderListTopSubtitle = styled.Text`
    fontSize:17px;
    color:${colorBlack}; 
    paddingLeft:14px;
    marginTop:auto;
`

// 메뉴 리스트 뤠퍼
export const OrderListWrapper = styled.View`
    flex:1;
    paddingBottom:30px;
    paddingTop:20px;
`
export const OrderListTableWrapper = styled.View`
    width:100%;
    height:100%;
    flexDirection:column;
    flex:1
`
export const OrderListTableColumnNameWrapper = styled.View`
    width:100%;
    flexDirection:row;
    backgroundColor:${colorBlack};
`
export const OrderListTableColumnName = styled.Text`
    color:${colorWhite};
    fontSize:17px;
    fontWeight:bold;
    flex:${props=>props?.flex};
    textAlign:center;
    paddingTop:13px;
    paddingBottom:13px;
`
export const OrderListTableList = styled.FlatList`

`
// 리스트 아이템
export const OrderListTableItemWrapper=styled.View`
    flexDirection:row;
    paddingTop:5px;
    paddingBottom:5px;
    borderBottom: solid;
    borderBottomWidth:1px;
    borderBottomColor:${colorGrey};
`
export const OrderListTableItemImageNameWrapper = styled.View`
    flex:${props=>props?.flex};
    flexDirection:row;
`
export const OrderListTableItemImage=styled.Image`
    width:94px;
    height:65px;
    resizeMode:contain;
    borderRadius:${RADIUS_SMALL};
`
export const OrderListTableItemName = styled.Text`
    color:${colorBlack};
    fontSize:34px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:18px;
`
export const OrderListTableItemAmt = styled.Text`
    color:${colorBlack};
    flex:${props=>props?.flex};
    fontSize:34px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:18px;
    textAlign:center;
    
`
export const OrderListTableItemPrice = styled.Text`
    color:${colorBlack};
    flex:${props=>props?.flex};
    fontSize:34px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:18px;
    textAlign:center;
`

export const OrderListTableItemOperander = styled.Text`
    color:${colorGrey};
    flex:${props=>props?.flex};
    fontSize:34px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:18px;
    textAlign:center;
`
export const OrderListTableItemTotal = styled.Text`
    color:${colorRed};
    flex:${props=>props?.flex};
    fontSize:34px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:18px;
    textAlign:center;
`
 
// 최종 가격 
export const OrderListTalbleGrandTotalWrapper = styled.View`
    width:100%;
    backgroundColor:${colorGrey};
    borderTopColor:${colorBlack};
    borderTop: solid;
    borderTopWidth:1px;
    borderBottomLeftRadius:${RADIUS_SMALL};
    borderBottomRightRadius:${RADIUS_SMALL};
    flexDirection:row;
    paddingTop:14px;
    paddingBottom:14px;
    paddingRight: 30px;
    paddingLeft:20px;
`
export const OrderListTotalTitle = styled.Text`
    flex:1;
    fontSize:34px;
    color:${colorBlack};
    fontWeight:bold;
    textAlign:center;
`
export const OrderListTotalAmount = styled.Text`
    flex:1;
    fontSize:34px;
    color:${colorRed};
    fontWeight:bold;
    textAlign:right;
`


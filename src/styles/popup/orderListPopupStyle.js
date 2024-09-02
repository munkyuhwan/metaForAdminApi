import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorBrown, colorCardEnd, colorCardStart, colorGrey, colorRed, colorWhite } from '../../assets/colors/color';
import { RADIUS, RADIUS_SMALL } from '../values';
import { ScrollView } from 'react-native';

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

export const OrderPayPopupWrapper = styled.View`
    width:90%;
    height:90%;
    backgroundColor:${colorWhite};
    margin:auto;
    paddingTop:15px;
    paddingLeft:10px;
    paddingRight:10px;
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
    paddingBottom:10px;
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
export const DutchPayFullWrapper = styled.View`
    flex:1;
    flexDirection:row;
    width:100%;
    marginTop:15px;
    backgroundColor:${colorGrey};
    gap:10px;
    padding:10px;
    borderTopLeftRadius:${RADIUS_SMALL};
    borderBottomLeftRadius:${RADIUS_SMALL};
    borderBottomRightRadius:${RADIUS_SMALL};
    borderWidth:3px;
    borderColor:${colorRed};
`
export const DutchPayHalfWrapper = styled.View`
    flex:1;
    width:100%;
    height:100%;
    backgroundColor:${colorWhite};
    borderRadius:${RADIUS_SMALL};
    ${props=>props?.isBorder==true?`borderWidth:2px;borderColor:${colorRed};`:""};
    alignItems:center;
    paddingTop:10px;
    paddingBottom:10px;
`
export const DutchPayPaidListScrollWrapper = styled.ScrollView`

`
export const DutchPayPaidListWrapper = styled.View`

`
export const DutchPayCartInfoText = styled.Text`
    color:${colorBlack};
    fontSize:18px;
    fontWeight:bold;
    width:100%;
    textAlign:left;
    paddingLeft:10px;
    paddingTop:4px;
    borderTopWidth:1px;
`
export const DutchPayInfoWrapper = styled.View`
    
`

// 더치페이 아이템 추가 버튼
export const DutchPayItemAddWrapper = styled.View`
    width:130%;
    height: 60px;
    backgroundColor:${colorGrey};
    borderRadius:${RADIUS};
    flexDirection:row;
    padding:3px;
    marginTop:17px;
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
export const OrderListOptionWrapper = styled.View`
    flexDirection:column;
`
export const OrderListOptionTitle = styled.Text`
    paddingLeft:20px;
    color:${colorBlack};
    fontSize:15px;
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
// 분할결제 추가 ui
// 결제하기 탭

export const OrderPayDimWrapper = styled.View`
    width:100%;
    height:120%;
    position:absolute;
    zIndex:9999999;
    backgroundColor:rgba(225,225,225,0.7);
`

export const OrderPayTabWrapper = styled.View`
    flexDirection:row;
    position:absolute;
    right:-1px;
    bottom:-22;
`
export const OrderPayTab = styled.View`
    width:175px;
    height:65px;
    ${(props)=>{ 
        if(props.isOn) {
            return `backgroundColor:${colorRed};`
        }else {
            return `backgroundColor:${colorGrey};`
        }
    }}
    marginLeft:10px;
    borderTopLeftRadius:${RADIUS};
    borderTopRightRadius:${RADIUS};
`
export const OrderPayTabTitle = styled.Text`
    
    ${(props)=>{return props?.isOn?`color:${colorWhite};`:`color:${colorBlack};`}}
    fontWeight:bold;
    fontSize:28px;
    textAlign:center;
    marginTop:auto;
    marginBottom:auto;
`

export const OrderPayBottomWrapper = styled.View`
    flexDirection:row;
`

export const OrderPayAmtWrapper = styled(ScrollView)`
    width:50%;
    marginBottom:15px;
`
export const OrderPayAmtRow = styled.View`
    paddingTop:7px;
    paddingBottom:7px;
    paddingLeft:10px;
    paddingRight:45px;
    flexDirection:row;
`
export const OrderPayTitle = styled.Text`
    fontSize:24px;
    fontWeight:bold;
    color:${colorBlack};
    flex:1;
`
export const OrderPayAmtTitle = styled.Text`
    fontSize:24px;
    fontWeight:bold;
    color:${colorRed};
    flex:1;
    textAlign:right;
`
export const OrderPayCardWrapper = styled.View`
    flex:1;
    flexDirection:row;
`
export const OrderPayCardShape = styled.View`
    backgroundColor:${colorCardStart};
    paddingTop:6px;
    paddingBottom:8px;
    paddingRight:12px;
    paddingLeft:12px;
    marginRight:15px;
    borderRadius:${RADIUS};
`
export const OrderPayCardText = styled.Text`
    color:${colorWhite};
    fontSize:23px;
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
`
export const OrderPayCardScollWrapper = styled.View`
    flexDirection:row;
    flex:1;
`
export const CancleBtn = styled.View`
    backgroundColor:${colorGrey};
    paddingTop:4px;
    paddingBottom:4px;
    marginTop:12px;
    borderRadius:40px;
`
export const CancelText = styled.Text`
    color:${colorBlack};
    fontSize:22px;
    fontWeight:bold;
    width:100%;
    textAlign:center;
`
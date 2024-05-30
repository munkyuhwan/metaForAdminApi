import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorRed, colorWhite, colorYellow, mainTheme } from '../../assets/colors/color';
import { RADIUS, RADIUS_SMALL } from '../values';
import FastImage from 'react-native-fast-image';

export const DetailWrapper=styled.View`
    width:100%;
    height:100%;
    paddingRight:0px;
    paddingBottom:0px;
    paddingLeft:0px;
    backgroundColor:#00000000;
`
export const DetailWhiteWrapper = styled.View`
    width:100%;
    height:100%;
    borderRadius:${RADIUS};
    backgroundColor:${colorWhite};
    paddingTop:20px;
    paddingBottom:20px;
    paddingRight:20px;
    paddingLeft:20px;
    elevation: 100;
`

export const DetailInfoWrapper = styled.View`
    width:100%;
    height:135px;
    flexDirection:row;
    backgroundColor:transparent;
`
// 상단 
export const DetailItemInfoWrapper = styled.View`
    flexDirection:column;
    height:250px;
    paddingLeft:19px;
    paddingTop:0px;
    flex:1;
`
export const DetailItemInfoImageWrapper = styled.ImageBackground`
    width:360px;
    height:220px;
    borderRadius:${RADIUS};
    backgroundColor:black;
`
export const DetailItemInfoImage = styled.Image`
    width:360px;
    height:250px;
    resizeMode:contain;
`

export const DetailItemInfoFastImage = styled(FastImage)`
    width:360px;
    height:220px;
    resizeMode:cover;
    borderRadius:${RADIUS};
`
export const DetailItemInfoTitleWrapper = styled.View`
    flexDirection:row;
`
export const DetailItemInfoTitle = styled.Text`
    fontSize:38px;
    fontWeight:bold;
    marginRight:11px;
    color:${colorBlack}
`
export const DetailItemInfoTitleEtc = styled.Image`
    width:54px;
    height:42px;
    marginRight:7px;
    resizeMode:contain;
    
`
export const DetailItemInfoSource = styled.Text`
    fontSize:32px;
    color:${colorRed};
    
`
export const DetailPriceMoreWrapper = styled.View`
    flexDirection:column;
    flex:1;
`
export const DetailItemInfoPriceWrapper = styled.View`
    flexDirection:row;
    flex:1;
`
export const DetailItemInfoPrice = styled.Text`
    fontSize:50px;
    color:${colorRed};
    ${(props)=>props.isBold?"fontWeight:bold;":""}
    marginTop:auto;
    marginBottom:auto;
`
export const DetailItemInfoMore = styled.Text`
    fontSize:22px;
    color:${colorBlack};
    flex:1;
`

// 옵션 & 추천메뉴
export const OptRecommendWrapper = styled.View`
    flex:1;
    flexDirection:column;
`
export const OptListWrapper = styled.View`
    flexDirection:column;
`
export const OptTitleText = styled.Text`
    fontSize:28px;   
    color:${colorBlack};
    fontWeight:bold;
    paddingTop:5px;
    paddingBottom:4px;
`
export const OptList = styled.ScrollView`
    width:100%;
    height:145px;
`
// 옵션선택 아이템
export const OptItemWrapper= styled.View`
    width:170px;
    height:100px;
    borderRadius:${RADIUS_SMALL};
    marginRight:9px;
`
export const OptItemImage = styled.Image`
    width:100%;
    height:100%;
    borderRadius:${RADIUS_SMALL};
`
export const OptItemFastImage = styled(FastImage)`
    width:100%;
    height:100%;
    borderRadius:${RADIUS_SMALL};
    backgroundColor:${colorBlack};
`
export const OptItemInfoWrapper = styled.View`
    width:100%;
    height:100%;
    position:absolute;
    flexDirection:column;
    paddingTop:10px;
    paddingRight:12px;
    paddingBottop:10px;
    paddingLeft:12px;
`
export const OptItemInfoTitle = styled.Text`
    fontSize:28px;
    color:${colorWhite};
    fontWeight:bold;
`
export const OptItemInfoPrice = styled.Text`
    fontSize:27px;
    color:${colorYellow};
    fontWeight:bold;
    position:absolute;
    bottom:2px;
    left:12px;
`
export const OptItemInfoChecked = styled.Image`
    width:22px;
    height:22px;
    resizeMode:contain;
    position:absolute;
    right:8px;
    bottom:8px;
    display:${(props)=>{return(props.isSelected==true?"flex":"none")} };
`
export const OptItemDim = styled.View`
    position:absolute;
    width:100%;
    height:100%;
    borderRadius:${RADIUS_SMALL};
    backgroundColor:rgba(0,0,0, ${(props)=>{return props?.isSelected==true?'0.7':'0.2' }});
`
// 추천선택 아이템
export const RecommendItemWrapper= styled.View`

`
export const RecommendItemImageWrapper = styled.View`
    width:170px;
    height:110px;
    borderRadius:${RADIUS_SMALL};
    marginRight:9px;
`
export const RecommendItemImage = styled.Image`
    width:100%;
    height:100%;
    borderRadius:${RADIUS_SMALL};
`
export const RecommendItemInfoWrapper = styled.View`
    width:100%;
    flexDirection:column;
    paddingTop:10px;
    paddingRight:12px;
    justifyContents:center;
`
export const RecommendItemInfoTitle = styled.Text`
    fontSize:20px;
    color:${colorBlack};
    fontWeight:bold;
    textAlign:center;
`
export const RecommendItemInfoPrice = styled.Text`
    fontSize:18px;
    color:${colorRed};
    textAlign:center;
`
export const RecommendItemInfoChecked = styled.Image`
    width:18px;
    height:18px;
    resizeMode:contain;
    position:absolute;
    right:8px;
    bottom:8px;
    display:${(props)=>{props.isSelected==true?"flex":"none"} };
`
export const RecommendItemDim = styled.View`
    position:absolute;
    width:100%;
    height:100%;
    borderRadius:${RADIUS_SMALL};
    backgroundColor:rgba(0,0,0,${(props)=>{return props?.isSelected==true?'0.7':'0.2' }});
`
// 하단 버튼
export const BottomButtonWrapper = styled.View`
    flexDirection:row;
    justifyContent:center;
`
export const BottomButton = styled.View`
    width:210px;
    height:59px;
    backgroundColor:${(props)=>props.backgroundColor};
    flexDirection:row;
    justifyContent:center;
    paddingLeft:18px;
    paddingRight:18px;
    marginLeft:8px;
    marginRight:8px;
    borderRadius:${RADIUS};
`
export const BottomButtonText = styled.Text`
    fontSize:27px;
    color:${colorWhite};
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
    flex:1;
`
export const BottomButtonIcon = styled.Image`
    width:24px;
    height:24px;
    resizeMode:contain;
    marginTop:auto;
    marginBottom:auto;
`



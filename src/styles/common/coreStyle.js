import styled, {css} from 'styled-components/native';
import { colorBlack, colorRed, colorWhite } from '../../assets/colors/color';
import { RADIUS_SMALL } from '../values';

// 상단 타이틀
export const PopupTitleWrapper = styled.View`
    paddingTop:20px;
`
export const PopupTitleText = styled.Text`
    textAlign:center;
    fontSize:24px;
    fontWeight:bold;
    color:${colorBlack};
`
export const PopupSubtitleText = styled.Text`
    textAlign:center;
    fontSize:14px;
    color:${colorBlack};
`

// 팝업 버튼
export const PopupBottomButtonWrapper = styled.View`
    width:401px;
    paddingRight:7px;
    bottom:20px;
    display:${(props=>{props.isVisible==true?"flex":"none"})}
`
export const PopupBottomButtonBlack = styled.View`
    backgroundColor:${colorBlack};
    paddingTop:7px;
    paddingBottom:7px;
    paddingLeft:10px;
    paddingRight:10px;
    alignSelf:center;
    borderRadius:${RADIUS_SMALL};
`
export const PopupBottomButtonRed = styled.View`
    backgroundColor:${colorRed};
    paddingTop:7px;
    paddingBottom:7px;
    paddingLeft:10px;
    paddingRight:10px;
    alignSelf:center;
    borderRadius:${RADIUS_SMALL};
`
export const PopupBottomButtonText = styled.Text`
    color:${colorWhite};
    textAlign:center;
    alignSelf:center;
    fontSize:20px;
`

import { styled } from "styled-components/native";
import { colorBlack, colorWhite } from "../../assets/colors/color";
import { ActivityIndicator } from "react-native";
import { RADIUS } from "../values";


export const PopupIndicatorWrapper = styled.View`
    backgroundColor:'rgba(2,2,2,0.7)';
    top:0;
    position:absolute;
    width:100%; 
    height:100%;
    zIndex:9999999;
    justifyContents:center;
    alignItems:center;
    flex:1;
`
export const PopupIndicatorTransparentWrapper = styled.View`
    backgroundColor:#00000000;
    top:0;
    position:absolute;
    width:100%; 
    height:100%;
    zIndex:9999999;
    justifyContents:center;
    alignItems:center;
    flex:1;
`
export const IndicatorWrapper = styled.View`
    width:400px;
    backgroundColor:${colorWhite};
    flexDirection:row;
    marginTop:auto;
    marginBottom:auto;
    alignItems:center;
    paddingTop:17px;
    paddingBottom:17px;
    borderRadius:${RADIUS};
    paddingLeft:15px;
    paddingRight:15px;
`
export const PopupSpinner = styled(ActivityIndicator)`

`
export const PopupIndicatorText = styled.Text`
    fontSize:20px;
    color:${colorBlack};
    marginLeft:15px;
`
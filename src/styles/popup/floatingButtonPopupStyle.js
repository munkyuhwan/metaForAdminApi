import { styled } from "styled-components";
import { colorRed, colorWhite, colorYellow } from "../../assets/colors/color";

export const FloatingBackgroundWrapper = styled.View`
    width:${props=>props?.size}px;
    height:${props=>props?.size}px;
    backgroundColor:rgba(255,255,255, 0.2);
    position:absolute; 
    zIndex:9999999;
    right:20;
    bottom:20;
    borderRadius:100px;
    justifyContent:center;
    alignItems:center;
`

export const FloatingBackgroundInnerdWrapper = styled.View`
    width:${props=>props?.size}px;
    height:${props=>props?.size}px;
    backgroundColor:rgba(255,255,255, 0.2);
    position:absolute; 
    zIndex:9999999;
    borderRadius:100px;
    justifyContent:center;
    alignItems:center;
`

export const FloatingWrapper = styled.View`
    position:absolute;
    width:120px;
    height:120px;
    padding:5px;
    backgroundColor:${colorYellow};
    justifyContent:center;
    zIndex:99999999;
    borderRadius:100px;
`
export const FloatingImg = styled.Image`

`
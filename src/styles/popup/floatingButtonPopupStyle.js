import { styled } from "styled-components";
import { colorRed, colorWhite, colorYellow } from "../../assets/colors/color";

export const FloatingWrapper = styled.View`
    position:absolute;
    width:100px;
    height:100px;
    padding:5px;
    backgroundColor:${colorYellow};
    right:20px;
    bottom:50px;
    zIndex:99999999;
    borderRadius:100px;
`
export const FloatingImg = styled.Image`

`
import { styled } from "styled-components";
import { colorBlack, colorRed, colorWhite } from "../../assets/colors/color";
import { RADIUS_DOUBLE } from "../values";

export const QuickOrderWrapper = styled.View`
    flex:1;
    width:100%;
    height:50%;
    backgroundColor:${colorWhite};
    position:absolute;
    bottom:0;
    zIndex:99;
    padding:10px;
`
/// 빠른 주문 

export const QuickMenuItemWrapper = styled.View`
    flex:1;
    width:100%;    
    backgroundColor:${colorBlack};
    marginLeft:20px;
    borderRadius:${RADIUS_DOUBLE}px;
    flexDirection:column;
`

export const QuickMenuItemBottomWRapper = styled.View`
    width:170px; 
    height:100px;
    flexDirection:column;  
    paddingTop:2px;
    alignItems:center;
`

export const QuickMenuItemName = styled.Text`
    fontSize:20px;
    color:${colorWhite};
    fontWeight:900;
    height:50px;
    textAlignVertical:center;
`
export const QuickMenuItemPrice = styled.Text`
    fontSize:20px;
    color:${colorWhite};
    fontWeight:900;
    height:50px;
    textAlignVertical:center;
`
export const QuickTopMenuWrapper = styled.View`
    flexDirection:row;
    height: 80px;
    display: flex;
    justifyContent: flex-start;
    zIndex:99;
    position:absolute;
    bottom:50%;
`
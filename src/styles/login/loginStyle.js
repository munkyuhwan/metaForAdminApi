import { styled } from "styled-components";
import { colorBlack, colorRed, colorWhite, tabBaseColor } from "../../assets/colors/color";
import { RADIUS } from "../values";
import { KeyboardAvoidingView } from "react-native";

export const LoginMainWrapper = styled(KeyboardAvoidingView)`
    width:100%;
    height:100%;
    backgroundColor:${colorBlack};
    flex:1;
    flexDirection:colmun;
    alignItems:center;
`
export const LoginLogo = styled.Image`
    width:204px;
    height:71px;
    resizeMode:contain;
    marginTop:auto;
`
// 로그인 필드
export const LoginActionWrapper = styled.View`
    width:332px;
    height:343px;
    backgroundColor:${tabBaseColor};
    marginBottom:auto;
    marginTop:10px;
    borderRadius:${RADIUS};
    textAlign:center;
    flexDirection:colmun;
    alignItems:center;
`
export const LoginActionTitle = styled.Text`
    fontSize:27px;
    color:${colorWhite};
    marginTop:auto;
    fontWeight:bold;
`
export const LoginActionSubtitle = styled.Text`
    fontSize:16px;
    color:${colorWhite};
`
export const LoginActionInputID = styled.TextInput`
    width:80%;
    heigth:53px;
    backgroundColor:${colorWhite};
    borderRadius:${RADIUS};
    marginTop:20px;
`
export const LoginActionInputPW = styled.TextInput`
    width:80%;
    heigth:53px;
    backgroundColor:${colorWhite};
    borderRadius:${RADIUS};
    marginTop:10px;

`
// 로그인 버튼;
export const LoginBtnWrapper = styled.View`
    width:80%;
    height:53px;
    marginTop:30px;
    marginBottom:auto;
    backgroundColor:${colorRed};
    flexDirection:row;
    borderRadius:${RADIUS};
`
export const LoginBtnText = styled.Text`
    color:${colorWhite};
    fontSize:19px;
    marginTop:auto;
    marginBottom:auto;
    marginLeft:auto;
`
export const LoginBtnIcon = styled.Image`
    width:19px;
    height:19px;
    resizeMode:contain;
    marginLeft:10px;
    marginTop:auto;
    marginBottom:auto;
    marginRight:auto;
    
`





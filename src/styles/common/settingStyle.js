import styled, {css} from 'styled-components/native';
import { colorBlack, colorDarkGrey, colorGrey, colorWhite, colorYellow } from '../../assets/colors/color';
import { RADIUS, RADIUS_SMALL } from '../values';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';

export const SettingWrapper = styled.View`
    paddingLeft:30px;
    paddingRight:30px;
    paddingTop:20px;
    paddingBottom:20px;
    backgroundColor:${colorWhite};
    width:100%;
`
export const SettingButtonWrapper = styled.View`
    flexDirection:column;
    marginTop:15px;
`
export const SettingButtonText = styled.Text`
    backgroundColor:${colorDarkGrey};
    color:${colorWhite};
    fontSize:21px;
    marginTop:${props=>props.isMargin ? '10px':'0px'};
    paddingTop:7px;
    paddingBottom:7px;
    textAlign:center;
    fontWeight:bold;
    borderRadius:${RADIUS};
`
export const SettingItemWrapper = styled.View`
    borderRadius:${RADIUS};
    border:solid;
    borderWidth:1px;
    marginTop:10px;
`

export const SettingScrollView = styled(ScrollView)`
    height:90%;
`

export const DetailSettingWrapper = styled.View`
    width:100%;
    backgroundColor:${colorGrey};
    borderRadius:${RADIUS};
    marginTop:5px;
    padding:10px;
`
export const TableColumnWrapper = styled.View`
    flexDirection:row;
    paddingTop:5px;
`
export const TableColumnTitle = styled.Text`
    fontSize:20px;
    color:${colorBlack};
    fontWeight:bold;
    marginTop:auto;
    marginBottom:auto;
`
export const TableColumnInput = styled.TextInput`
    width:100px;
    height:30px;
    backgroundColor:${colorWhite};
    marginLeft:10px;
    fontSize:15px;
    padding:0px;
    marginTop:auto;
    marginBottom:auto;
`
export const SettingConfirmBtnWrapper = styled.View`
    backgroundColor:${colorYellow};
    marginTop:10px;
    borderRadius:${RADIUS};
    padding:5px;
    alignItems:center;
`
export const SettingConfirmBtn = styled(TouchableWithoutFeedback)`
`
export const SettingConfirmBtnText = styled.Text`
    fontSize:20px;
    fontWeight:bold;
    color:${colorBlack};
`

export const SelectWrapper = styled.View`
    flexDirection:row;
    paddingTop:10px;
`
export const SelectWrapperColumn = styled.View`
    flexDirection:column;
    paddingTop:10px;
`
export const SelectCancelText = styled.Text`
    fontSize:17px;
    fontWeight:bold;
    color:${colorBlack};
    marginTop:auto;
    marginBottom:auto;
    padding:0;
`
export const SelectCancelWrapper = styled.View`
    backgroundColor:${colorGrey};
    border:solid;
    borderWidth:1px;
    borderRadius:${RADIUS_SMALL};
    justifyContents:center;
    paddingTop:5px;
    paddingBottom:5px;
    paddingRight:7px;
    paddingLeft:7px;
    height:38px;
    flex:0.3;
    alignItems:center;
`
export const PaymentTextWrapper = styled.View`
    paddingTop:5px;
    paddingBottom:5px;
    paddingRight:7px;
    paddingLeft:7px;
    flexDirection:row;
`
export const PaymentTextLabel = styled.Text`
    color:${colorBlack};
    fontSize:15px;
    flex:0.4;
`
export const StoreIDTextLabel = styled.Text`
    color:${colorBlack};
    fontSize:15px;
    marginRight:10px
`
export const PaymentTextInput = styled.TextInput`
    flex:1;
    backgroundColor:${colorWhite};
    borderWidth:1px;
    height:20px;
    padding:0;
`

export const StoreIDTextInput = styled.TextInput`
    backgroundColor:${colorWhite};
    borderWidth:1px;
    height:40px;
    fontSize:30px;
    width:240px;
    padding:0;
    marginRight:20px;
`

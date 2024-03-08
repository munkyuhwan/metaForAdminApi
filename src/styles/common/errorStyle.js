import styled, {css} from 'styled-components/native';
import { colorBlack, colorWhite } from '../../assets/colors/color';
import { RADIUS } from '../values';


export const ErrorWrapper = styled.View`
    width:415px;
    height:230px;
    paddingRight:17px;
    flexDirection:column;
`

export const ErrorTitle = styled.Text`
    fontSize:30px;
    color: ${colorBlack};
    textAlign:center;
    paddingTop:18px;
    paddingBottom:18px;
    marginTop:auto;
    marginBottom:auto;
    flexDirection:row;

`
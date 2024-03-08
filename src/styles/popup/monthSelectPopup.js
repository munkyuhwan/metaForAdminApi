import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorWhite } from '../../assets/colors/color';
import { Picker } from '@react-native-picker/picker';
import { RADIUS, RADIUS_SMALL } from '../values';


export const MonthSelectWrapper = styled.View`
    position:absolute;
    width:100%;
    height:100%;
    flex:1;
    backgroundColor:#00000000;    
`
export const MonthSelectTransparentBackground = styled.View`
    position:absolute;
    width:100%;
    height:100%;
    flex:1;
    backgroundColor:rgba(0,0,0,0.7);
`
export const MonthSelectPickerWrapper = styled.View`
    paddingTop:30px;
    paddingRight:20px;
    paddingLeft:20px;
    paddingBottom:30px;
    backgroundColor:${colorWhite};
    width:28%;
    height:45%;
    margin:auto;    
    justifyContents:center;
    alignItems:center;
    borderRadius:${RADIUS};
`
export const MonthSelectPickerItem = styled(Picker.Item)`
`

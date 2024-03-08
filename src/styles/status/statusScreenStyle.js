import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorWhite } from '../../assets/colors/color';

export const StatusWrapper = styled.View`
    width:100%;
    height:100%;
    background:${colorBlack};
    flex:1;
    textAlign:center;
    alignItems:center;
    justifyContents:center;
`
export const StatusText = styled.Text`
    color:${colorWhite};
    fontSize:240px;
    margin:auto;
`
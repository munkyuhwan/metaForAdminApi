import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS } from '../values';
import { mainTheme } from '../../assets/colors/color';

// 전체화면
export const WholeWrapper = styled.View`
    width:100%;
    height:100%;
    flexDirection:row;
    backgroundColor:${mainTheme};
`

// 메뉴화면
export const MainWrapper = styled.View`
    width:100%;
    height:100%;
    backgroundColor:${mainTheme};
    display:flex;
    flex:1;
`
import React, { useState } from 'react'
import { 
    Image,
    StyleSheet,
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Dimensions 
} from 'react-native'
import { HeaderLogo, HeaderWrapper } from '../../styles/header/header'

const Header = () =>{
    return(
        <>
        <HeaderWrapper>
            <HeaderLogo source={require("../../assets/icons/logo.png")} />

        </HeaderWrapper>
        </>
    )
}

export default Header
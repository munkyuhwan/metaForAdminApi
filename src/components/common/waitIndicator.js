
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const WaitIndicator = () =>{
    return(
        <View style={indicatorStyle.indicatorWrapper} >
            <ActivityIndicator size={'large'}/>
        </View>
    )
}
const indicatorStyle = StyleSheet.create({
    indicatorWrapper:{
        backgroundColor:'rgba(0,0,0,0.2)',
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        left:0,
        justifyContent:'space-around'
    }
})
export default WaitIndicator;
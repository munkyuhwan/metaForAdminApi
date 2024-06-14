import React, { useCallback, useEffect, useRef, useState } from 'react'
import {View, NativeModules, DeviceEventEmitter, KeyboardAvoidingView} from 'react-native'
import SideMenu from '../components/main/sideMenu'
import TopMenu from '../components/main/topMenu'
import { MainWrapper, WholeWrapper } from '../styles/main/mainStyle'
import CartView from '../components/main/cartView'
import { SCREEN_TIMEOUT } from '../resources/numberValues'
import MenuListView from '../components/main/menuListView'
import ItemDetail from '../components/detailComponents/itemDetail'
import PopUp from '../components/common/popup'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import LogWriter from '../utils/logWriter'
import { openPopup } from '../utils/common'
import { setLanguage } from '../store/languages'
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import {isEmpty} from 'lodash';
import { getAD, setAdScreen } from '../store/ad'
import { regularUpdate } from '../store/menu'
let timeoutSet = null;

const MainScreen = () =>{   
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {menuDetailID} = useSelector((state)=>state.menuDetail);
    const {isShow, adList} = useSelector((state)=>state.ads);

    useEffect(()=>{
        dispatch(setLanguage("korean"));  
    },[])

    function screenTimeOut(){
        clearInterval(timeoutSet);
        timeoutSet=null;
        timeoutSet = setInterval(()=>{
            dispatch(regularUpdate());
            dispatch(setAdScreen({isShow:true,isMain:true}))
        },SCREEN_TIMEOUT)
    } 

    useEffect(()=>{
          
        if(isShow) {
            clearInterval(timeoutSet);
            timeoutSet=null;
        }else {
            screenTimeOut();
        } 
          
    },[isShow])
    return(
        <>
            <KeyboardAvoidingView behavior="padding" enabled style={{width:'100%', height:'100%'}} >
                <WholeWrapper onTouchStart={()=>{     screenTimeOut();     }} >
                    <SideMenu/>
                    <MainWrapper>
                        <TopMenu/>
                        <MenuListView/>
                        <CartView/>
                    </MainWrapper>
                </WholeWrapper> 
            </KeyboardAvoidingView>
            {menuDetailID!=null &&
                <ItemDetail onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            }
        </>
    )
}

export default MainScreen
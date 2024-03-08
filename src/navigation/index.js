import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MainScreen from '../screens/MainScreen'
import Header from '../components/common/headerComponent'
import PopUp from '../components/common/popup'
import TransparentPopUp from '../components/common/transparentPopup'
import LoginScreen from '../screens/LoginScreen'
import ADScreen from '../screens/ADScreen'
import WaitIndicator from '../components/common/waitIndicator'
import { DeviceEventEmitter, PermissionsAndroid, Text, View } from 'react-native'
import PopupIndicator from '../components/common/popupIndicator'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminCategories, getAdminCategoryData, getMainCategories, getSubCategories, setSelectedSubCategory } from '../store/categories'
import FullSizePopup from '../components/common/fullsizePopup'
import ErrorPopup from '../components/common/errorPopup'
import { getAdminItems, getAllItems, getDisplayMenu, getMenuState, initMenu, setSelectedItems } from '../store/menu'
import _ from 'lodash';
import { getTableList, getTableStatus, initTableInfo } from '../store/tableInfo'
import { EventRegister } from 'react-native-event-listeners'
import {isEmpty} from 'lodash';
import StatusScreen from '../screens/StatusScreen'
import { initOrderList } from '../store/order'
import { DEFAULT_CATEGORY_ALL_CODE, DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import { getAdminBulletin, getAdminMenuItems } from '../store/menuExtra'
import { getStoreInfo } from '../utils/api/metaApis'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fileDownloader, openTransperentPopup } from '../utils/common'
import { getDisplay } from 'react-native-device-info'
import { getAD } from '../store/ad'
import ADScreenPopup from '../components/popups/adPopup'
import MonthSelectPopup from '../components/popups/monthSelectPopup'
import PopupIndicatorNonCancel from '../components/common/popupIndicatoreNonCancel'
import { getCategories, getGoodsByStoreID } from '../utils/api/newApi'

const Stack = createStackNavigator()

export default function Navigation() {
    var statusInterval;
    const dispatch = useDispatch();
    const [spinnerText, setSpinnerText] = React.useState("")
    const [spinnerTextNonCancel, setSpinnerTextNonCancel] = React.useState("")

    const {tableStatus} = useSelector(state=>state.tableInfo);
    const {allItems} = useSelector(state=>state.menu);
    const {selectedMainCategory, selectedSubCategory} = useSelector(state=>state.categories);
    const {isShow} = useSelector(state=>state.ads);
    const {isMonthSelectShow} = useSelector(state=>state.monthSelect);

    const navigate = useRef();
    const handleEventListener = () => {
        //리스너 중복방지를 위해 한번 삭제
        DeviceEventEmitter.removeAllListeners("onPending");
        DeviceEventEmitter.removeAllListeners("onComplete");
        EventRegister.removeAllListeners("showSpinner");
        EventRegister.removeAllListeners("showSpinnerNonCancel");

        // 결제진행중 팝업
        DeviceEventEmitter.addListener("onPending",(ev)=>{
            const pendingEvent = JSON.parse(ev.event)
            setSpinnerText(pendingEvent?.description)
        })
        DeviceEventEmitter.addListener("onComplete",(ev)=>{
            setSpinnerText("")
        })
        EventRegister.addEventListener("showSpinner",(data)=>{            
            if(data?.isSpinnerShow) { 
                setSpinnerText(data?.msg)
            }else {
                setSpinnerText("");
            }
        })
        EventRegister.addEventListener("showSpinnerNonCancel",(data)=>{            
            if(data?.isSpinnerShowNonCancel) { 
                setSpinnerTextNonCancel(data?.msg)
            }else {
                setSpinnerTextNonCancel("");
            }
        })
    }

    useEffect(()=>{
        dispatch(getAdminCategories());
        dispatch(getAdminItems())
    },[])
    useEffect(()=>{
        dispatch(setSelectedItems());
    },[selectedMainCategory, selectedSubCategory])

    return (
        <>  
            <NavigationContainer
                ref={navigate}
            >
                <Stack.Navigator
                    initialRouteName='main'
                    screenOptions={{
                        gestureEnabled: true,
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name='main'
                        component={MainScreen}
                        options={{title:"Main Screen"}}
                    />
                    <Stack.Screen
                        name='login'
                        component={LoginScreen}
                        options={{title:"Login screen"}}
                    />
                    <Stack.Screen
                        name='ad'
                        component={ADScreen}
                        options={{title:"AD screen"}}
                    />
                    <Stack.Screen
                        name='status'
                        component={StatusScreen}
                        options={{title:"Status Screen"}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <PopUp/>
            <TransparentPopUp/>
            <FullSizePopup/>
            {isShow &&
                <ADScreenPopup/>
            }
            {(spinnerText!="")&&
                <PopupIndicator text={spinnerText} setText={setSpinnerText} />
            }
            {(spinnerTextNonCancel!="")&&
                <PopupIndicatorNonCancel text={spinnerTextNonCancel} />
            }
            {isMonthSelectShow &&
                <MonthSelectPopup/>
            }
        </>
    )
}

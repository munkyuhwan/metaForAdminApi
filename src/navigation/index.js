import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MainScreen from '../screens/MainScreen'
import PopUp from '../components/common/popup'
import TransparentPopUp from '../components/common/transparentPopup'
import LoginScreen from '../screens/LoginScreen'
import ADScreen from '../screens/ADScreen'
import { DeviceEventEmitter } from 'react-native'
import PopupIndicator from '../components/common/popupIndicator'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminCategories, setSelectedMainCategory, setSubCategories } from '../store/categories'
import FullSizePopup from '../components/common/fullsizePopup'
import { getAdminItems, menuUpdateCheck, regularUpdate, setSelectedItems } from '../store/menu'
import _ from 'lodash';
import {  getStoreInfo, getTableStatus } from '../store/tableInfo'
import { EventRegister } from 'react-native-event-listeners'
import {isEmpty} from 'lodash';
import StatusScreen from '../screens/StatusScreen'
import { initOrderList } from '../store/order'
import {  DEFAULT_FIVE_MIN_STATUS_UPDATE_TIME, DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import {  getDeviceInfo, openPopup } from '../utils/common'
import { getAD } from '../store/ad'
import ADScreenPopup from '../components/popups/adPopup'
import MonthSelectPopup from '../components/popups/monthSelectPopup'
import PopupIndicatorNonCancel from '../components/common/popupIndicatoreNonCancel'
import { setErrorData } from '../store/error'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAdminBulletin } from '../store/menuExtra'
import messaging from '@react-native-firebase/messaging';
import { displayErrorPopup } from '../utils/errorHandler/metaErrorHandler'

const Stack = createStackNavigator()
var statusInterval;

function requestUserPermission() {
    console.log("requestUserPermission");
    messaging().requestPermission()
    .then(result=>{
        console.log("permission result: ",result);
      /*   messaging().getToken()
        .then((result)=>{
            console.log("result: ");
            console.log("messaging().getToken: ",result);
        })
        .catch((err)=>{
            console.log("err: ",err)
        }) */

    })
    .catch((err)=>{
        console.log("err: ",err);
    })
    
}
  


export default function Navigation() {
    const dispatch = useDispatch();

    const [spinnerText, setSpinnerText] = React.useState("")
    const [spinnerTextNonCancel, setSpinnerTextNonCancel] = React.useState("")

    const {tableStatus,cardDeviceInfo,orderHistory,posIP} = useSelector(state=>state.tableInfo);
    const {allItems,isMenuLoading, menuError} = useSelector(state=>state.menu);
    const {selectedMainCategory, selectedSubCategory, allCategories} = useSelector(state=>state.categories);
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
    // loading useeffect
    useEffect(()=>{
        if(isMenuLoading) {
            EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"메뉴를 로딩 중 입니다."})
        }else {
            EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        }
    },isMenuLoading)
    // error useeffect
    useEffect(()=>{
        if(menuError.IS_ERROR == true) {
            dispatch(setErrorData({errorCode:"XXXX",errorMsg:menuError?.ERROR_MSG})); 
            openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
        }
    },[menuError])


    useEffect(()=>{
        //if(!isEmpty(tableInfo)) { 
            // 주석 나중에 빼자
            /* statusInterval = setInterval(() => {
                //console.log("status interval")
                
                //dispatch(getStoreInfo());
                //dispatch(getTableStatus());
                //dispatch(menuUpdateCheck());
                dispatch(regularUpdate());
            }, DEFAULT_TABLE_STATUS_UPDATE_TIME); */
            
            dispatch(regularUpdate());
            dispatch(getAdminBulletin());
            messaging().onMessage((result)=>{
                console.log("on message: ",result);
                displayErrorPopup(dispatch, "XXXX", "푸시수신~");

                dispatch(regularUpdate());
            })
            //}
    },[])

    useEffect(async ()=>{
        handleEventListener();
        // 카테고리 받기
        await dispatch(getAdminCategories());
        // 메뉴 받아오기
        await dispatch(getAdminItems());
        // 기기 정보 받기
        getDeviceInfo();
        // 광고 받기
        dispatch(getAD()); 
        requestUserPermission();
    },[])
    useEffect(()=>{
        // 카테고리 선택에 따라 아이템 변경
        dispatch(setSelectedItems());
        // 카테고리 선택에 따른 서브 카테고리 변경
        dispatch(setSubCategories());
    },[selectedMainCategory, selectedSubCategory])
    useEffect(()=>{
        if(allItems?.length > 0) {
            dispatch(setSelectedMainCategory(allCategories[0]?.cate_code1));
        }
    },[allItems])
    // 테이블 상태
    useEffect(()=>{
        if(!isEmpty(tableStatus)) {
            const statusValue = tableStatus?.status;
            switch (statusValue) {
                case "1":
                    // 판매중

                break;
                case "2":
                    // 준비중
                    dispatch(initOrderList());
                    navigate?.current.navigate("status");
                break;
                case "3":
                    // 강제 판매중
                    //dispatch(initOrderList());
                    //navigate?.current.navigate("status");
                break;
                case "4":
                    // 예약중
                    dispatch(initOrderList());
                    navigate?.current.navigate("status");
                break;
                default:

                break;
            }
        }
        if(!isEmpty(cardDeviceInfo)) {
            const bsnNo = cardDeviceInfo?.business_no;
            const tidNo = cardDeviceInfo?.terminal_id;
            const serialNo = cardDeviceInfo?.serial_no;
            AsyncStorage.setItem("BSN_NO", bsnNo);   
            AsyncStorage.setItem("TID_NO", tidNo);   
            AsyncStorage.setItem("SERIAL_NO", serialNo);   
        }
        if(!isEmpty(orderHistory)) {
      
        }
        if(!isEmpty(posIP)) {
            AsyncStorage.setItem("POS_IP", posIP);   

        }
            
    },[tableStatus,cardDeviceInfo,orderHistory,posIP])

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
            <TransparentPopUp/>
            <FullSizePopup/>
            <PopUp/>
            {isShow &&
                <ADScreenPopup/>
            }
            {(spinnerTextNonCancel!="")&&
                <PopupIndicatorNonCancel text={spinnerTextNonCancel} />
            }
            {isMonthSelectShow &&
                <MonthSelectPopup/>
            }
            {(spinnerText!="")&&
                <PopupIndicator text={spinnerText} setText={setSpinnerText} />
            }
        </>
    )
}

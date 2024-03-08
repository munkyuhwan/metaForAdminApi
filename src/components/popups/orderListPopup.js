import React, { useState, useEffect } from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { OrderListWrapper, OrderListPopupWrapper, OrderListTopSubtitle, OrderListTopTitle, OrdrListTopWrapper, OrderListTableWrapper, OrderListTableColumnNameWrapper, OrderListTableColumnName, OrderListTableList, OrderListTalbleGrandTotal, OrderListTalbleGrandTotalWrapper, OrderListTotalTitle, OrderListTotalAmount } from '../../styles/popup/orderListPopupStyle';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from '../../styles/main/detailStyle';
import { colorBlack, colorRed } from '../../assets/colors/color';
import { numberWithCommas, openTransperentPopup } from '../../utils/common';
import OrderListItem from '../orderListComponents/orderListItem';
import { clearOrderStatus, getOrderStatus } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTableOrder } from '../../utils/apis';
import {isEmpty} from 'lodash';
let to = null;
const OrderListPopup = () =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {orderStatus} = useSelector(state=>state.order);    
    const [orderTotalAmt, setOrderTotalAmt] = useState(0);
    const {param} = useSelector(state=>state.popup);
    useEffect(()=>{
        dispatch(getOrderStatus());
    },[])
    useEffect(()=>{
        const timeOut = param?.timeOut;
        clearInterval(to);
        to=null;
        if(timeOut){
            to = setInterval(() => {
                clearInterval(to);
                to=null;
                openTransperentPopup(dispatch,{innerView:"", isPopupVisible:false});
            }, 10000);
        }
    },[param])

 
    useEffect(()=>{
        if(isEmpty(orderStatus)) {
            setOrderTotalAmt(0);
        }
        if(orderStatus){
            let tmpPrice = 0;
            orderStatus.map(el=>{
                tmpPrice += Number(el.ITEM_AMT);
                for(var i=0;i<el.SETITEM_INFO.length; i++) {
                    tmpPrice += Number(el.SETITEM_INFO[i].AMT)
                }
            })
            setOrderTotalAmt(tmpPrice);
        }
    },[orderStatus])

    return(
        <>
            <OrderListPopupWrapper>
                <OrdrListTopWrapper>
                    <OrderListTopTitle>{LANGUAGE[language]?.orderListPopup.orderListTitle}</OrderListTopTitle>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(getOrderStatus({}));}} >
                        <OrderListTopSubtitle>{LANGUAGE[language]?.orderListPopup.orderListSubtitle}</OrderListTopSubtitle>
                    </TouchableWithoutFeedback>

                </OrdrListTopWrapper>
                <OrderListWrapper>
                    <OrderListTableWrapper>
                        <OrderListTableColumnNameWrapper>
                            <OrderListTableColumnName flex={0.9} >{LANGUAGE[language]?.orderListPopup.tableColName}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.2} >{LANGUAGE[language]?.orderListPopup.tableColAmt}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.4} >{LANGUAGE[language]?.orderListPopup.tableColPrice}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.3} >{LANGUAGE[language]?.orderListPopup.tableColTotal}</OrderListTableColumnName>
                        </OrderListTableColumnNameWrapper>
                       {orderStatus &&
                            <OrderListTableList
                                data={orderStatus}
                                renderItem={(item)=>{return <OrderListItem order={item} />}}
                            />
                        }
                    </OrderListTableWrapper>
                    <OrderListTalbleGrandTotalWrapper>
                        <OrderListTotalTitle>{LANGUAGE[language]?.orderListPopup.tableColGrandTotal}</OrderListTotalTitle>
                        <OrderListTotalAmount>{numberWithCommas(orderTotalAmt)}{LANGUAGE[language]?.orderListPopup.totalAmtUnit}</OrderListTotalAmount>
                    </OrderListTalbleGrandTotalWrapper>
                </OrderListWrapper>
                <BottomButtonWrapper>
                    {/*!isPrepay &&
                       <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListPay}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/card.png")} />
                        </BottomButton>
                    */}
                    <TouchableWithoutFeedback onPress={()=>{clearInterval(to);to=null; /* dispatch(clearOrderStatus()); */ openTransperentPopup(dispatch, {innerView:"", isPopupVisible:false}); }} >
                        <BottomButton backgroundColor={colorBlack} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListOK}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>
            </OrderListPopupWrapper>
        </>
    )
}

export default OrderListPopup;
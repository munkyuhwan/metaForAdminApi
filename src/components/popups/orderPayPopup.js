import React, { useState, useEffect } from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { OrderListWrapper, OrderListPopupWrapper, OrderListTopSubtitle, OrderListTopTitle, OrdrListTopWrapper, OrderListTableWrapper, OrderListTableColumnNameWrapper, OrderListTableColumnName, OrderListTableList, OrderListTalbleGrandTotal, OrderListTalbleGrandTotalWrapper, OrderListTotalTitle, OrderListTotalAmount, OrderPayPopupWrapper, OrderPayTab, OrderPayTabTitle, OrderPayTabWrapper, OrderPayAmtWrapper, OrderPayTitle, OrderPayAmtRow, OrderPayAmtTitle, OrderPayBottomWrapper } from '../../styles/popup/orderListPopupStyle';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from '../../styles/main/detailStyle';
import { colorBlack, colorGrey, colorRed } from '../../assets/colors/color';
import { numberWithCommas, openFullSizePopup, openTransperentPopup } from '../../utils/common';
import OrderListItem from '../orderListComponents/orderListItem';
import { clearOrderStatus, getOrderStatus } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTableOrder } from '../../utils/apis';
import {isEmpty} from 'lodash';
import OrderPayItem from '../orderListComponents/orderPayItem';
import CheckBox from 'react-native-check-box';
import { KocesAppPay } from '../../utils/payment/kocesPay';

const OrderPayPopup = () =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const [orderTotalAmt, setOrderTotalAmt] = useState(0);
    const {allItems} = useSelector((state)=>state.menu);

    const {orderList} = useSelector((state)=>state.order);
    const [isDivided, setDivided] = useState(false);
    const [checkedItemList, setCheckedItemList] = useState([]);
    const [checkOutAmt, setCheckAmt] = useState(0);
    const [checkOutVatAmt, setCheckVatAmt] = useState(0);
    const [paidList, setPaidList] = useState([]);

    if(isEmpty(orderList)) {
        //return(<></>)
    }
        
    useEffect(()=>{
        var totalPrice = 0;
        if(orderList.length  > 0) {
            for(var j=0;j<orderList.length;j++) {
                const itemInfo = allItems.filter(el=>el.prod_cd == orderList[j].prod_cd);
                if(itemInfo.length>0) {
                    var itemPrice = Number(itemInfo[0].account);
                    var itemQty = Number(orderList[j].qty);
                    totalPrice = totalPrice + (itemPrice*itemQty);
                    const setItem = orderList[j].set_item;
                    var setPrice = 0;
                    // 세트메뉴 계산
                    for(var i=0;i<setItem.length;i++) {
                        const setItemInfo = allItems.filter(el=>el.prod_cd == setItem[i].optItem);
                        if(setItemInfo.length > 0) {
                            setPrice = setPrice + (Number(setItemInfo[0].account)*Number(setItem[i].qty));
                        }
                    }
                    totalPrice = totalPrice + setPrice;
                }
            }
            setOrderTotalAmt(totalPrice);
        }
    },[orderList])
    useEffect(()=>{
        if(checkedItemList.length>0) {
            var selectedAmt = 0;
            var selectedVat = 0;
            checkedItemList.map((el)=>{
                const itemInfo = allItems.filter(item=>item.prod_cd == el);
                const orderInfo = orderList.filter(ol=>ol.prod_cd == el);

                if(itemInfo.length>0) {
                    //console.log("itemInfo[0]: ",itemInfo[0]);
                    var salAmt = Number(itemInfo[0].sal_amt);
                    var salVat = Number(itemInfo[0].sal_vat);
                    var itemQty = Number(orderInfo[0].qty);

                    selectedAmt = selectedAmt + (salAmt*itemQty);
                    selectedVat = selectedVat + (salVat*itemQty);

                    const setItem = orderInfo[0].set_item;
                    var setAmt = 0;
                    var setVat = 0;
                    // 세트메뉴 계산
                    for(var i=0;i<setItem.length;i++) {
                        const setItemInfo = allItems.filter(el=>el.prod_cd == setItem[i].optItem);
                        if(setItemInfo.length > 0) {
                            const setSalAmt = Number(setItemInfo[0].sal_amt);
                            const setSalVat = Number(setItemInfo[0].sal_vat);

                            setAmt = setAmt + (setSalAmt*Number(setItem[i].qty));
                            setVat = setVat + (setSalVat*Number(setItem[i].qty));
                        }
                    }
                    selectedAmt = selectedAmt + setAmt;
                    selectedVat = selectedVat + setVat;
                } 
            });
            setCheckAmt(selectedAmt); 
            setCheckVatAmt(selectedVat); 
        }else {
            setCheckAmt(0);
            setCheckVatAmt(0); 
        }

    },[checkedItemList])
    const onTap = (setType) =>{
        setDivided(setType);
        setCheckedItemList([]);
    }
    const onItemCheck = async (prodCD) => {
        const itemCheck = checkedItemList.indexOf(prodCD);
        var itemListToChange = Object.assign([],checkedItemList);
        if(itemCheck>=0) {
            itemListToChange.splice(itemCheck,1);
        }else {
            itemListToChange.push(prodCD);
        }
        setCheckedItemList(itemListToChange);
    }
    const checkAll = () => {
        if(checkedItemList.length<orderList.length) {
            var checkItemList = [];
            orderList.map(el=>{
                checkItemList.push(el.prod_cd);
            })
            setCheckedItemList(checkItemList);
        }else {
            setCheckedItemList([]);
        }
    }
    const doPay = async () =>{
        const bsnNo = await AsyncStorage.getItem("BSN_NO");
        const tidNo = await AsyncStorage.getItem("TID_NO");
        const serialNo = await AsyncStorage.getItem("SERIAL_NO");
        if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
            displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
            return;
        }

        const amtData = {amt:checkOutAmt, taxAmt:checkOutVatAmt, months:"00", bsnNo:bsnNo,termID:tidNo }
        var kocessAppPay = new KocesAppPay();
        kocessAppPay.requestKocesPayment(amtData)
        .then(async (result)=>{ 
            
            console.log("result: ",result);
            const newPaidList = Object.assign([],paidList,result);
            setPaidList(newPaidList);
            
        })
        .catch((err)=>{
            console.log("error: ",err)
            
        })
    }
    return(
        <>
            <OrderPayPopupWrapper>
                
                <OrdrListTopWrapper>
                    <OrderListTopTitle>{LANGUAGE[language]?.orderListPopup.orderListTitle}</OrderListTopTitle>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(getOrderStatus({}));}} >
                        <OrderListTopSubtitle>{LANGUAGE[language]?.orderListPopup.orderListSubtitle}</OrderListTopSubtitle>
                    </TouchableWithoutFeedback>
                    <OrderPayTabWrapper>
                        <TouchableWithoutFeedback onPress={()=>{onTap(true)}} >
                            <OrderPayTab isOn={isDivided} >
                                <OrderPayTabTitle isOn={isDivided} >1/N 결제</OrderPayTabTitle>
                            </OrderPayTab>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{onTap(false)}} >
                            <OrderPayTab  isOn={!isDivided}>
                                <OrderPayTabTitle  isOn={!isDivided}>상품별 결제</OrderPayTabTitle>
                            </OrderPayTab>
                        </TouchableWithoutFeedback>
                    </OrderPayTabWrapper>
                </OrdrListTopWrapper>
                <OrderListWrapper>
                    <OrderListTableWrapper>
                        <OrderListTableColumnNameWrapper>
                            {!isDivided &&
                                <OrderListTableColumnName flex={0.07} >
                                    <CheckBox
                                        isChecked={checkedItemList?.length == orderList?.length}
                                        disabled={false}
                                        style={{marginTop:'auto',marginBottom:'auto'}}
                                        onClick={()=>{ checkAll(); }}
                                        checkBoxColor={colorRed}
                                    />
                                </OrderListTableColumnName>
                            }
                            {isDivided &&
                                <OrderListTableColumnName flex={0.07} >
                                    <CheckBox
                                        disabled={true}
                                        style={{marginTop:'auto',marginBottom:'auto'}}
                                        onClick={()=>{}}
                                        checkBoxColor={colorGrey}
                                    />
                                </OrderListTableColumnName>
                            }
                            <OrderListTableColumnName flex={0.9} >{LANGUAGE[language]?.orderListPopup.tableColName}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.2} >{LANGUAGE[language]?.orderListPopup.tableColAmt}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.4} >{LANGUAGE[language]?.orderListPopup.tableColPrice}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.3} >{LANGUAGE[language]?.orderListPopup.tableColTotal}</OrderListTableColumnName>
                        </OrderListTableColumnNameWrapper>
                            <OrderListTableList
                                data={orderList}
                                renderItem={(item)=>{return <OrderPayItem checkedItemList={checkedItemList} onCheck={(prodCD)=>{ onItemCheck(prodCD)}} isDivided={isDivided} order={item} />}}
                            />
                        
                    </OrderListTableWrapper>
                    <OrderListTalbleGrandTotalWrapper>
                        <OrderListTotalTitle>{LANGUAGE[language]?.orderListPopup.tableColGrandTotal}</OrderListTotalTitle>
                        <OrderListTotalAmount>{numberWithCommas(orderTotalAmt)}{LANGUAGE[language]?.orderListPopup.totalAmtUnit}</OrderListTotalAmount>
                    </OrderListTalbleGrandTotalWrapper>
                </OrderListWrapper>

                <OrderPayBottomWrapper>
                    <OrderPayAmtWrapper>
                        {paidList.length> 0 &&
                            paidList.map((el)=>{
                                return(
                                    <OrderPayTitle>{el}</OrderPayTitle>
                                )
                            })

                        }
                    </OrderPayAmtWrapper>
                    <OrderPayAmtWrapper>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtToPay}</OrderPayTitle>
                            <OrderPayAmtTitle>{`${numberWithCommas(checkOutAmt+checkOutVatAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtTitle}</OrderPayTitle>
                            <OrderPayAmtTitle>{LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payRestAmtTitle}</OrderPayTitle>
                            <OrderPayAmtTitle>{LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                    </OrderPayAmtWrapper>
                </OrderPayBottomWrapper>
                
                <BottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ openFullSizePopup(dispatch, {innerFullView:"", isPopupVisible:false}); }} >
                        <BottomButton backgroundColor={colorBlack} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListCancel}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{ console.log("결제하기"); doPay();}} >
                        <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListPay}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/order.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>
            </OrderPayPopupWrapper>
        </>
    )
}

export default OrderPayPopup;
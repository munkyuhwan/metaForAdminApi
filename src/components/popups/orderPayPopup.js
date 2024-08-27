import React, { useState, useEffect, useRef } from 'react'
import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { OrderListWrapper, OrderListPopupWrapper, OrderListTopSubtitle, OrderListTopTitle, OrdrListTopWrapper, OrderListTableWrapper, OrderListTableColumnNameWrapper, OrderListTableColumnName, OrderListTableList, OrderListTalbleGrandTotal, OrderListTalbleGrandTotalWrapper, OrderListTotalTitle, OrderListTotalAmount, OrderPayPopupWrapper, OrderPayTab, OrderPayTabTitle, OrderPayTabWrapper, OrderPayAmtWrapper, OrderPayTitle, OrderPayAmtRow, OrderPayAmtTitle, OrderPayBottomWrapper, OrderPayCardScollWrapper, DutchPayHalfWrapper, DutchPayFullWrapper } from '../../styles/popup/orderListPopupStyle';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from '../../styles/main/detailStyle';
import { colorBlack, colorBrown, colorGrey, colorRed } from '../../assets/colors/color';
import { numberWithCommas, openFullSizePopup, openTransperentPopup } from '../../utils/common';
import OrderListItem from '../orderListComponents/orderListItem';
import { clearOrderStatus, getOrderStatus, initDutchPayOrder, setDutchOrderList, setDutchOrderToPayList } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTableOrder } from '../../utils/apis';
import {isEmpty, isEqual} from 'lodash';
import OrderPayItem from '../orderListComponents/orderPayItem';
import CheckBox from 'react-native-check-box';
import { KocesAppPay } from '../../utils/payment/kocesPay';
import PaidDataItem from '../orderListComponents/paidDataItem';
import { CartFlatList, DutchPayBtn, PayBtn, PayTitle } from '../../styles/main/cartStyle';
import CartListItem from '../cartComponents/cartListItem';
import DutchPayListItem from '../cartComponents/dutchPayListItem';
import { RADIUS_DOUBLE } from '../../styles/values';
import DutchPaySelectedListItem from '../cartComponents/dutchPaySelectedListItem';

const OrderPayPopup = () =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const [orderTotalAmt, setOrderTotalAmt] = useState(0);
    const {allItems} = useSelector((state)=>state.menu);

    const orderedListRef = useRef();
    const selectedListRef = useRef();

    const {orderList, dutchOrderList, dutchOrderToPayList, dutchSelectedTotalAmt} = useSelector((state)=>state.order);
    const [isDivided, setDivided] = useState(false);
    // 체크된 아이템 리스트
    const [checkedItemList, setCheckedItemList] = useState([]);
    // 체크돤 아이템 금액(세금제외)
    const [checkOutAmt, setCheckAmt] = useState(0);
    // 체크된 아이템 부가세
    const [checkOutVatAmt, setCheckVatAmt] = useState(0);
    // 결제한 결제 데이터 리스트
    const [paidList, setPaidList] = useState([]);
    // 결제된 금액
    const [paidAmt, setPaidAmt] = useState(0);


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
        //주석해제 해야함
        //dispatch(setDutchOrderList(orderList))
    },[orderList])

    useEffect(()=>{
        if(checkedItemList.length>0) {
            var selectedAmt = 0;
            var selectedVat = 0;
            checkedItemList.map((el)=>{
                const itemInfo = allItems.filter(item=>item.prod_cd == el.prod_cd);
                const orderInfo = orderList.filter(ol=>ol.prod_cd == el.prod_cd);

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
    const onItemCheck = async (prodCD,idx) => {
        //const itemCheck = checkedItemList.indexOf({index:idx, prod_cd:prodCD});
        const itemCheck = checkedItemList.filter(el=>isEqual(el,{index:idx, prod_cd:prodCD}))
        var itemListToChange = Object.assign([],checkedItemList);
        if(itemCheck.length>0) {
            itemListToChange = itemListToChange.filter(el=>!isEqual(el,{index:idx, prod_cd:prodCD}));
        }else {
            itemListToChange.push({index:idx, prod_cd:prodCD});
        }
        //console.log("checked list: ",itemListToChange);
        setCheckedItemList(itemListToChange);
    }
    const checkAll = () => {
        if(checkedItemList.length<orderList.length) {
            var checkItemList = [];
            orderList.map((el, index)=>{
                checkItemList.push({index:index, prod_cd:el.prod_cd});
            })
            setCheckedItemList(checkItemList);
        }else {
            setCheckedItemList([]);
        }
    }
    const doPay = async () =>{
        if(checkedItemList?.length <= 0) {
            Alert.alert(
                "",
                "결제하실 메뉴를 선택 해 주세요.",
                [{
                    text:'확인',
                }]
                );
            return;
        }

        const bsnNo = await AsyncStorage.getItem("BSN_NO");
        const tidNo = await AsyncStorage.getItem("TID_NO");
        const serialNo = await AsyncStorage.getItem("SERIAL_NO");
        if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
            displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
            return;
        }
        /* 
        const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "24265610", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "94119400", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 0                       ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": checkOutVatAmt, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000003714185", "TrdAmt": checkOutAmt, "TrdDate": "240424165028", "TrdType": "A15"} 
        var tmpPayList = Object.assign([],paidList);
        const paidData = {paidItem:checkedItemList,paidData:result};
        tmpPayList.push(paidData);
        setPaidList(tmpPayList);
        setCheckedItemList([]);
        setCheckAmt(0);
        setCheckVatAmt(0);
        setPaidAmt(checkOutVatAmt+checkOutAmt+paidAmt);
          */
        
        const amtData = {amt:checkOutAmt, taxAmt:checkOutVatAmt, months:"00", bsnNo:bsnNo,termID:tidNo }
        var kocessAppPay = new KocesAppPay();
        kocessAppPay.requestKocesPayment(amtData)
        .then(async (result)=>{ 
            
            console.log("result: ",result);
            var tmpPayList = Object.assign([],paidList);
            const paidData = {paidItem:checkedItemList,paidData:result};
            tmpPayList.push(paidData);
            setPaidList(tmpPayList);
            setCheckedItemList([]);
            setCheckAmt(0);
            setCheckVatAmt(0);
            setPaidAmt(checkOutVatAmt+checkOutAmt+paidAmt);

            
            
        })
        .catch((err)=>{
            console.log("error: ",err)
            
        })
    }
    
    const cancelOrderPayList = (index) =>{
        var tmpPaidList = Object.assign([],paidList);
        var canceledList = tmpPaidList.splice(index,1);
        setPaidList(tmpPaidList);
        const trdAmt = Number(canceledList[0]?.paidData?.TrdAmt);
        const taxAmt = Number(canceledList[0]?.paidData?.TaxAmt);
        setPaidAmt(paidAmt-(trdAmt+taxAmt));
    }

    function scrollSelectedListToBottom() {
        setTimeout(() => {
            if(selectedListRef) {
                if(selectedListRef.current) {
                    selectedListRef.current.scrollToEnd({animated:true});
                }
            }    
        }, 1000);   
    }

    return(
        <>
            <OrderPayPopupWrapper>
                
                <OrdrListTopWrapper>
                    <OrderListTopTitle>{LANGUAGE[language]?.cartView.payDutch}</OrderListTopTitle>
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
                <DutchPayFullWrapper>
                    <DutchPayHalfWrapper>
                        <OrderPayTabTitle isOn={false} >주문내역</OrderPayTabTitle>
                        <CartFlatList
                            ref={orderedListRef}
                            style={{borderRadius:RADIUS_DOUBLE}}
                            showsVerticalScrollIndicator={false}
                            data={dutchOrderList}
                            renderItem={(item )=>{
                                return(
                                    <DutchPayListItem onPress={()=>{dispatch(setDutchOrderToPayList({orderIndex:item.index, isAdd:true}));scrollSelectedListToBottom(); /* dispatch(setDutchOrderToPayList({item:item.item, index:item.index})); */ }} {...item} />
                                )
                            }}
                        />
                    </DutchPayHalfWrapper>
                    <DutchPayHalfWrapper isBorder={true}>
                        <OrderPayTabTitle isOn={false} >선택내역</OrderPayTabTitle>
                        <CartFlatList
                            ref={selectedListRef}
                            style={{borderBottomWidth:2, borderBottomColor:colorRed}}
                            showsVerticalScrollIndicator={false}
                            data={dutchOrderToPayList}
                            renderItem={(item )=>{
                                return(
                                    <DutchPaySelectedListItem onPress={(type)=>{ dispatch(setDutchOrderToPayList({orderIndex:item.item.index,selectIndex:item.index, isAdd:type})); }} {...item} />
                                )
                            }}
                        />
                        <TouchableWithoutFeedback onPress={()=>{ }} >
                            <DutchPayBtn isFull={true} isGap={true}  color={colorRed} >    
                                <PayTitle>{`${numberWithCommas(dutchSelectedTotalAmt)}${LANGUAGE[language]?.orderPay?.payAmtUnit} `+LANGUAGE[language]?.cartView.payOrder}</PayTitle>
                            </DutchPayBtn>
                        </TouchableWithoutFeedback>
                    </DutchPayHalfWrapper>
                    <DutchPayHalfWrapper>
                        <OrderPayTabTitle isOn={false} >결제</OrderPayTabTitle>
                        <OrderPayAmtWrapper>
                            <OrderPayAmtRow>
                                <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtToPay}</OrderPayTitle>
                                <OrderPayAmtTitle>{`${numberWithCommas(checkOutAmt+checkOutVatAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                            </OrderPayAmtRow>
                            <OrderPayAmtRow>
                                <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtTitle}</OrderPayTitle>
                                <OrderPayAmtTitle>{`${numberWithCommas(paidAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                            </OrderPayAmtRow>
                            <OrderPayAmtRow>
                                <OrderPayTitle>{LANGUAGE[language]?.orderPay.payRestAmtTitle}</OrderPayTitle>
                                <OrderPayAmtTitle>{`${numberWithCommas(orderTotalAmt-paidAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                            </OrderPayAmtRow>
                        </OrderPayAmtWrapper> 
                        <OrderListTalbleGrandTotalWrapper>
                            <OrderListTotalTitle>{LANGUAGE[language]?.orderListPopup.tableColGrandTotal}</OrderListTotalTitle>
                            <OrderListTotalAmount>{numberWithCommas(orderTotalAmt)}{LANGUAGE[language]?.orderListPopup.totalAmtUnit}</OrderListTotalAmount>
                        </OrderListTalbleGrandTotalWrapper>
                        <BottomButtonWrapper>
                            {/* 
                            <TouchableWithoutFeedback onPress={()=>{ 
                                if(paidAmt>0) {
                                    if(orderTotalAmt-paidAmt>0){
                                        Alert.alert(
                                            "",
                                            "결제 취소 후 주문을 취소 해 주세요.",
                                            [{
                                                text:'확인',
                                            }]
                                            );
                                    }else {
                                        openFullSizePopup(dispatch, {innerFullView:"", isPopupVisible:false});
                                    } 
                                }else {
                                    openFullSizePopup(dispatch, {innerFullView:"", isPopupVisible:false});
                                }
                                }} >
                                <BottomButton backgroundColor={colorBlack} >
                                    <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListCancel}</BottomButtonText>
                                    <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                                </BottomButton>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{doPay();}} >
                                <BottomButton backgroundColor={colorRed} >
                                    <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListPay}</BottomButtonText>
                                    <BottomButtonIcon source={require("../../assets/icons/order.png")} />
                                </BottomButton>
                            </TouchableWithoutFeedback> 
                            */}
                            <TouchableWithoutFeedback onPress={()=>{dispatch(initDutchPayOrder());  openFullSizePopup(dispatch, {innerFullView:"", isFullPopupVisible:false});  }} >
                                 <PayBtn isFull={false} isGap={true}  color={ colorBlack}  >    
                                    <PayTitle>{LANGUAGE[language]?.popup.cancelTitle}</PayTitle>
                                </PayBtn>
                            </TouchableWithoutFeedback>
                            
                        </BottomButtonWrapper>
                    </DutchPayHalfWrapper>

                    {/* <OrderListTableWrapper>
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
                                renderItem={(item)=>{   
                                    var isPaid = false;
                                    for(var i=0;i<paidList.length;i++) {
                                        const paidItem = paidList[i].paidItem;
                                        const paidIndexList = paidItem.filter(paidEl=>paidEl.index == item.index);
                                        if(paidIndexList?.length > 0) {
                                            isPaid = true;
                                        }
                                    }    
                                    return <OrderPayItem isPaid={isPaid} checkedItemList={checkedItemList} onCheck={(prodCD)=>{ onItemCheck(prodCD,item.index)}} isDivided={isDivided} order={item} />
                                }}
                            />
                        
                    </OrderListTableWrapper> */}
                    {/*
                    <OrderListTalbleGrandTotalWrapper>
                         <OrderListTotalTitle>{LANGUAGE[language]?.orderListPopup.tableColGrandTotal}</OrderListTotalTitle>
                        <OrderListTotalAmount>{numberWithCommas(orderTotalAmt)}{LANGUAGE[language]?.orderListPopup.totalAmtUnit}</OrderListTotalAmount>
                     </OrderListTalbleGrandTotalWrapper>
                     */}
                </DutchPayFullWrapper>
                {/*
                <OrderPayBottomWrapper>
                     <OrderPayAmtWrapper horizontal={true} >
                        <OrderPayCardScollWrapper>
                            {paidList.length> 0 &&
                                paidList.map((el,index)=>{
                                    return(
                                        <>
                                            <PaidDataItem onCancel={()=>{cancelOrderPayList(index);}}  data={el} />
                                        </>
                                    )
                                })
                            }
                        </OrderPayCardScollWrapper>

                    </OrderPayAmtWrapper>
                    <OrderPayAmtWrapper>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtToPay}</OrderPayTitle>
                            <OrderPayAmtTitle>{`${numberWithCommas(checkOutAmt+checkOutVatAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payAmtTitle}</OrderPayTitle>
                            <OrderPayAmtTitle>{`${numberWithCommas(paidAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                        <OrderPayAmtRow>
                            <OrderPayTitle>{LANGUAGE[language]?.orderPay.payRestAmtTitle}</OrderPayTitle>
                            <OrderPayAmtTitle>{`${numberWithCommas(orderTotalAmt-paidAmt)}`+LANGUAGE[language]?.orderPay.payAmtUnit}</OrderPayAmtTitle>
                        </OrderPayAmtRow>
                    </OrderPayAmtWrapper> 
                </OrderPayBottomWrapper>
                */}
                {/* 
                <BottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ 
                        if(paidAmt>0) {
                            if(orderTotalAmt-paidAmt>0){
                                Alert.alert(
                                    "",
                                    "결제 취소 후 주문을 취소 해 주세요.",
                                    [{
                                        text:'확인',
                                    }]
                                    );
                            }else {
                                openFullSizePopup(dispatch, {innerFullView:"", isPopupVisible:false});
                            } 
                        }else {
                            openFullSizePopup(dispatch, {innerFullView:"", isPopupVisible:false});
                        }
                        }} >
                        <BottomButton backgroundColor={colorBlack} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListCancel}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{doPay();}} >
                        <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListPay}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/order.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>

                 */}
            </OrderPayPopupWrapper>
        </>
    )
}

export default OrderPayPopup;
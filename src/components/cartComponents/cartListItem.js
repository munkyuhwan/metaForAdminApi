import React, { useEffect, useState } from 'react'
import { 
    Animated,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { CartItemAmtController, CartItemAmtControllerImage, CartItemAmtControllerText, CartItemAmtText, CartItemAmtWrapper, CartItemCancelBtn, CartItemCancelWrapper, CartItemFastImage, CartItemImage, CartItemImageTogoWrapper, CartItemOpts, CartItemPrice, CartItemTitle, CartItemTitlePriceWrapper, CartItemTogoBtn, CartItemTogoIcon, CartItemTogoText, CartItemTogoWrapper, CartItemWrapper, OperandorText } from '../../styles/main/cartStyle';
import { setPopupContent, setPopupVisibility } from '../../store/popup';
import { useDispatch, useSelector } from 'react-redux';
import { numberWithCommas, openPopup } from '../../utils/common';
import { MENU_DATA } from '../../resources/menuData';
import { LANGUAGE } from '../../resources/strings';
import { addToOrderList, resetAmtOrderList, setOrderList } from '../../store/order';
import FastImage from 'react-native-fast-image';
import { META_SET_MENU_SEPARATE_CODE_LIST } from '../../resources/defaults';

const CartListItem = (props) => {
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {orderList} = useSelector(state=>state.order);
    const {images} = useSelector(state=>state.imageStorage);
    const {allItems} = useSelector(state=>state.menu);
    // 메뉴 옵션 추가 정보
    const filteredImg = images.filter(el=>el.name==props?.item?.prod_cd);
    const index = props?.index;
    const order = props?.item;
    const additiveItemList = order?.set_item;
    const itemDetail = allItems?.filter(el=>el.prod_cd == props?.item?.prod_cd);
    const prodGb = itemDetail[0]?.prod_gb; // 세트하부금액 구분용

    // 이미지 찾기
    const ItemTitle = () => {
        let selTitleLanguage = "";
        if(language=="korean") {
            selTitleLanguage = itemDetail[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selTitleLanguage = itemDetail[0]?.gname_jp||itemDetail[0].gname_kr;
        }
        else if(language=="chinese") {
            selTitleLanguage = itemDetail[0]?.gname_cn||itemDetail[0].gname_kr;
        }
        else if(language=="english") {
            selTitleLanguage = itemDetail[0]?.gname_en||itemDetail[0].gname_kr;
        }

        return selTitleLanguage;
    }

    const ItemOptionTitle = (additiveId,index) =>{
        let selOptTitleLanguage = "";
        const selExtra = allItems.filter(el=>el.prod_cd==additiveId);
        if(language=="korean") {
            selOptTitleLanguage = selExtra[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selOptTitleLanguage = selExtra[0]?.gname_jp||selExtra[0]?.gname_kr;
        }
        else if(language=="chinese") {
            selOptTitleLanguage = selExtra[0]?.gname_cn||selExtra[0]?.gname_kr;
        }
        else if(language=="english") {
            selOptTitleLanguage = selExtra[0]?.gname_en||selExtra[0]?.gname_kr;
        }
        return selOptTitleLanguage;
    }

    const calculateAmt = (operand, amt) =>{
        // plus, minus, cancel
        dispatch(resetAmtOrderList({operand,amt,index}))
    }
    function onTogoTouch() {
        if(order?.ITEM_GB == "T") {
            let tmpOrdList = Object.assign([],orderList);
            let ordToChange = Object.assign({},tmpOrdList[index]);
            ordToChange.ITEM_GB = "N";
            ordToChange.ITEM_MSG = "";
            tmpOrdList[index] = ordToChange;
            dispatch(setOrderList(tmpOrdList))
        }else {
            openPopup(dispatch,{innerView:"TogoPopup", isPopupVisible:true,param:{index:index}}); 
        }
        
    }
    //console.log("cart order item: ",order);

    const itemTotalPrice = () => {
        if(META_SET_MENU_SEPARATE_CODE_LIST.indexOf(prodGb)>=0) {
            // 선택하부금액 
            var itemTotal = Number(itemDetail[0]?.account);
            const setItem = order?.set_item;
            if(setItem.length>0) {
                var setItemPrice = 0;
                for(var i=0;i<setItem.length;i++) {
                    const setItemData = allItems?.filter(el=>el.prod_cd == setItem[i].optItem);
                    if(setItemData.length>0) {
                        setItemPrice = Number(setItemPrice)+(Number(setItemData[0]?.account)*Number(setItem[i]?.qty));
                    }
                }
                itemTotal = (Number(itemTotal)+Number(setItemPrice))*Number(order?.qty);
            }else {
                itemTotal = Number(itemDetail[0]?.account)*Number(order?.qty);
            }
            return itemTotal||0;
        }else {
            const itemTotal = Number(itemDetail[0]?.account)*Number(order?.qty);
            return itemTotal||0;
        }
    }

    return(
        <>
            <CartItemWrapper>
                <CartItemImageTogoWrapper>
                    <CartItemImage source={ {uri:filteredImg[0]?.imgData,priority: FastImage.priority.high } } />
                </CartItemImageTogoWrapper>
                
                <CartItemTitlePriceWrapper>
                    <CartItemTitle numberOfLines={1} ellipsizeMode="tail" >{ItemTitle()||itemDetail[0]?.gname_kr}</CartItemTitle>
                    <CartItemOpts numberOfLines={2} ellipsizeMode="tail" >
                        {
                            additiveItemList.length>0 &&
                            additiveItemList.map((el,index)=>{
                                return `${ItemOptionTitle(el.optItem,index)}`+`${Number(el.qty)*Number(order?.qty)}개`+`${index<(additiveItemList.length-1)?", ":""}`;
                            })
                        }
                    </CartItemOpts>
                    <CartItemPrice>{numberWithCommas(itemTotalPrice())}원</CartItemPrice>
                    <CartItemAmtWrapper>
                        <TouchableWithoutFeedback  onPress={()=>{ dispatch(addToOrderList({isAdd:false, isDelete: false, item:itemDetail[0],menuOptionSelected:order?.set_item})); }} >
                            <CartItemAmtController>
                               {/*  <CartItemAmtControllerImage source={require("../../assets/icons/minusIcon.png")}  /> */}
                               <OperandorText>-</OperandorText>
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                        <CartItemAmtText>{order?.qty}</CartItemAmtText>
                        <TouchableWithoutFeedback  onPress={()=>{ dispatch(addToOrderList({isAdd:true, isDelete: false, item:itemDetail[0],menuOptionSelected:order?.set_item})); }} >
                            <CartItemAmtController>
                                <OperandorText>+</OperandorText>
                                {/* <CartItemAmtControllerImage  source={require("../../assets/icons/plusIcon.png")} /> */}
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                    </CartItemAmtWrapper>
                </CartItemTitlePriceWrapper>
                <TouchableWithoutFeedback onPress={()=>{ dispatch(addToOrderList({isAdd:false, isDelete: true, item:itemDetail[0],menuOptionSelected:order?.set_item})); }}>
                    <CartItemCancelWrapper>
                        <CartItemCancelBtn source={require("../../assets/icons/close_grey.png")} />
                    </CartItemCancelWrapper>
                </TouchableWithoutFeedback>

            </CartItemWrapper>
        </>
    )
}

export default CartListItem;
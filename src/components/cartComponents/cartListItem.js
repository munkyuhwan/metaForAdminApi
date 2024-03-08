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
import { resetAmtOrderList, setOrderList } from '../../store/order';
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

    const index = props?.index;
    const order = props?.item;
    const additiveItemList = order?.SETITEM_INFO;
    const itemDetail = allItems?.filter(el=>el.PROD_CD == order?.ITEM_CD);
    const prodGb = itemDetail[0]?.PROD_GB; // 세트하부금액 구분용
    // 이미지 찾기
    const itemExtra = menuExtra.filter(el=>el.pos_code == order?.ITEM_CD);
    const ItemTitle = () => {
        let selTitleLanguage = "";
        const selExtra = itemExtra.filter(el=>el.pos_code==order?.ITEM_CD);
        if(language=="korean") {
            selTitleLanguage = order.ITEM_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.gname_jp||order.ITEM_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.gname_cn||order.ITEM_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.gname_en||order.ITEM_NM;
        }

        return selTitleLanguage;
    }

    const ItemOptionTitle = (additiveId,index) =>{
        let selOptTitleLanguage = "";
        const selExtra = menuExtra.filter(el=>el.pos_code==additiveId);
        if(language=="korean") {
            selOptTitleLanguage = additiveItemList[index]?.PROD_I_NM;
        }
        else if(language=="japanese") {
            selOptTitleLanguage = selExtra[0]?.op_name_jp||additiveItemList[index]?.PROD_I_NM;
        }
        else if(language=="chinese") {
            selOptTitleLanguage = selExtra[0]?.op_name_cn||additiveItemList[index]?.PROD_I_NM;
        }
        else if(language=="english") {
            selOptTitleLanguage = selExtra[0]?.op_name_en||additiveItemList[index]?.PROD_I_NM;
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
            
            let additivePrice = 0;
            for(var i=0;i<additiveItemList.length;i++) {
                //console.log("additive item: ",additiveItemList[i]);
                additivePrice = additivePrice+(additiveItemList[i]?.AMT)
                //additivePrice = additivePrice+additi
            }
            
            return Number(order?.ITEM_AMT)+Number(additivePrice);
        }else {
            return order?.ITEM_AMT||0;
        }
    }

    return(
        <>
            <CartItemWrapper>
                <CartItemImageTogoWrapper>
                    <CartItemImage source={ {uri:(`${images.filter(el=>el.name==order?.ITEM_CD)[0]?.imgData}`),priority: FastImage.priority.high } } />
                </CartItemImageTogoWrapper>
                
                <CartItemTitlePriceWrapper>
                    <CartItemTitle numberOfLines={1} ellipsizeMode="tail" >{ItemTitle()||order.ITEM_NM}</CartItemTitle>
                    <CartItemOpts numberOfLines={2} ellipsizeMode="tail" >
                        {additiveItemList.length>0 &&
                            additiveItemList.map((el,index)=>{
                                return `${ItemOptionTitle(el.PROD_I_CD,index)||el.PROD_I_NM}`+`${el.QTY}개`+`${index<(additiveItemList.length-1)?", ":""}`;
                            })
                        }
                    </CartItemOpts>
                    <CartItemPrice>{numberWithCommas(itemTotalPrice())}원</CartItemPrice>
                    <CartItemAmtWrapper>
                        <TouchableWithoutFeedback  onPress={()=>{calculateAmt("minus",1)}} >
                            <CartItemAmtController>
                               {/*  <CartItemAmtControllerImage source={require("../../assets/icons/minusIcon.png")}  /> */}
                               <OperandorText>-</OperandorText>
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                        <CartItemAmtText>{order?.ITEM_QTY}</CartItemAmtText>
                        <TouchableWithoutFeedback  onPress={()=>{calculateAmt("plus",1)}} >
                            <CartItemAmtController>
                                <OperandorText>+</OperandorText>
                                {/* <CartItemAmtControllerImage  source={require("../../assets/icons/plusIcon.png")} /> */}
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                    </CartItemAmtWrapper>
                </CartItemTitlePriceWrapper>
                <TouchableWithoutFeedback onPress={()=>{calculateAmt("cancel",0)}}>
                    <CartItemCancelWrapper>
                        <CartItemCancelBtn source={require("../../assets/icons/close_grey.png")} />
                    </CartItemCancelWrapper>
                </TouchableWithoutFeedback>

            </CartItemWrapper>
        </>
    )
}

export default CartListItem;
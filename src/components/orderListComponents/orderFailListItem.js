import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrderListTableItemAmt, OrderListTableItemImage, OrderListTableItemImageNameWrapper, OrderListTableItemName, OrderListTableItemOperander, OrderListTableItemPrice, OrderListTableItemTotal, OrderListTableItemWrapper } from '../../styles/popup/orderListPopupStyle';
import { numberWithCommas } from '../../utils/common';

const OrderListItem = (props) => {
    const item = props?.order.item;
    console.log("item:",item)
    const {language} = useSelector(state=>state.languages);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    // 이미지 찾기
    const itemExtra = menuExtra.filter(el=>el.pos_code == item.ITEM_CD);
    const imgUrl = "https:"+itemExtra[0]?.gimg_chg;
    const ItemTitle = () => {
        let selTitleLanguage = "";
        const selExtra = itemExtra.filter(el=>el.pos_code==item.ITEM_CD);
        if(language=="korean") {
            selTitleLanguage = item.ITEM_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.gname_jp||item.ITEM_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.gname_cn||item.ITEM_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.gname_en||item.ITEM_NM;
        }

        return selTitleLanguage;
    }

    const individualItem = () =>{
        let setItemPrice = 0;
        for(var i=0;i<item.SETITEM_INFO.length;i++) {
            setItemPrice += item.SETITEM_INFO[i].AMT
        }
        return setItemPrice+item?.ITEM_AMT;
    }
    return(
        <>
            <OrderListTableItemWrapper>
                <OrderListTableItemImageNameWrapper flex={0.85}>
                    <OrderListTableItemImage source={{uri:imgUrl}} />
                    <OrderListTableItemName>{ItemTitle()||item.ITEM_NM}</OrderListTableItemName>
                </OrderListTableItemImageNameWrapper>
                <OrderListTableItemAmt flex={0.1}>{item?.ITEM_QTY}</OrderListTableItemAmt>
                <OrderListTableItemOperander flex={0.03} >X</OrderListTableItemOperander>
                <OrderListTableItemPrice flex={0.25} >{numberWithCommas(individualItem()/item?.ITEM_QTY)}원</OrderListTableItemPrice>
                <OrderListTableItemOperander flex={0.03} >=</OrderListTableItemOperander>
                <OrderListTableItemTotal flex={0.25} >{numberWithCommas(individualItem())}원</OrderListTableItemTotal>
            </OrderListTableItemWrapper>
        </>
    )
}
export default OrderListItem;
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrderListOptionTitle, OrderListOptionWrapper, OrderListTableItemAmt, OrderListTableItemImage, OrderListTableItemImageNameWrapper, OrderListTableItemName, OrderListTableItemOperander, OrderListTableItemPrice, OrderListTableItemTotal, OrderListTableItemWrapper } from '../../styles/popup/orderListPopupStyle';
import { numberWithCommas } from '../../utils/common';
import FastImage from 'react-native-fast-image';

const OrderListItem = (props) => {
    const item = props?.order.item;
    const {language} = useSelector(state=>state.languages);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {allItems} = useSelector((state)=>state.menu);
    // 이미지 찾기
    const itemExtra = allItems.filter(el=>el.prod_cd == item.ITEM_CD);
    //const {images} = useSelector(state=>state.imageStorage);
    //const filteredImg = images.filter(el=>el.name==item.ITEM_CD);
   // const imgUrl = filteredImg[0]?.imgData
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
            setItemPrice += Number(item.SETITEM_INFO[i].AMT)
        }
        return Number(setItemPrice)+Number(item?.ITEM_AMT);
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
    return(
        <>
            <OrderListTableItemWrapper>
                <OrderListTableItemImageNameWrapper flex={0.85}>
                    {/* <OrderListTableItemImage source={{uri:imgUrl}} /> */}
                    <FastImage style={{width:94, height:65}} resizeMode={FastImage.resizeMode.contain} source={{uri:itemExtra[0]?.gimg_chg}} />
                    <OrderListOptionWrapper>
                        <OrderListTableItemName>{ItemTitle()||item.ITEM_NM}</OrderListTableItemName>
                        <OrderListOptionTitle>
                            {item?.SETITEM_INFO?.length>0 &&
                                item?.SETITEM_INFO?.map((el,index)=>{
                                return `- ${ItemOptionTitle(el.PROD_I_CD,index)}`+`${Number(el.QTY)}개`+`${index<(item?.SETITEM_INFO?.length-1)?", ":""}`;
                                })
                            }
                        </OrderListOptionTitle>
                    </OrderListOptionWrapper>
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
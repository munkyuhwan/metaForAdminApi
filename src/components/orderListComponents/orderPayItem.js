import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrderListOptionTitle, OrderListOptionWrapper, OrderListTableItemAmt, OrderListTableItemImage, OrderListTableItemImageNameWrapper, OrderListTableItemName, OrderListTableItemOperander, OrderListTableItemPrice, OrderListTableItemTotal, OrderListTableItemWrapper } from '../../styles/popup/orderListPopupStyle';
import { numberWithCommas } from '../../utils/common';
import CheckBox from 'react-native-check-box';
import { colorGrey, colorRed } from '../../assets/colors/color';

const OrderPayItem = (props) => {
    const item = props?.order.item;
    const isDivided = props?.isDivided;
    const checkedItemList = props?.checkedItemList;

    const {language} = useSelector(state=>state.languages);
    const {allItems} = useSelector((state)=>state.menu);
    // 이미지 찾기
    const itemExtra = allItems.filter(el=>el.prod_cd == item.prod_cd);
    const {images} = useSelector(state=>state.imageStorage);
    const filteredImg = images.filter(el=>el.name==item.prod_cd);
    const imgUrl = filteredImg[0]?.imgData
    const ItemTitle = () => {
        let selTitleLanguage = "";
        if(language=="korean") {
            selTitleLanguage = itemExtra[0].gname_kr;
        }
        else if(language=="japanese") {
            selTitleLanguage = itemExtra[0]?.gname_jp||itemExtra[0].gname_kr;
        }
        else if(language=="chinese") {
            selTitleLanguage = itemExtra[0]?.gname_cn||itemExtra[0].gname_kr;
        }
        else if(language=="english") {
            selTitleLanguage = itemExtra[0]?.gname_en||itemExtra[0].gname_kr;
        }

        return selTitleLanguage;
    }

    const individualItem = () =>{
        let setItemPrice = 0;
        const setItems = item.set_item;
        for(var i=0;i<setItems.length;i++) {
            const setItemInfo = allItems.filter(el=>el.prod_cd == setItems[i].optItem);
            if(setItemInfo.length > 0) {
                setItemPrice = setItemPrice + (Number(setItemInfo[0].account)*Number(setItems[i].qty));
            }
        }
        return Number(setItemPrice)+ (Number(itemExtra[0]?.account)*Number(item.qty));
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
                <OrderListTableItemImageNameWrapper flex={0.9}>
                    {!isDivided &&
                        <CheckBox
                            disabled={false}
                            isChecked={checkedItemList.indexOf(item?.prod_cd)>=0}
                            style={{ marginTop:'auto',marginBottom:'auto', marginLeft:7, marginRight:8}}
                            onClick={()=>{props?.onCheck(item?.prod_cd);}}
                            checkBoxColor={colorRed}
                        />
                    }
                    {isDivided &&
                        <CheckBox
                            disabled={true}
                            isChecked={checkedItemList.indexOf(item?.prod_cd)>=0}
                            style={{marginTop:'auto',marginBottom:'auto', marginLeft:7, marginRight:8}}
                            onClick={()=>{props?.onCheck(item?.prod_cd);}}
                            checkBoxColor={colorGrey}
                        />
                    }
                    <OrderListTableItemImage source={{uri:imgUrl}} />
                    <OrderListOptionWrapper>
                        <OrderListTableItemName>{ItemTitle()||itemExtra[0].gname_kr}</OrderListTableItemName>
                        <OrderListOptionTitle>
                            {item?.set_item?.length>0 &&
                                item?.set_item?.map((el,index)=>{
                                return `- ${ItemOptionTitle(el.optItem,index)}`+`${Number(el.qty)}개`+`${index<(item?.set_item?.length-1)?", ":""}`;
                                })
                            }
                        </OrderListOptionTitle>
                    </OrderListOptionWrapper>
                </OrderListTableItemImageNameWrapper>
                <OrderListTableItemAmt flex={0.2}>{item?.qty}</OrderListTableItemAmt>
                <OrderListTableItemOperander flex={0.03} >X</OrderListTableItemOperander>
                <OrderListTableItemPrice flex={0.25} >{numberWithCommas(individualItem()/item?.qty)}원</OrderListTableItemPrice>
                <OrderListTableItemOperander flex={0.03} >=</OrderListTableItemOperander>
                <OrderListTableItemTotal flex={0.25} >{numberWithCommas(individualItem())}원</OrderListTableItemTotal>
            </OrderListTableItemWrapper>
        </>
    )
}
export default OrderPayItem;
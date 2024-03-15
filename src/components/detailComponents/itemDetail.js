import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper, ButtonWrapper, DetailInfoWrapper, DetailItemInfoFastImage, DetailItemInfoImage, DetailItemInfoImageWrapper, DetailItemInfoMore, DetailItemInfoPrice, DetailItemInfoPriceWrapper, DetailItemInfoSource, DetailItemInfoTitle, DetailItemInfoTitleEtc, DetailItemInfoTitleWrapper, DetailItemInfoWrapper, DetailPriceMoreWrapper, DetailWhiteWrapper, DetailWrapper, OptList, OptListWrapper, OptRecommendWrapper, OptTitleText } from '../../styles/main/detailStyle';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { colorBlack, colorRed } from '../../assets/colors/color';
import { LANGUAGE } from '../../resources/strings';
import OptItem from './optItem';
import CommonIndicator from '../common/waitIndicator';
import WaitIndicator from '../common/waitIndicator';
import RecommendItem from './recommendItem';
import { initMenuDetail, getSingleMenuFromAllItems, getItemSetGroup, getSingleMenuForRecommend, getSetItems, setMenuOptionSelected } from '../../store/menuDetail';
import { numberWithCommas, openPopup } from '../../utils/common';
import { MENU_DATA } from '../../resources/menuData';
import { addToOrderList } from '../../store/order';
import { MenuImageDefault, MenuItemButtonInnerWrapperRight, MenuItemDetailSpicenessWrapper, MenuItemSpiciness } from '../../styles/main/menuListStyle';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE } from '../../styles/values';
import {isEmpty} from "lodash";
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
/* 메뉴 상세 */
const ItemDetail = (props) => {
    const language = props.language;
    const isDetailShow = props.isDetailShow;
    const dispatch = useDispatch();
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [detailZIndex, setDetailZIndex] = useState(0);
    const [menuDetail, setMenuDetail] = useState(null);


    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,30],
    });
    
    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedHeightTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    })

    const boxWidthStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        
    };
    const onSelectHandleAnimation = async (popOpen) => {
        Animated.timing(widthAnimation, {
            toValue:popOpen,
            duration: 150,
            useNativeDriver:true,
        }).start(()=>{             
            if(!isDetailShow) {
                setDetailZIndex(0)
            }
        }) 
    }
    
    useEffect(()=>{
        const filteredItem = allItems.filter(data => data.prod_cd == menuDetailID);
        if(filteredItem.length > 0) {
            setMenuDetail(filteredItem[0]);
        }
    },[menuDetailID])


    const onOptionSelect = (limitCnt, itemData) =>{        
        let setItem =  {
            "ITEM_SEQ" : 0,
            "SET_SEQ" : menuOptionSelected.length+1,
            "PROD_I_CD" : itemData?.prod_cd,
            "PROD_I_NM" : itemData?.gname_kr,
            "QTY" : 1,
            "AMT" : itemData?.sal_tot_amt,
            "VAT" : itemData?.sal_vat,
        }; 
        // 옵션 구룹의 수량 초과 하지 않도록 체크
        let tmpOptionSelected = Object.assign([],menuOptionSelected);
        const filteredOptList = menuDetail?.option;
        let itemCheckCnt = 0;
        if(filteredOptList?.length>0) {
            for(var i=0;i<tmpOptionSelected?.length;i++) {
                //console.log("tmpOptionSelected; ",tmpOptionSelected[i]);
                const checkItems = filteredOptList?.filter(el=>el.prod_i_cd == tmpOptionSelected[i]?.prod_i_cd);
                if(checkItems?.length > 0) {
                    itemCheckCnt = itemCheckCnt+1;
                }
            }
        }
        dispatch(setMenuOptionSelected({data:setItem,isAdd:limitCnt>itemCheckCnt||limitCnt==0, isAmt:false  }));
        
    }
    const addToCart = () => {
        dispatch(addToOrderList({item:menuDetail,menuOptionSelected:[]}));
        closeDetail();

        /*
        let booleanArr = true;
        for(var i=0;i<menuOptionList.length;i++) {
            let optItems = menuOptionList[i].OPT_ITEMS;
            if(menuOptionList[i].QTY == 0) {
                booleanArr = booleanArr && true;
            }else {
                let cnt = 0;
                for(var j=0;j<menuOptionSelected.length;j++) {
                    // 해당 중분류의 아이템이 몇개가 선택 되었는지 체크;
                    let filter = optItems.filter(el=>el.PROD_I_CD == menuOptionSelected[j].PROD_I_CD);
                    if(filter.length > 0) {
                        cnt = cnt+menuOptionSelected[j]?.QTY;
                    } 
                }
                //console.log(menuOptionList[i].GROUP_NM,menuOptionList[i].QTY," cnt: ",cnt)
                booleanArr = booleanArr && menuOptionList[i]?.QTY==cnt;
            }
        }
        //console.log("is pass: ",booleanArr);
        if(!booleanArr) {
            posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:`옵션 필수 수량을 확인 해 주세요.`,MSG2:""})
        }else { 
            dispatch(addToOrderList({item:menuDetail,menuOptionSelected:menuOptionSelected}));
            closeDetail();
        }
        */


    }

    const closeDetail = () =>{
        //props.setDetailShow(false); 
        //dispatch(setMenuDetail(null)); 
        init();
    }

    const init = () => {
        setMenuDetail(null)
        dispatch(initMenuDetail());
    }

    useEffect(()=>{
        if(isDetailShow) {
            setDetailZIndex(999)
            onSelectHandleAnimation(1);
            //dispatch(getItemSetGroup());
            /* 
            var tmpAdditiveList = [];ㄴ
            if(menuDetail?.ADDITIVE_GROUP_LIST) {
                tmpAdditiveList = menuDetail?.ADDITIVE_GROUP_LIST.filter(el=>el.ADDITIVE_GROUP_USE_FLAG=="N");
            }
            setAdditiveGroupList(tmpAdditiveList);
             */
        }
    },[isDetailShow])
//console.log("menu: ",menu[0].ITEM_LIST);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
            if(language=="korean") {
                selTitleLanguage = menuDetail?.gname_kr;
            }
            else if(language=="japanese") {
                selTitleLanguage = menuDetail?.gname_jp;
            }
            else if(language=="chinese") {
                selTitleLanguage = menuDetail?.gname_cn;
            }
            else if(language=="english") {
                selTitleLanguage = menuDetail?.gname_en;
            }
       
        return selTitleLanguage;
    }
    const ItemInfo = () =>{
        let selInfoLanguage = "";
        
            if(language=="korean") {
                selInfoLanguage = menuDetail?.gmemo;
            }
            else if(language=="japanese") {
                selInfoLanguage = menuDetail?.gmemo_jp||menuDetail?.gmemo;
            }
            else if(language=="chinese") {
                selInfoLanguage = menuDetail?.gmemo_cn||menuDetail?.gmemo;
            }
            else if(language=="english") {
                selInfoLanguage = menuDetail?.gmemo_en||menuDetail?.gmemo;
            }
       
        return selInfoLanguage;
    }
    const ItemWonsanji = () => {
        let selWonsanjiLanguage = "";
        
            if(language=="korean") {
                selWonsanjiLanguage = menuDetail?.wonsanji;
            }
            else if(language=="japanese") {
                selWonsanjiLanguage = menuDetail?.wonsanji_jp||menuDetail?.wonsanji;
            }
            else if(language=="chinese") {
                selWonsanjiLanguage = menuDetail?.wonsanji_cn||menuDetail?.wonsanji;
            }
            else if(language=="english") {
                selWonsanjiLanguage = menuDetail?.wonsanji_en||menuDetail?.wonsanji;
            }
       
        return selWonsanjiLanguage;
    }

    if(isEmpty(menuDetail)) {
        return(<></>)
    }

    return(
        <>
            <Animated.View  style={[{...PopStyle.animatedPop, ...boxWidthStyle,...{zIndex:detailZIndex} } ]} >
                    <DetailWrapper onTouchStart={()=>{ props?.onDetailTouchStart(); }}>
                        <DetailWhiteWrapper>
                            {menuDetailID==null &&
                                <WaitIndicator/>
                            }
                            {menuDetailID!=null &&
                            <>
                            {menuDetailID!=null &&
                                <DetailInfoWrapper>
                                    <DetailItemInfoImageWrapper>
                                        {menuDetail&& 
                                        menuDetail?.gimg_chg &&
                                            <DetailItemInfoFastImage source={ {uri:(`${menuDetail?.gimg_chg}`),priority: FastImage.priority.high } } />
                                        }
                                        {menuDetail&&
                                        !menuDetail?.gimg_chg &&
                                            <MenuImageDefault source={require("../../assets/icons/logo.png")} />
                                        }   
                                    </DetailItemInfoImageWrapper>
                                    <DetailItemInfoWrapper>
                                        <DetailItemInfoTitleWrapper>
                                            <DetailItemInfoTitle>{ItemTitle()||menuDetail?.gname_kr}</DetailItemInfoTitle>
                                            {menuDetail&&
                                                menuDetail?.is_new=='Y'&&
                                                 <DetailItemInfoTitleEtc source={require("../../assets/icons/new_menu.png")}/>
                                            }
                                            {menuDetail&&
                                        menuDetail?.is_best=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/best_menu.png")}/>
                                            }
                                            {menuDetail&&
                                        menuDetail?.is_on=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/hot_menu.png")}/>
                                            }
                                            {
                                                menuDetail?.spicy == "1" &&
                                                <MenuItemButtonInnerWrapperRight>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                                </MenuItemButtonInnerWrapperRight>
                                            }
                                            {
                                                menuDetail?.spicy == "1.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "2" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "2.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "3" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                        </DetailItemInfoTitleWrapper>
                                        <DetailItemInfoSource>{ItemWonsanji()}</DetailItemInfoSource>
                                        <DetailPriceMoreWrapper>
                                            <DetailItemInfoPriceWrapper>
                                                <DetailItemInfoPrice isBold={true} >{ menuDetail?.sal_tot_amt?numberWithCommas(menuDetail?.sal_tot_amt):""}</DetailItemInfoPrice><DetailItemInfoPrice isBold={false}> 원</DetailItemInfoPrice>
                                            </DetailItemInfoPriceWrapper>
                                            <DetailItemInfoMore>{ItemInfo()}</DetailItemInfoMore>
                                        </DetailPriceMoreWrapper>
                                    </DetailItemInfoWrapper>
                                </DetailInfoWrapper>
                            }
                            {menuDetailID!=null &&
                            <ScrollView style={{marginTop:83}} showsVerticalScrollIndicator={false} >

                                <OptRecommendWrapper>
                                    <OptListWrapper>
                                        {
                                        menuDetail?.option &&
                                        menuDetail?.option.map((el,index)=>{
                                            return (
                                                <>
                                                    <OptTitleText>{el.op_name} {el.limit_count>0?`(필수 수량 ${el.limit_count}개 선택)`:''}</OptTitleText>
                                                    <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                    {
                                                        el?.prod_i_cd &&
                                                        el?.prod_i_cd?.map((itemEl,index)=>{
                                                            return(
                                                                <OptItem key={"optItem_"+index} maxQty={el.limit_count} isSelected={menuOptionSelected.filter(menuEl=>menuEl.PROD_I_CD ==itemEl).length>0 } optionProdCD={itemEl} menuData={menuDetail} onPress={(itemSel)=>{ onOptionSelect(el?.limit_count, itemSel); } } />    
                                                            );
                                                            
                                                        })
                                                    }
                                                    </OptList> 
                                                </>
                                            )
                                        })
                                        }
                                        
                                    </OptListWrapper>
                                    {menuDetail&&
                                            menuDetail?.related &&
                                            menuDetail?.related.length > 0 &&
                                            menuDetail?.related[0]!="" &&
                                            <>
                                                <OptListWrapper>
                                                    <OptTitleText>{LANGUAGE[language]?.detailView.recommendMenu}</OptTitleText>
                                                    <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                        {
                                                            menuDetail?.related.map((el,index)=>{
                                                               /*  if(isEmpty(el)) {
                                                                    return (<></>)
                                                                }else { */
                                                                    return(
                                                                        <RecommendItem key={"recoItem_"+index}   recommendData={el} menuData={menuDetail}  />    
                                                                    );
                                                                //}
                                                            })
                                                        }
                                                    </OptList>
                                                </OptListWrapper>
                                            </>
                                        }
                                </OptRecommendWrapper>
                            </ScrollView>

                            }   
                            <BottomButtonWrapper>
                                <TouchableWithoutFeedback onPress={()=>{closeDetail(); }}>
                                    <BottomButton backgroundColor={colorRed} >
                                        <BottomButtonText>{LANGUAGE[language]?.detailView.toMenu}</BottomButtonText>
                                        <BottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                    </BottomButton>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{addToCart()}}>
                                    <BottomButton backgroundColor={colorBlack} >
                                        <BottomButtonText>{LANGUAGE[language]?.detailView.addToCart}</BottomButtonText>
                                        <BottomButtonIcon source={require("../../assets/icons/cart_select.png")} />
                                    </BottomButton>
                                </TouchableWithoutFeedback>

                            </BottomButtonWrapper>
                            </>
                            }
                        </DetailWhiteWrapper>
                    </DetailWrapper>
            </Animated.View>
        </>
    )  
}

const PopStyle = StyleSheet.create({
    animatedPop:{
        position:'absolute', 
        width:'100%',
        height:'100%',
        paddingTop:0,
        paddingLeft:0,
        left:-30,
        zIndex:99999,
     }

})

export default ItemDetail;
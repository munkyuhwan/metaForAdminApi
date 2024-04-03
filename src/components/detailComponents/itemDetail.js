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
    const {menuDetailID, menuOptionSelected} = useSelector((state)=>state.menuDetail);
    const [detailZIndex, setDetailZIndex] = useState(0);
    const [menuDetail, setMenuDetail] = useState(null);

    const [optSelected, setOptSelected] = useState([]);

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

    
    const onOptionSelect = ( isAdd, optGroup, optItem) =>{     
        // 선택한 옵션
        var selectedOpt = {optGroup:optGroup?.idx, optItem:optItem.prod_cd, qty:1};
        // 추가 전 옵션 리스트
        var currentOpt = Object.assign([],optSelected);

        // 기존 옵션이 있는지 체크
        const filterOpt = currentOpt.filter(el=>el.optGroup == optGroup?.idx&&el.optItem == optItem.prod_cd);
        // 선택된 옵션이랑 다른 옵션만 담기
        const expendedOpt = currentOpt.filter(el=>el.optGroup != optGroup?.idx||el.optItem != optItem.prod_cd);

        // 옵션 그룹의 선택 한도 수량 체크
        const groupOptCheck = currentOpt.filter(el=>el.optGroup == optGroup?.idx);
        // * 옵션 선택 가능 수량 체크
        const groupLimitCnt = optGroup?.limit_count;
        if(groupLimitCnt > 0) {
            // if count equals to 0 it's unlimited select count
            // check the current quantity
            var groupOptCnt = 0;
            for(var i=0;i<groupOptCheck.length;i++) {
                //console.log("groupOptCheck:",groupOptCheck[i]);
                groupOptCnt = groupOptCnt+groupOptCheck[i].qty
            }  
            if(isAdd) {
                //추가할 때만 수량 넘어가면 얼럿
                if(groupOptCnt >= groupLimitCnt) {
                    posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:`옵션 필수 수량을 확인 해 주세요.`,MSG2:""})        
                    return
                }
            }
        }
        if(filterOpt.length > 0) {
            // 추가된 옵션에 수량만 올리기
            if(isAdd) {
                // 추가 
                selectedOpt['qty'] = Number(filterOpt[0]['qty'])+1;
            }else {
                // 빼기
                selectedOpt['qty'] = Number(filterOpt[0]['qty'])-1;
            }
            if(selectedOpt['qty']>0) {
                expendedOpt.push(selectedOpt);
            }
            currentOpt = expendedOpt;

        }else {
            // 새로 추가 
            currentOpt.push(selectedOpt)
        }
        setOptSelected(currentOpt);
    }
    const addToCart = () => {
        //dispatch(addToOrderList({item:menuDetail,menuOptionSelected:[]}));
        //closeDetail();
        const optGroups = menuDetail?.option;
        //console.log("optGroups: ",optGroups);
        // 옵션 수량 체크
        var isPass = true;
        for(var i=0;i<optGroups.length;i++) {
            //console.log("limitCnt: ",optGroups[i].limit_count," idx: ",optGroups[i].idx);
            const optFil = optSelected.filter(el=>el.optGroup == optGroups[i].idx);
            //console.log("optFil: ",optFil)
            var groupQty = 0;
            if(optFil.length>0) {
                for(var j=0;j<optFil.length;j++) {
                    //console.log('qty: ',optFil[j]);
                    // 옵션 선택 수량 총 합
                    groupQty = groupQty + Number(optFil[j].qty);
                }
                // 수량 계산 합한게 리미트랑 비교
                var limitCnt = Number(optGroups[i].limit_count);
                if(limitCnt > 0) {
                    // 0은 무제한이라 체크 안함
                    if(limitCnt > groupQty) {
                        // 최소 수량보다 작으면 안지나감.
                        isPass = false;
                    }
                }
                console.log("group qty: ",groupQty);
            }
        }
        if(!isPass) {
            posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:`옵션 필수 수량을 확인 해 주세요.`,MSG2:""})
        }else {
            // 주문 하기
            
        }
        /* 
        for(var i=0;i<optSelected.length;i++) {
            const optGrp = optGroups.filter(el=>el.idx == optSelected[i].optGroup);
            if(optGrp.length > 0) {
                const limitCnt = optGrp[0].limit_count;
                console.log("limitCnt: ",limitCnt);


            }

        } */
        
        /* 
        let booleanArr = true;
        for(var i=0;i<menuOptionList.length;i++) {
            let optItems = menuOptionList[i].prod_i_cd;
            if(menuOptionList[i].limit_count == 0) {
                booleanArr = booleanArr && true;
            }else {
                let cnt = 0;
                for(var j=0;j<menuOptionSelected.length;j++) {
                    // 해당 중분류의 아이템이 몇개가 선택 되었는지 체크;
                    let filter = optItems.filter(el=>el == menuOptionSelected[j].PROD_I_CD);
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
                                                            const optSel = optSelected.filter(optEl=>optEl.optGroup==el.idx && optEl.optItem==itemEl);
                                                            return(
                                                                <OptItem key={"optItem_"+index} maxQty={el.limit_count} isSelected={optSel.length>0 } selectedCnt={optSel.length<=0?0:optSel[0].qty} optionProdCD={itemEl} menuData={menuDetail} onPress={(isAdd, itemSel)=>{ onOptionSelect(isAdd, el, itemSel); } } />    
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
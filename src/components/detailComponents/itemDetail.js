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
import { setMenuDetail, initMenuDetail, getSingleMenuFromAllItems, getItemSetGroup, getSingleMenuForRecommend, getSetItems, setMenuOptionSelected } from '../../store/menuDetail';
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
    const {menuDetailID, menuDetail, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [detailZIndex, setDetailZIndex] = useState(0);
    // 메뉴 추가정보 찾기
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const itemExtra = menuExtra?.filter(el=>el.pos_code == menuDetailID);
    const {images} = useSelector(state=>state.imageStorage);

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
    
    const onOptionSelect = (groupNo, itemData) =>{
        let setItem =  {
            "ITEM_SEQ" : 0,
            "SET_SEQ" : menuOptionSelected.length+1,
            "PROD_I_CD" : itemData?.PROD_CD,
            "PROD_I_NM" : itemData?.PROD_NM,
            "QTY" : 1,
            "AMT" : itemData?.SAL_AMT,
            "VAT" : itemData?.SAL_VAT,
        }; 
        // 옵션 구룹의 수량 초과 하지 않도록 체크
        let tmpOptionSelected = Object.assign([],menuOptionSelected);
        const filteredOptList = menuOptionList.filter(el=>el.GROUP_NO==groupNo);
        const optionGroupQty = filteredOptList[0]?.QTY;
        let itemCheckCnt = 0;
        if(filteredOptList?.length>0) {
            for(var i=0;i<tmpOptionSelected?.length;i++) {
                //console.log("tmpOptionSelected; ",tmpOptionSelected[i]);
                const checkItems = filteredOptList[0]?.OPT_ITEMS?.filter(el=>el.PROD_I_CD == tmpOptionSelected[i]?.PROD_I_CD);
                if(checkItems?.length > 0) {
                    itemCheckCnt = itemCheckCnt+1;
                }
            }
        }
        //GroupNO
        //console.log("setItem: ",setItem)
        dispatch(setMenuOptionSelected({data:setItem,isAdd:optionGroupQty>itemCheckCnt||optionGroupQty==0, isAmt:false  }));
    }
    const addToCart = () => {
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

    }

    const closeDetail = () =>{
        //props.setDetailShow(false); 
        dispatch(setMenuDetail(null)); 
        init();
    }

    const init = () => {
        dispatch(initMenuDetail());
    }

    useEffect(()=>{
        if(isDetailShow) {
            setDetailZIndex(999)
            onSelectHandleAnimation(1);
            //dispatch(getItemSetGroup());
            /* 
            var tmpAdditiveList = [];
            if(menuDetail?.ADDITIVE_GROUP_LIST) {
                tmpAdditiveList = menuDetail?.ADDITIVE_GROUP_LIST.filter(el=>el.ADDITIVE_GROUP_USE_FLAG=="N");
            }
            setAdditiveGroupList(tmpAdditiveList);
             */
        }
    },[isDetailShow, menuDetail])
//console.log("menu: ",menu[0].ITEM_LIST);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        if(itemExtra) {
            const selExtra = itemExtra?.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selTitleLanguage = menuDetail?.ITEM_NAME;
            }
            else if(language=="japanese") {
                selTitleLanguage = selExtra[0]?.gname_jp;
            }
            else if(language=="chinese") {
                selTitleLanguage = selExtra[0]?.gname_cn;
            }
            else if(language=="english") {
                selTitleLanguage = selExtra[0]?.gname_en;
            }
        }else {
            selTitleLanguage = menuDetail?.ITEM_NAME;
        }
        return selTitleLanguage;
    }
    const ItemInfo = () =>{
        let selInfoLanguage = "";
        if(itemExtra) {
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selInfoLanguage = selExtra[0]?.gmemo;
            }
            else if(language=="japanese") {
                selInfoLanguage = selExtra[0]?.gmemo_jp||selExtra[0]?.gmemo;
            }
            else if(language=="chinese") {
                selInfoLanguage = selExtra[0]?.gmemo_cn||selExtra[0]?.gmemo;
            }
            else if(language=="english") {
                selInfoLanguage = selExtra[0]?.gmemo_en||selExtra[0]?.gmemo;
            }
        }else {
            selInfoLanguage = "";
        }
        return selInfoLanguage;
    }
    const ItemWonsanji = () => {
        let selWonsanjiLanguage = "";
        if(itemExtra){
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji;
            }
            else if(language=="japanese") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_jp||selExtra[0]?.wonsanji;
            }
            else if(language=="chinese") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_cn||selExtra[0]?.wonsanji;
            }
            else if(language=="english") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_en||selExtra[0]?.wonsanji;
            }
        }else {
            selWonsanjiLanguage = "";
        }
        return selWonsanjiLanguage;
    }
    {/*  <DetailItemInfoFastImage source={{uri:"https:"+itemExtra[0]?.gimg_chg,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}} />
  */}
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
                                        {itemExtra&& 
                                        itemExtra[0]?.gimg_chg &&
                                            <DetailItemInfoFastImage source={ {uri:(`${images.filter(el=>el.name==menuDetailID)[0]?.imgData}`),priority: FastImage.priority.high } } />
                                        }
                                        {itemExtra&&
                                        !itemExtra[0]?.gimg_chg &&
                                            <MenuImageDefault source={require("../../assets/icons/logo.png")} />
                                        }   
                                    </DetailItemInfoImageWrapper>
                                    <DetailItemInfoWrapper>
                                        <DetailItemInfoTitleWrapper>
                                            <DetailItemInfoTitle>{ItemTitle()||menuDetail?.PROD_NM}</DetailItemInfoTitle>
                                            {itemExtra&&
                                        itemExtra[0]?.is_new=='Y'&&
                                                 <DetailItemInfoTitleEtc source={require("../../assets/icons/new_menu.png")}/>
                                            }
                                            {itemExtra&&
                                        itemExtra[0]?.is_best=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/best_menu.png")}/>
                                            }
                                            {itemExtra&&
                                        itemExtra[0]?.is_on=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/hot_menu.png")}/>
                                            }
                                            {
                                                itemExtra[0].spicy == "1" &&
                                                <MenuItemButtonInnerWrapperRight>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                                </MenuItemButtonInnerWrapperRight>
                                            }
                                            {
                                                itemExtra[0].spicy == "1.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                itemExtra[0].spicy == "2" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                itemExtra[0].spicy == "2.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                itemExtra[0].spicy == "3" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                        </DetailItemInfoTitleWrapper>
                                        <DetailItemInfoSource>{ItemWonsanji()}</DetailItemInfoSource>
                                        <DetailPriceMoreWrapper>
                                            <DetailItemInfoPriceWrapper>
                                                <DetailItemInfoPrice isBold={true} >{ menuDetail?.SAL_TOT_AMT?numberWithCommas(menuDetail?.SAL_TOT_AMT):""}</DetailItemInfoPrice><DetailItemInfoPrice isBold={false}> 원</DetailItemInfoPrice>
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
                                        {menuDetail?.PROD_GB != "00" &&
                                            (menuOptionList && menuOptionList?.length>0) &&
                                            menuOptionList.map((el,groupIdx)=>{
                                                    return(
                                                        <>
                                                            <OptTitleText>{el.GROUP_NM} {el.QTY>0?`(필수 수량 ${el.QTY}개 선택)`:''}</OptTitleText>
                                                            <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                            {
                                                                el?.OPT_ITEMS &&
                                                                el?.OPT_ITEMS?.map((itemEl,index)=>{
                                                                    
                                                                    return(
                                                                        <OptItem key={"optItem_"+index} maxQty={el.QTY} isSelected={menuOptionSelected.filter(menuEl=>menuEl.PROD_I_CD ==itemEl.PROD_I_CD).length>0 } optionData={itemEl} menuData={menuDetail} onPress={(itemSel)=>{onOptionSelect(el.GROUP_NO, itemSel);} } />    
                                                                    );
                                                                    
                                                                })
                                                            }
                                                            </OptList> 
                                                        </>
                                                    )
                                                
                                            })
                                        }
                                        
                                    </OptListWrapper>
                                    {itemExtra&&
                                            itemExtra[0]?.related &&
                                            itemExtra[0]?.related.length > 0 &&
                                            itemExtra[0]?.related[0]!="" &&
                                            <>
                                                <OptListWrapper>
                                                    <OptTitleText>{LANGUAGE[language]?.detailView.recommendMenu}</OptTitleText>
                                                    <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                        {
                                                            itemExtra[0]?.related.map((el,index)=>{
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
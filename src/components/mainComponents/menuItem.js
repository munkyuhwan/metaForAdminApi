import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,Dimensions,FlatList,Image,Text,TouchableWithoutFeedback } from 'react-native'
import { MenuImageDefault, MenuImageDefaultWrapper, MenuItemBottomWRapper, MenuItemButton, MenuItemButtonInnerWrapper, MenuItemButtonInnerWrapperLeft, MenuItemButtonInnerWrapperRight, MenuItemButtonWrapper, MenuItemHotness, MenuItemHotnessWrapper, MenuItemImage, MenuItemImageWrapper, MenuItemInfoWRapper, MenuItemName, MenuItemPrice, MenuItemSpiciness, MenuItemTopWrapper, MenuItemWrapper, SoldOutDimLayer, SoldOutDimLayerAbs, SoldOutLayer, SoldOutText } from '../../styles/main/menuListStyle';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE } from '../../styles/values';
import { setMenuDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';
import { MENU_DATA } from '../../resources/menuData';
import { colorWhite } from '../../assets/colors/color';
import {isEmpty} from 'lodash'
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { numberWithCommas } from '../../utils/common';
import { styled } from 'styled-components';
const height = Dimensions.get('window').height;
/* 메인메뉴 메뉴 아이템 */
const MenuItem = ({item,index,setDetailShow}) => {
    //<MenuItemImage />    
    //console.log("item: ",item);
    // 포스 api ITEM_ID 는 관리자 api에서 pos_code임
    const dispatch = useDispatch();
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    const {images} = useSelector(state=>state.imageStorage);

    //console.log("item: ",item); 
    if(isEmpty(item)) {
        return <></>
    }
    if(isEmpty(menuExtra)) {
        return <></>
    }
    // 이미지 찾기
    const itemExtra = menuExtra?.filter(el=>el.pos_code == item.PROD_CD);
    // 어드민 데이터 확인 후  노출여부 정함
    if(isEmpty(itemExtra)) {
        return <></>
    }
    if(itemExtra[0]?.is_view=="N") {
        return <></>
    }
    if(itemExtra[0]?.is_use=="N") {
        return <></>
    }
    const itemID = item.PROD_CD;
    //console.log("item extra: ",itemExtra[0]);
    const imgUrl = "https:"+itemExtra[0]?.gimg_chg;
    //const itemTitle=>{} item.ITEM_NAME;
    const itemTitle = () => {
        let selTitleLanguage = "";
        if(itemExtra) {
        const selExtra = itemExtra?.filter(el=>el.pos_code==item.PROD_CD);
            if(language=="korean") {
                selTitleLanguage = item.ITEM_NAME;
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
            selTitleLanguage = item.ITEM_NAME;
        }
        return selTitleLanguage;
    }
    const itemPrice= item.SAL_TOT_AMT;
    return(
        <>
            <MenuItemWrapper>
                <MenuItemTopWrapper>
                    {imgUrl &&
                        <>
                            <TouchableWithoutFeedback onPress={()=>{setDetailShow(true); dispatch(setMenuDetail({itemID,item})); }} >
                                {/* <FastImage style={{ width:'100%',height:183,resizeMode:"background",borderRadius:RADIUS_DOUBLE}} source={{uri:imgUrl,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}}/> */}
                                {/*<FastImage style={{ width:'100%',height:183,resizeMode:"background",borderRadius:RADIUS_DOUBLE}} source={{uri:(`file://${RNFetchBlob.fs.dirs.DownloadDir}/wooriorder/${itemID}.${ext[ext.length-1]}`)}}/>*/}
                                <FastImage style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}} source={{uri:(`${images.filter(el=>el.name==itemID)[0]?.imgData}`)}} resizeMode={FastImage.resizeMode.cover} />
                                {/* <Image style={{ width:'100%',height:183,resizeMode:"background",borderRadius:RADIUS_DOUBLE}} source={{uri:(`${images.filter(el=>el.name==itemID)[0]?.imgData}`)}}/> */}
                                {/* <Image style={{ width:'100%',height:183,resizeMode:"background",borderRadius:RADIUS_DOUBLE}} source={{uri:imgUrl}} /> */}
                            </TouchableWithoutFeedback>
                        </>
                    }
                    {!imgUrl &&
                        <TouchableWithoutFeedback onPress={()=>{setDetailShow(true); dispatch(setMenuDetail({itemID,item})); }} >
                            <MenuImageDefaultWrapper>
                                <MenuImageDefault source={require("../../assets/icons/logo.png")}/>
                            </MenuImageDefaultWrapper>
                        </TouchableWithoutFeedback>
                    }
                    
                    <MenuItemImageWrapper>
                        <MenuItemHotnessWrapper>
                        {itemExtra[0]?.is_new=='Y'&&
                            <MenuItemHotness source={require('../../assets/icons/new_menu.png')} />
                        }
                        {itemExtra[0]?.is_best=='Y'&&
                            <MenuItemHotness source={require('../../assets/icons/best_menu.png')} />
                        }
                        {itemExtra[0]?.is_on=='Y'&&
                            <MenuItemHotness source={require('../../assets/icons/hot_menu.png')} />
                        }
                        </MenuItemHotnessWrapper>
                        <MenuItemButtonWrapper>
                            {
                                itemExtra[0].spicy == "1" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                itemExtra[0].spicy == "1.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                itemExtra[0].spicy == "2" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                itemExtra[0].spicy == "2.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                itemExtra[0].spicy == "3" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {/* 
                            <TouchableWithoutFeedback onPress={()=>{setDetailShow(true);  dispatch(setMenuDetail({itemID,item})); }} >
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemButton source={require('../../assets/icons/more.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            </TouchableWithoutFeedback>
                             */}
                            <TouchableWithoutFeedback onPress={()=>{ if(item?.PROD_GB!="00"){setDetailShow(true);  dispatch(setMenuDetail({itemID,item}));} else { dispatch(addToOrderList({item:item,menuOptionSelected:[]}));} }} >
                                <MenuItemButtonInnerWrapperLeft>
                                    <MenuItemButton source={require('../../assets/icons/add.png')}/>
                                </MenuItemButtonInnerWrapperLeft>
                            </TouchableWithoutFeedback>
                        </MenuItemButtonWrapper>
                    </MenuItemImageWrapper>
                    {item?.SVC_GB=='1'&&
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }

                </MenuItemTopWrapper>
                <MenuItemBottomWRapper>
                    <MenuItemName>{itemTitle()||item.PROD_NM}</MenuItemName>
                    <MenuItemPrice>{numberWithCommas(itemPrice)}원</MenuItemPrice>
                </MenuItemBottomWRapper>
            </MenuItemWrapper>

        </>
    );
}


export default MenuItem;

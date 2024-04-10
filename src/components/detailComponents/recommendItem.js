import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RecommendItemDim, RecommendItemImage, RecommendItemImageWrapper, RecommendItemInfoChecked, RecommendItemInfoPrice, RecommendItemInfoTitle, RecommendItemInfoWrapper, RecommendItemWrapper } from '../../styles/main/detailStyle';
import { MENU_DATA } from '../../resources/menuData';
import {isEmpty} from "lodash";
import { getSingleMenu, getSingleMenuFromAllItems, initMenuDetail, setItemDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';
import { getPosItemsWithCategory } from '../../utils/api/metaApis';
import FastImage from 'react-native-fast-image';
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
import { isAvailable, openTransperentPopup } from '../../utils/common';
import { SoldOutDimLayer, SoldOutLayer, SoldOutText } from '../../styles/main/menuListStyle';
import { RADIUS_DOUBLE, RADIUS_SMALL, RADIUS_SMALL_DOUBLE } from '../../styles/values';
const height = Dimensions.get('window').height;

const RecommendItem = (props) => {
    const recommentItemID = props?.recommendData
    const {allItems} = useSelector(state=>state.menu);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    const {selectedMainCategory,selectedSubCategory} = useSelector(state=>state.categories)
    const {images} = useSelector(state=>state.imageStorage);
    const [menuDetail, setMenuDetail] = useState();
    const dispatch = useDispatch();

    //console.log("itemExtra:",itemExtra);
    //const recItem = allItems.filter(item => item.ITEM_ID == recommentItemID);
    //const recommendData = props?.recommendData;
    //const menuData = props?.menuData;
    // 메뉴 추가정보 찾기
    //console.log(menuExtra); 
    /* const itemExtra = menuExtra.filter(el=>el == recommentItemID);
    
    if(itemExtra?.length<=0) {
        return (<></>);
    } */

    useEffect(()=>{
        const filtered = allItems.filter(el=>el.prod_cd == recommentItemID);
        setMenuDetail(filtered[0]);

        /* getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID:recommentItemID})
        //getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID:"900050"})
        .then(result=>{
            setItemDetail(result);
        })
        .catch */
    },[])
    
    //if(isEmpty(itemDetail)) return(<></>)
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
    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{
                    if(menuDetail?.sale_status!='3') {
                        if(menuDetail?.sale_status!='3'&&isAvailable(menuDetail)) {
                            if(menuDetail?.prod_gb!="00"){
                                dispatch(initMenuDetail());
                                dispatch(setItemDetail({itemID:recommentItemID}));
                                //dispatch(setMenuDetail({itemID:recommentItemID}));
                            }else{  
                                dispatch(addToOrderList({isAdd:true, isDelete: false, item:menuDetail,menuOptionSelected:[]}));
                                openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});  //    } 
                            }
                        }
                    }
                }}>
                <RecommendItemWrapper>
                    <RecommendItemImageWrapper>
                        <RecommendItemImage  source={{uri:(`${images.filter(el=>el.name==recommentItemID)[0]?.imgData}`),priority: FastImage.priority.high }} />

                        <RecommendItemDim isSelected={props?.isSelected}/>
                        {props?.isSelected &&
                            <RecommendItemInfoChecked isSelected={props?.isSelected} source={require("../../assets/icons/check_red.png")}/>
                        }
                    </RecommendItemImageWrapper>
                    <RecommendItemInfoWrapper>
                        <RecommendItemInfoTitle>{ItemTitle()||menuDetail?.gname_kr}</RecommendItemInfoTitle>
                        <RecommendItemInfoPrice>{menuDetail?.sal_tot_amt==null?"":Number(menuDetail?.sal_tot_amt ).toLocaleString(undefined,{maximumFractionDigits:0}) } 원</RecommendItemInfoPrice>
                    </RecommendItemInfoWrapper>
                    {menuDetail?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                        <SoldOutLayer style={{ width:'97%',height:height*0.165, borderRadius:RADIUS_SMALL_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'97%',height:height*0.165, borderRadius:RADIUS_SMALL_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    {(menuDetail?.sale_status!='3'&&!isAvailable(menuDetail)) &&
                        <SoldOutLayer style={{ width:'97%',height:height*0.165, borderRadius:RADIUS_SMALL_DOUBLE}}>
                            <SoldOutText>준비중</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'97%',height:height*0.165, borderRadius:RADIUS_SMALL_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                </RecommendItemWrapper>
            </TouchableWithoutFeedback>
        </>
    )
     
}
export default RecommendItem;
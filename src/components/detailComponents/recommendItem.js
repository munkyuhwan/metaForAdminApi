import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RecommendItemDim, RecommendItemImage, RecommendItemImageWrapper, RecommendItemInfoChecked, RecommendItemInfoPrice, RecommendItemInfoTitle, RecommendItemInfoWrapper, RecommendItemWrapper } from '../../styles/main/detailStyle';
import { MENU_DATA } from '../../resources/menuData';
import {isEmpty} from "lodash";
import { getSingleMenu, getSingleMenuFromAllItems, initMenuDetail, setMenuDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';
import { getPosItemsWithCategory } from '../../utils/api/metaApis';
import FastImage from 'react-native-fast-image';
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
import { openTransperentPopup } from '../../utils/common';

const RecommendItem = (props) => {
    const recommentItemID = props?.recommendData
    const {allItems} = useSelector(state=>state.menu);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    const {selectedMainCategory,selectedSubCategory} = useSelector(state=>state.categories)
    const {images} = useSelector(state=>state.imageStorage);
    const [itemDetail, setItemDetail] = useState();
    const dispatch = useDispatch();

    //console.log("itemExtra:",itemExtra);
    //const recItem = allItems.filter(item => item.ITEM_ID == recommentItemID);
    //const recommendData = props?.recommendData;
    //const menuData = props?.menuData;
    // 메뉴 추가정보 찾기
    //console.log(menuExtra); 
    const itemExtra = menuExtra.filter(el=>el.pos_code == recommentItemID);
    
    if(itemExtra?.length<=0) {
        return (<></>);
    }

    useEffect(()=>{
        const filtered = allItems.filter(el=>el.PROD_CD == recommentItemID);
        setItemDetail(filtered[0]);

        /* getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID:recommentItemID})
        //getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID:"900050"})
        .then(result=>{
            setItemDetail(result);
        })
        .catch */
    },[])
    
    if(isEmpty(itemDetail)) return(<></>)
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        const selExtra = menuExtra.filter(el=>el.pos_code==recommentItemID);
        if(language=="korean") {
            selTitleLanguage = itemDetail[0]?.PROD_NM;
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
        return selTitleLanguage;
    }
    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{
                    if(itemDetail?.PROD_GB!="00"){
                        dispatch(initMenuDetail());
                        dispatch(setMenuDetail({itemID:recommentItemID}));
                    }else{  
                        dispatch(addToOrderList({item:itemDetail,menuOptionSelected:[]}));
                        openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});  //    } 
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
                        <RecommendItemInfoTitle>{ItemTitle()||itemDetail?.PROD_NM}</RecommendItemInfoTitle>
                        <RecommendItemInfoPrice>{itemDetail?.SAL_TOT_AMT==null?"":Number(itemDetail?.SAL_TOT_AMT ).toLocaleString(undefined,{maximumFractionDigits:0}) } 원</RecommendItemInfoPrice>
                    </RecommendItemInfoWrapper>
                </RecommendItemWrapper>
            </TouchableWithoutFeedback>
        </>
    )
     
}
export default RecommendItem;
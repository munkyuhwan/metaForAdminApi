import React, { useState, useEffect, useCallback } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategorySelected, TopMenuText } from '../../styles/main/topMenuStyle';
import { colorBrown, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';


const TopMenuList = (props) => {
    const dispatch = useDispatch();
    const data = props.data;
    const initSelect = props.initSelect;
    const {selectedMainCategory, selectedSubCategory, subCategories, allCategories} = useSelector((state)=>state.categories);
    const [selectedCode, setSelectedCode] = useState(DEFAULT_CATEGORY_ALL_CODE);

    const {menuCategories} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);

    const [selectedSubList, setSelectedSubList] = useState();
    const ItemTitle = (cateCode) => {
        const selectedData = selectedSubList.filter(el=>el.cate_code2 == cateCode);
        if(language=="korean") {
            return selectedData[0].cate_name2;
        }else if(language=="japanese") {
            return selectedData[0]?.cate_name2_jp||selectedData[0].cate_name2;
        }
        else if(language=="chinese") {
            return selectedData[0]?.cate_name2_cn||selectedData[0].cate_name2;
        }
        else if(language=="english") {
            return selectedData[0]?.cate_name2_cn||selectedData[0].cate_name2;
        }
        return "";

    }
    const ItemWhole = () =>{
        let selTitleLanguage = "";
        if(language=="korean") {
            selTitleLanguage = '전체'
        }
        else if(language=="japanese") {
            selTitleLanguage = "全体"
        }
        else if(language=="chinese") {
            selTitleLanguage = "全部的"
        }
        else if(language=="english") {
            selTitleLanguage = "ALL"
        }
        return selTitleLanguage; 
    }
/* 
    useEffect(()=>{
        if(selectedMainCategory) {
            const changedSelectedMainCat = allCategories.filter(el=>el.PROD_L1_CD==selectedMainCategory);
            if(changedSelectedMainCat) {
                if(changedSelectedMainCat?.length > 0) {
                    setSelectedSubList(changedSelectedMainCat[0].PROD_L2_LIST);
                }
            }
        }
    },[selectedMainCategory]) */

    useEffect(()=>{
        setSelectedSubList(subCategories);
    },[subCategories])

    const onPressAction = (itemCD) =>{
        dispatch(setSelectedSubCategory(itemCD)); 
    }
    return (
        <>
        {selectedSubList &&
        selectedSubList.map((el, index)=>{
            return(
                <>            
                        {
                        (el?.cate_code2==selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <CategorySelected>
                                    <TopMenuText key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </CategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {
                        (el?.cate_code2!=selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <CategoryDefault>
                                    <TopMenuText key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </CategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                        
                </>
            )

        })}
        </>
    )

}

export default TopMenuList
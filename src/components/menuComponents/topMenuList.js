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
        const selectedData = selectedSubList.filter(el=>el.PROD_L2_CD == cateCode);
        const adminSelectedSubCatData = menuCategories.filter(el=>el.cate_code1==selectedMainCategory);
        const adminSubCat = adminSelectedSubCatData[0]?.level2;
        const selectedAdminSub = adminSubCat?.filter(el=>el.cate_code2 == cateCode);
        if(language=="korean") {
            return selectedData[0].PROD_L2_NM;
        }else if(language=="japanese") {
            return selectedAdminSub[0]?.cate_name2_jp||selectedData[0].PROD_L2_NM
        }
        else if(language=="chinese") {
            return selectedAdminSub[0]?.cate_name2_cn||selectedData[0].PROD_L2_NM
        }
        else if(language=="english") {
            return selectedAdminSub[0]?.cate_name2_en||selectedData[0].PROD_L2_NM
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

    useEffect(()=>{
        if(selectedMainCategory) {
            const changedSelectedMainCat = allCategories.filter(el=>el.PROD_L1_CD==selectedMainCategory);
            if(changedSelectedMainCat) {
                if(changedSelectedMainCat?.length > 0) {
                    setSelectedSubList(changedSelectedMainCat[0].PROD_L2_LIST);
                }
            }
        }
    },[selectedMainCategory])

    const onPressAction = (itemCD) =>{
        dispatch(setSelectedSubCategory(itemCD)); 
    }
    return (
        <>
        {/*selectedSubCategory == DEFAULT_CATEGORY_ALL_CODE &&
            <TouchableWithoutFeedback key={"subcat_"} onPress={()=>{}}>
                <CategorySelected>
                    <TopMenuText key={"subcatText_"} >{ItemWhole()}</TopMenuText>
                </CategorySelected>
            </TouchableWithoutFeedback>
        }
        {selectedSubCategory != DEFAULT_CATEGORY_ALL_CODE &&
            <TouchableWithoutFeedback key={"subcat_"} onPress={()=>{onPressAction(DEFAULT_CATEGORY_ALL_CODE);}}>
                <CategoryDefault>
                <TopMenuText key={"subcatText_"} >{ItemWhole()}</TopMenuText>
                </CategoryDefault>
            </TouchableWithoutFeedback>
        */}
        {selectedSubList &&
        selectedSubList.map((el, index)=>{
            return(
                <>            
                        {
                        (el?.PROD_L2_CD==selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.PROD_L2_CD} onPress={()=>{ onPressAction(el?.PROD_L2_CD); }}>
                                <CategorySelected>
                                    <TopMenuText key={"subcatText_"+el?.PROD_L2_CD} >{ItemTitle(el?.PROD_L2_CD)}</TopMenuText>
                                </CategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {
                        (el?.PROD_L2_CD!=selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.PROD_L2_CD} onPress={()=>{ onPressAction(el?.PROD_L2_CD); }}>
                                <CategoryDefault>
                                    <TopMenuText key={"subcatText_"+el?.PROD_L2_CD} >{ItemTitle(el?.PROD_L2_CD)}</TopMenuText>
                                </CategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                        
                </>
            )

        })}
        </>
    )

/* 
    return (
        <>
        {data.map((el, index)=>{
            return(
                <>
                    <TouchableWithoutFeedback key={"subcat_"+index} onPress={()=>{onPressAction(index); }}>
                        <Animated.View key={"subcatAni_"+index}  style={[{   ...animatedColorArray[index]},{...boxStyleArray[index]}]} >
                            <TopMenuText key={"subcatText_"+index} >{el.title}</TopMenuText>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </>
            )
        })}
        </>
    )
     */
}

export default TopMenuList
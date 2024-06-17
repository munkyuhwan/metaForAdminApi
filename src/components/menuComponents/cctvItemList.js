import React, { useState, useEffect, useCallback } from 'react'
import { Animated, Pressable, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategorySelected, TopMenuText } from '../../styles/main/topMenuStyle';
import { colorBrown, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';


const CCTVItemList = (props) => {
    const dispatch = useDispatch();
    const data = props.data;

    if(data?.length <= 0 ) {
        return(
            <>
            </>
        )
    }
    return(
        <>
        {data?.map((el)=>{
            return(
                <Pressable onPress={()=>{ props?.onSelectItem(el); }}>
                    <CategorySelected isSelected={props?.currentIndex==el?.idx} >
                        <TopMenuText key={"subcatText_"+el?.idx} >{el?.cctv_name}</TopMenuText>
                    </CategorySelected>
                </Pressable>
            )
        })


        }
        
        </>
    )

    /*
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
    */

}

export default CCTVItemList
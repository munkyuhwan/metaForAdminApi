import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,Text,TouchableWithoutFeedback, View } from 'react-native'
import { MenuListWrapper } from '../../styles/main/menuListStyle';
import MenuItem from '../mainComponents/menuItem';
import ItemDetail from '../detailComponents/itemDetail';
import { getMenu, updateMenu } from '../../store/menu';
import { widthAnimationStyle } from '../../utils/animation';
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { useSharedValue } from 'react-native-reanimated';
import { numberPad, openFullSizePopup, openPopup } from '../../utils/common';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';

// 스크롤링 관련
var touchStartOffset = 0;
var touchEndOffset = 0;
var currentOffset = 0;
var scrollDownReached = false;
var scrollDownCnt = 0;
var scrollUpReached = false;
var scrollUpCnt = 0;
var isScrolling = false;
let direction = "";

const MenuListView = () => {

    const dispatch = useDispatch();
    const listRef = useRef();

    const {displayMenu,menu, allSets} = useSelector((state)=>state.menu);
    const {isOn} = useSelector((state)=>state.cartView);
    const {language} = useSelector(state=>state.languages);

    const [numColumns, setNumColumns] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);


    // 선택 카테고리
    const {mainCategories, selectedMainCategory, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);


    const toNextCaterogy = () =>{
        const selectedCat = allCategories.filter(e => e.cate_code1==selectedMainCategory);
        const selectedIndex = allCategories.indexOf(selectedCat[0]);
        var nextPage = 0;
        nextPage = selectedIndex+1;
        if(nextPage>allCategories.length-1) nextPage=allCategories.length-1;
        dispatch(setSelectedMainCategory(allCategories[nextPage].cate_code1)); 
        dispatch(setSelectedSubCategory("0000"))
    }
    const toPrevCaterogy = () =>{
        const selectedCat = allCategories.filter(e => e.cate_code1==selectedMainCategory);
        const selectedIndex = allCategories.indexOf(selectedCat[0]);
        var nextPage = 0;
        nextPage = selectedIndex-1;
        if(nextPage<0) nextPage=0;
        if(nextPage>allCategories.length-1) nextPage=allCategories.length-1;
        dispatch(setSelectedMainCategory(allCategories[nextPage].cate_code1)); 
        dispatch(setSelectedSubCategory("0000"))        
    }
    useEffect(()=>{
        if(isOn) {
            setNumColumns(2);
        }else {
            setNumColumns(3);
        }
    },[isOn])


    useEffect(()=>{
        if(displayMenu.length>0) {
            //listRef?.current?.scrollTo({x:0,animated: false});
            //if(listRef)listRef?.current?.scrollTo({y:0,animated: false});
            if(listRef.current != undefined){
                listRef.current.scrollToOffset({ animated: false, offset: 0 });
            }
        }
    },[displayMenu])
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 2;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

    const isCloseToTop = ({contentOffset}) => {
        return contentOffset.y == 0;
    };
    //console.log("mainCategories: ",mainCategories[0].ITEM_GR`OUP_CODE)
    if(displayMenu?.length <= 0) {
        return(<></>);
    }

    return(
        <>
            <MenuListWrapper>
                {displayMenu?.length > 0 &&
                    <FlatList
                        ref={listRef}
                        columnWrapperStyle={{gap:11}}
                        style={{height:'100%', zIndex: 99 }}
                        data={displayMenu}
                        renderItem={({item, index})=>{ return(<MenuItem isDetailShow={isDetailShow} 
                        setDetailShow={setDetailShow} item={item} index={index} /> );}}
                        numColumns={numColumns}
                        key={numColumns}
                        keyExtractor={(item,index)=>index}
                        onTouchStart={(event)=>{
                            touchStartOffset = event.nativeEvent.pageY;
                        }}
                        onTouchEnd={(event)=>{   
                            // 스크롤 없을 때 호출
                            touchEndOffset = event.nativeEvent.pageY;
                            const touchSize = touchStartOffset - touchEndOffset;
                            
                            if(touchSize < 0) {
                                // swipe down
                                if( (touchSize*-1) > 150 ) {
                                    // action
                                    if(scrollDownCnt>=1) {
                                        toPrevCaterogy();
                                    }else {
                                        scrollDownCnt = scrollDownCnt+1;
                                    }
                                }
                            }else {
                                // swipe up
                                if(touchSize>150) {
                                    //action
                                    if(scrollUpCnt>=1) {
                                        toNextCaterogy();
                                    }else {
                                        scrollUpCnt = scrollUpCnt+1;
                                    }
                                } 
                            }
                            
                        }}
                        onScroll={(event)=>{
                            direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
                            currentOffset = event.nativeEvent.contentOffset.y;
                            
                            scrollDownReached = false;
                            scrollUpReached = false;
                            scrollDownCnt = 0;
                            scrollUpCnt = 0;

                            if (isCloseToBottom(event.nativeEvent)) {
                                scrollDownCnt = scrollDownCnt+1;
                                if(direction == "down") scrollDownReached = true; scrollUpReached = false;
                            }
                            if (isCloseToTop(event.nativeEvent)) {
                                scrollUpCnt = scrollUpCnt+1;
                                if(direction == 'up') scrollUpReached = true; scrollDownReached = false;
                            }
                        }}
                        onScrollBeginDrag={(ev)=>{
                            // 스크롤 있을떄 호출됨
                            isScrolling=true;
                        }}
                        onScrollEndDrag={(ev)=>{
                            if(scrollDownReached ) {
                                if(scrollDownCnt>1) {
                                    toNextCaterogy();
                                }else {
                                    scrollDownCnt = scrollDownCnt+1;
                                }

                            }
                            if(scrollUpReached) {
                                if(scrollUpCnt>1) {
                                    toPrevCaterogy();
                                }else {
                                    scrollUpCnt = scrollUpCnt+1;
                                }
                            }
                        }}
                    />
                }
            </MenuListWrapper>
            {/*isDetailShow&&
            <ItemDetail isDetailShow={isDetailShow} setDetailShow={setDetailShow} language={language}/>
                */}
        </>
    );
}

export default MenuListView;

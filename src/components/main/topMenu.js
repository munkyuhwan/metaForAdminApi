import React, { useEffect, useRef, useState } from 'react'
import { 
    Animated,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { HeaderLogo, HeaderWrapper } from '../../styles/header/header'
import { LogoTop, LogoWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import { SideMenuItemTouchable } from '../common/sideMenuItem'
import { TopMenuItemTouchable, TopMenuItemTouchableOff } from '../menuComponents/topMenuItem'
import { BulletinText, BulletinWrapper, CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/topMenuStyle'
 import TopButton from '../menuComponents/topButton'
import { useDispatch, useSelector } from 'react-redux'
import ItemDetail from '../detailComponents/itemDetail'
import { getSubCategories, setCategories, setSelectedSubCategory } from '../../store/categories'
import { getTableInfo, openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import { colorWhite } from '../../assets/colors/color'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import { uploadFile } from '../../store/etcFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMenuState } from '../../store/menu'
import AutoScroll from "@homielab/react-native-auto-scroll";
import { setTableInfo } from '../../store/tableInfo'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MAINIMG = windowWidth;

const TopMenu = () =>{
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const {selectedMainCategory,subCategories, allCategories} = useSelector(state => state.categories);
    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");
    const {tableInfo} = useSelector(state => state.tableInfo);
    
    const {bulletin} = useSelector(state=>state.menuExtra);

    const [currentVersion, setCurrentVersion ] = useState("version");
    const [bulletinText, setBulletinText] = useState("");
    const [bulletinCode, setBulletinCode] = useState("");
    const [isBulletinShow, setBulletinShow] = useState();

    useEffect(()=>{
        const changedSelectedMainCat = allCategories.filter(el=>el.PROD_L1_CD==selectedMainCategory);
        if(changedSelectedMainCat) {
            if(changedSelectedMainCat?.length > 0) {
                //setSelectedSubList(changedSelectedMainCat[0].PROD_L2_LIST);
                if(changedSelectedMainCat[0]?.PROD_L2_LIST?.length > 0) {setBulletinShow(false)}else {setBulletinShow(true)}
            }
        }

        scrollViewRef.current.scrollTo({x:0,animated: false});
        const bulletinToShow = bulletin?.filter(el=>el.cate_code == selectedMainCategory);
        if(bulletinToShow){
            setBulletinCode(bulletinToShow[0]?.cate_code);
            setBulletinText(bulletinToShow[0]?.subject);
        }
    },[selectedMainCategory])

    useEffect(()=>{
        if(tableInfo) {
            //setTableNoText(tableInfo.tableNo)
            AsyncStorage.getItem("TABLE_INFO")
            .then((TABLE_INFO)=>{
                if(TABLE_INFO) {
                    setTableInfoText(TABLE_INFO)
                }
            })

            AsyncStorage.getItem("TABLE_NM")
            .then((TABLE_NM)=>{
                if(TABLE_NM) {
                    setTableNoText(TABLE_NM)
                }else {
                }
            })
        }
    },[tableInfo])

    useEffect(()=>{ 
        
        setCurrentVersion(VersionCheck.getCurrentVersion());
        AsyncStorage.getItem("TABLE_NM")
        .then((TABLE_NM)=>{
            if(TABLE_NM) {
                setTableNoText(TABLE_NM)
            }else {
            }
        })
    },[])

    const onPressItem = (index) => {
        dispatch(setSelectedSubCategory(index)); 
    }

    //<BulletinWrapper ref={bulletinScroll} horizontal >
    //</BulletinWrapper>
          
                       /*  <Animated.ScrollView
                            style={styles.container}
                            onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: scrollA}}}],
                            {useNativeDriver: true},
                        )}>
                            <Animated.Text
                                style={styles.img(scrollA)}
                            >
                                {bulletinText}
                            </Animated.Text>
                        </Animated.ScrollView> */
                        /* 
    let currentScroll = 0;
    const tt = setInterval(() => {
        bulletinScroll?.current?.scrollTo({x:currentScroll, animated:true})
        currentScroll+=10;
        console.log("scoll");
    }, 700);


                           // <BulletinWrapper ref={bulletinScroll} horizontal >
                           // </BulletinWrapper>
 */
    return(
        <>
            <TopMenuWrapper>
                <SafeAreaView>
                    <CategoryScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} >
                        <CategoryWrapper>
                            {
                                <TopMenuList
                                    data={subCategories}
                                    onSelectItem={(index)=>{ onPressItem(index); }}
                                    initSelect={0}
                                />
                            }
                       </CategoryWrapper>
                    </CategoryScrollView>
                    {((bulletinCode == selectedMainCategory)&&(isBulletinShow)) &&
                        <AutoScroll duration={10000}  style={{width:600}}>
                            <BulletinText>{bulletinText}</BulletinText>
                        </AutoScroll>
                    }
                </SafeAreaView>

                {/*
                <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true}); }} >
                    <Text style={{color:colorWhite }} >설정 {currentVersion}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{dispatch(getMenuState()); }} >
                    <Text style={{color:colorWhite }} >업데이트 첵</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{ console.log("upload file"); dispatch(uploadFile()) }} >
                    <Text style={{color:colorWhite, fontSize:20}} >파일올리기 </Text>
                </TouchableWithoutFeedback>
                        */}
                <TableName>
                    <TableNameSmall>테이블</TableNameSmall>
                    <TableNameBig>{tableNoText}</TableNameBig>
                </TableName>
              
                
            </TopMenuWrapper>
        </>
    )
}/* 
const styles = StyleSheet.create({
    safeView: {
     flex: 1,
     backgroundColor: '#1C1C1E',
    },
    container: {
     flex: 1,
     width: '600px',
     backgroundColor: '#1C1C1E',
     // paddingTop: '15%',
     paddingBottom: '15%',
    },
    img: scrollA => ({
        width: windowWidth * 2,
        height: MAINIMG,
        resizeMode: 'center',
        transform: [
          {
            translateX: scrollA.interpolate({
                inputRange: [-MAINIMG, 0, MAINIMG, MAINIMG + 1],
                outputRange: [-MAINIMG / 2, 0, MAINIMG * 0.75, MAINIMG * 0.75],
            }) ,
          },
          {
            scale:0.5,
          },
        ],
       })
});
 */
export default TopMenu
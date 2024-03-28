import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native';
import { SideMenuItemOff, SideMenuItemOn, SideMenuItemWrapper, SideMenuText } from '../../styles/main/sideMenuStyle';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMainCategory } from '../../store/categories';

const LeftMenuList = (props) => {
    const dispatch = useDispatch();
    const data = props?.data;
    const initSelect = props?.initSelect;
    const [selectIndex, setSelectedIndex] = useState(0);
    const {selectedMainCategory,mainCategories} = useSelector((state)=>state.categories);
    const {menuCategories} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    //console.log("menuCategories: ",menuCategories);
    // 이미지 찾기
    //const itemExtra = menuExtra.filter(el=>el.pos_code == item.ITEM_ID);

    const onPressAction = (index, groupCode) =>{
        if(groupCode) dispatch(setSelectedMainCategory(groupCode));
    }
    const ItemTitle = (categoryID, index) => {
        let selTitleLanguage = "";
        const selExtra = menuCategories?.filter(el=>el.cate_code1==categoryID);
        
        if(language=="korean") {
            selTitleLanguage = data[index]?.PROD_L1_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.cate_name1_jp || data[index]?.PROD_L1_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.cate_name1_cn|| data[index]?.PROD_L1_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.cate_name1_en|| data[index]?.PROD_L1_NM;
        }

        return selTitleLanguage;    
    }
     return(
        <>
            {data?.map((item, index)=>{    
                    if(item?.is_del == 'N' || item?.is_use == 'Y' ) { 
                        return(
                            <TouchableWithoutFeedback key={"leftItem_"+index} onPress={()=>{{ onPressAction(index,item?.cate_code1); }}}>
                                <SideMenuItemWrapper>
                                    {item?.cate_code1==selectedMainCategory &&
                                        <SideMenuItemOn>
                                            <SideMenuText>{ItemTitle(item?.cate_code1,index)||data[index]?.cate_name1 }</SideMenuText>
                                        </SideMenuItemOn>
                                    }
                                    {item?.cate_code1!=selectedMainCategory &&
                                        <SideMenuItemOff>
                                            <SideMenuText>{ItemTitle(item?.cate_code1,index)||data[index]?.cate_name1}</SideMenuText>
                                        </SideMenuItemOff>
                                    }
                                </SideMenuItemWrapper>
                            </TouchableWithoutFeedback>
                        )
                    }else {
                        return(<></>)
                    }
                
            })}
        </>
    )
}
export default LeftMenuList;
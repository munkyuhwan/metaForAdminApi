import { useDispatch, useSelector } from "react-redux";
import { OptList } from "../../styles/main/detailStyle";
import OptItem from "../detailComponents/optItem";
import RadioGroup from 'react-native-radio-buttons-group';
import { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import { getSetItems, setMenuOptionSelected } from "../../store/menuDetail";
import FastImage from "react-native-fast-image";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { openPopup } from "../../utils/common";
import { getPosItemsWithCategory } from "../../utils/api/metaApis";

const OptionSelectPopup = () =>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();
    const {menuOptionList, menuOptionGroupCode, setGroupItem, menuOptionSelected} = useSelector((state)=>state.menuDetail);
    
    const [selectedId, setSelectedId] = useState();
    

    // 메뉴 옵션 선택 추가 정보
    const {menuExtra} = useSelector(state=>state.menuExtra);

    const itemImg = (additiveId) => {
        let imgDir = "";
        const selExtra = menuExtra.filter(el=>el.pos_code==additiveId);
        return (selExtra[0]?.gimg_chg)
    }
    
    const ItemTitle = (additiveId,index) =>{
        let selTitleLanguage = "";
        const selExtra = menuExtra.filter(el=>el.pos_code==additiveId);
        if(language=="korean") {
            selTitleLanguage = setGroupItem[index]?.PROD_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.op_name_jp;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.op_name_cn;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.op_name_en;
        }
        return selTitleLanguage;
    }
    
    //console.log("optionExtra: ",optionExtra);
   
    useEffect(()=>{
        if(selectedId) { 
            let setItem =  {
                "ITEM_SEQ" : 0,
                "SET_SEQ" : menuOptionSelected.length+1,
                "PROD_I_CD" : selectedId?.PROD_CD,
                "PROD_I_NM" : selectedId?.PROD_NM,
                "QTY" : 1,
                "AMT" : selectedId?.SAL_AMT,
                "VAT" : selectedId?.SAL_VAT,
            }; 
            dispatch(setMenuOptionSelected(setItem));
            openPopup(dispatch,{innerView:"", isPopupVisible:false}); 
        }
    },[selectedId])
    const deleteOption = (selectedItem) => {

    }
    
    useEffect(()=>{
        //dispatch(getSetItems());
    },[menuOptionGroupCode])

    

    return( 
        <>
            {setGroupItem?.length > 0 &&
            <ScrollView horizontal={true} >
                <View style={{ width:'100%', textAlign:'center', alignItems:"center", padding:20}} >
                    <View style={{width:'100%', height:100, padding:0, flexDirection:'row', alignItems:'center', textAlign:'center'  }} >
                        {/* <TouchableWithoutFeedback onPress={()=>{setSelectedId(el)}} >
                            <View style={{padding:10}} >
                                <FastImage style={{width:100, height:100, resizeMode:'contain',  }}/>
                                <Text style={{width:'100%', color:'black', fontWeight:'bold', fontSize:17, textAlign:'center'}}  >없음</Text>
                            </View>
                        </TouchableWithoutFeedback>  */}
                        {setGroupItem?.map((el,index)=>{ 
                            if(el.USE_YN == "Y") {
                                return (
                                    <TouchableWithoutFeedback onPress={()=>{setSelectedId(el)}} >
                                        <View style={{padding:10}} >
                                            <FastImage style={{width:100, height:100, resizeMode:'contain',  }} source={{uri:`https:${itemImg(el.PROD_CD)}`}} />
                                            <Text style={{width:'100%', color:'black', fontWeight:'bold', fontSize:17, textAlign:'center'}}  >{ItemTitle(el.PROD_CD, index)}</Text>
                                            <Text style={{width:'100%', color:'black', fontWeight:'bold', fontSize:17, textAlign:'center'}}  >{"+"+el.SAL_TOT_AMT+"원"}</Text>
                                        </View>
                                    </TouchableWithoutFeedback> 
                                )
                            }else {
                                return(<></>);
                            }

                        })}
                    </View>
                </View>
            </ScrollView>

            }
        </>
    );
}

export default OptionSelectPopup;


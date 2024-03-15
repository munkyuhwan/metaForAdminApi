import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OptItemDim, OptItemFastImage, OptItemImage, OptItemInfoChecked, OptItemInfoPrice, OptItemInfoTitle, OptItemInfoWrapper, OptItemWrapper } from '../../styles/main/detailStyle';
import { getSetItems, setMenuOptionSelected } from '../../store/menuDetail';
import FastImage from 'react-native-fast-image';
import { DetailItemAmtController, DetailItemAmtText,DetailItemAmtWrapper, DetailOperandorText, OperandorText } from '../../styles/main/cartStyle';
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
import { max } from 'moment';


const OptItem = (props)=>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();

    const optionProdCD = props.optionProdCD;
    //console.log("optionData: ",optionProdCD);
    const maxQty = props.maxQty;
    
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID,  menuOptionGroupCode, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [isSelected, setSelected] = useState(false);
    const [addtivePrice, setAdditivePrice] = useState();
    const [qty,setQty] = useState(1);
    const {images} = useSelector(state=>state.imageStorage);

    // 메뉴 옵션 추가 정보
    const {optionCategoryExtra,menuExtra} = useSelector(state=>state.menuExtra);
    const itemDetail = allItems.filter(el=>el.prod_cd==optionProdCD);
    //console.log("option item detail:",itemDetail[0])
    const itemMenuExtra = menuExtra.filter(el=>el.pos_code==optionProdCD);
    const ItemTitle = () =>{
        let selTitleLanguage = ""; 
        //const selExtra = itemMenuExtra.filter(el=>el.pos_code==optionProdCD);
        if(language=="korean") {
            selTitleLanguage = itemDetail[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selTitleLanguage = itemDetail[0]?.gname_jp||itemDetail[0]?.gname_kr;
        }
        else if(language=="chinese") {
            selTitleLanguage = itemDetail[0]?.gname_cn||itemDetail[0]?.gname_kr;
        }
        else if(language=="english") {
            selTitleLanguage = itemDetail[0]?.gname_en||itemDetail[0]?.gname_kr;
        }
        return selTitleLanguage;
    }
    function isOptionAdd() {
        if(maxQty == 0) {
            return true;
        }else {
            let booleanArr = true;
            console.log("menuOptionList: ",menuOptionList);
            for(var i=0;i<menuOptionList.length;i++) {
                console.log("OPT_ITEMS:",menuOptionList[i].OPT_ITEMS);
                let optItems = menuOptionList[i].OPT_ITEMS;
                if(menuOptionList[i].QTY == 0) {
                    booleanArr = booleanArr && true;
                }else {
                    let cnt = 0;
                    for(var j=0;j<menuOptionSelected.length;j++) {
                        // 해당 중분류의 아이템이 몇개가 선택 되었는지 체크;
                        let filter = optItems.filter(el=>el.PROD_I_CD == menuOptionSelected[j].PROD_I_CD);
                        if(filter.length > 0) {
                            cnt = cnt+menuOptionSelected[j]?.QTY;
                        } 
                    }
                    booleanArr = booleanArr && menuOptionList[i]?.QTY==cnt;
                }
            }
            return booleanArr;
        }
    }

    const plusCnt = () =>{
        if(maxQty == 0) {
            let tmpOptions = Object.assign([],menuOptionSelected);
            let filteredTmpOptions = tmpOptions.filter(el=>el.prod_i_cd ==optionProdCD )
    
            let tmpOptionPut = filteredTmpOptions[0];
            let qty = 1;
            if(filteredTmpOptions.length > 0) {
                qty = filteredTmpOptions[0].QTY+1
            }
            //const maxQty = filteredTmpOptions[0]?.QTY;
            tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
            dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
        }else {
            
            if(!isOptionAdd()){
                let tmpOptions = Object.assign([],menuOptionSelected);
                let filteredTmpOptions = tmpOptions.filter(el=>el.prod_i_cd ==optionProdCD )
        
                let tmpOptionPut = filteredTmpOptions[0];
                let qty = 1;
                if(filteredTmpOptions.length > 0) {
                    qty = filteredTmpOptions[0].QTY+1
                }
                //const maxQty = filteredTmpOptions[0]?.QTY;
                tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
                dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
            }

        }

    }
    const minusCnt = () => {
        let tmpOptions = Object.assign([],menuOptionSelected);
        let filteredTmpOptions = tmpOptions.filter(el=>el.prod_i_cd ==optionProdCD )
        let tmpOptionPut = filteredTmpOptions[0];
        let qty = 1;
        if(filteredTmpOptions.length > 0) {
            qty = filteredTmpOptions[0].QTY-1
        }
        tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
        dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
    }

    
    useEffect(()=>{
        let filteredTmpOptions = menuOptionSelected.filter(el=>el.PROD_I_CD ==optionProdCD )
        if(filteredTmpOptions.length > 0) {
            setQty(filteredTmpOptions[0].QTY);
        }
    },[menuOptionSelected])
// <OptItemFastImage  source={{uri:`https:${itemMenuExtra[0]?.gimg_chg}`,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}}/>


    return(
        <>
            { 
            <TouchableWithoutFeedback onPress={()=>{ if(maxQty==0){ props.onPress(itemDetail[0]); }else{  props.onPress(itemDetail[0]) }}} >
                <View>

                    <OptItemWrapper>
                        {itemDetail[0]?.gimg_chg &&
                            <OptItemFastImage  source={{uri:(`${images.filter(el=>el.name==optionProdCD)[0]?.imgData}`),priority: FastImage.priority.high }}/>}
                        {!itemDetail[0]?.gimg_chg &&
                            <OptItemFastImage resizeMode='contain'  source={require('../../assets/icons/logo.png')}/>
                        }
                        <OptItemDim isSelected={props.isSelected}/>
                        <OptItemInfoWrapper>
                            <OptItemInfoTitle>{ItemTitle()||itemDetail[0]?.gname_kr }</OptItemInfoTitle>
                            <OptItemInfoPrice>{itemDetail[0]?.sal_tot_amt?"+"+Number(itemDetail[0]?.sal_tot_amt*qty).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                            {/* <OptItemInfoChecked isSelected={props.isSelected} source={require("../../assets/icons/check_red.png")}/> */}
                        </OptItemInfoWrapper>
                    </OptItemWrapper>
                    {/* 옵션 수량 조절 */}
                    {props.isSelected &&
                        <DetailItemAmtWrapper>
                            <TouchableWithoutFeedback  onPress={()=>{ minusCnt();}} >
                                <DetailItemAmtController>
                                <DetailOperandorText>-</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                            <DetailItemAmtText>{qty}</DetailItemAmtText>
                            <TouchableWithoutFeedback  onPress={()=>{ plusCnt(); }} >
                                <DetailItemAmtController>
                                    <DetailOperandorText>+</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                        </DetailItemAmtWrapper>
                    }
                </View>
            </TouchableWithoutFeedback>
            }
        </>
    )
}
export default OptItem
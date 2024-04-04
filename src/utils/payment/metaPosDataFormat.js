import moment from "moment";
import { POS_VERSION_CODE, POS_WORK_CD_POSTPAY_ORDER, POS_WORK_CD_PREPAY_ORDER_REQUEST } from "../../resources/apiResources";
import { getTableInfo, numberPad } from "../common";
import { posErrorHandler } from "../errorHandler/ErrorHandler";
import { isEqual, isEmpty } from 'lodash'
/* 
var itemDataFormat = 
{
    "ITEM_SEQ" : 2,
    "ITEM_CD" : "900003",
    "ITEM_NM" : "시즌 스노우 라떼",
    "ITEM_QTY" : 1,
    "ITEM_AMT" : 9000,
    "ITEM_VAT" : 579,
    "ITEM_DC" : 2625,
    "ITEM_CANCEL_YN" : "N",
    "ITEM_GB" : "T",
    "ITEM_MSG" : "딸기시럽 듬뿍",
    "SETITEM_CNT" : 2,
    "SETITEM_INFO" : 
    [
      {
        "ITEM_SEQ" : 2,
        "SET_SEQ" : 1,
        "PROD_I_CD" : "100134",
        "PROD_I_NM" : "딸기시럽추가",
        "QTY" : 1,
        "AMT" : 0,
        "VAT" : 0,
      },
      {
        "ITEM_SEQ" : 2,
        "SET_SEQ" : 2,
        "PROD_I_CD" : "100135",
        "PROD_I_NM" : "휘핑크림추가",
        "QTY" : 1,
        "AMT" : 0,
        "VAT" : 0,
      }
    ]
}; */


export const metaPostPayFormat = async (orderList,payData, allItems) => {
    const date = new Date();
    
    const tableNo = await getTableInfo().catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});});
    if(isEmpty(tableNo)) {
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});
        return 
    }
    //const orderNo = `${date.getFullYear().toString().substring(2,4)}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}${moment().format("HHMMSSs")}`;
    const orderNo = `${date.getFullYear().toString().substring(2,4)}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}${moment().valueOf()}`;
    // order item 
    var itemList = [];
    for(var i=0;i<orderList.length;i++) {
        const itemDetail = allItems?.filter(el=>el.prod_cd == orderList[i]?.prod_cd);
        const setItems = orderList[i].set_item;
        // set item 
        var setItemArray = [];
        var setItem = {
            "ITEM_SEQ" : 2,
            "SET_SEQ" : 1,
            "PROD_I_CD" : "100134",
            "PROD_I_NM" : "딸기시럽추가",
            "QTY" : 1,
            "AMT" : 0,
            "VAT" : 0,
        }
        for(var j=0;j<setItems.length;j++) {
            const setItemDetail = allItems?.filter(el=>el.prod_cd == setItems[j]?.optItem);
            setItem["ITEM_SEQ"] = i+1;
            setItem["SET_SEQ"] = j+1;
            setItem["PROD_I_CD"] = setItems[j].optItem;
            setItem["PROD_I_NM"] = setItemDetail[0].gname_kr;
            setItem["QTY"] = Number(setItems[j].qty)*Number(orderList[i].qty);
            setItem["AMT"] = Number(setItemDetail[0]?.sal_tot_amt)*Number(setItems[j].qty)*Number(orderList[i].qty);
            setItem["VAT"] = Number(setItemDetail[0]?.sal_vat)*Number(setItems[j].qty)*Number(orderList[i].qty);
            setItemArray.push(setItem);
        }
        var itemDataFormat ={}
        itemDataFormat["ITEM_SEQ"]=i+1;
        itemDataFormat["ITEM_CD"] = itemDetail[0]?.prod_cd;
        itemDataFormat["ITEM_NM"] = itemDetail[0]?.gname_kr;
        itemDataFormat["ITEM_QTY"] = orderList[i].qty;
        itemDataFormat["ITEM_AMT"] = Number(itemDetail[0]?.sal_tot_amt)*Number(orderList[i].qty);
        itemDataFormat["ITEM_VAT"] = Number(itemDetail[0]?.sal_vat)*Number(orderList[i].qty);
        itemDataFormat["ITEM_DC"] = 0;
        itemDataFormat["ITEM_CANCEL_YN"] = "N";
        itemDataFormat["ITEM_GB"] = "";
        itemDataFormat["ITEM_MSG"] = "";
        itemDataFormat["SETITEM_CNT"] = setItemArray.length;
        itemDataFormat["SETITEM_INFO"] = setItemArray;
        itemList.push(itemDataFormat);
    }
    let orderData = {
        "VERSION" : POS_VERSION_CODE,
        "WORK_CD" : !isEmpty(payData)?POS_WORK_CD_PREPAY_ORDER_REQUEST:POS_WORK_CD_POSTPAY_ORDER, //선불 후불에 따라 코드 다름
        "ORDER_NO" : orderNo,
        "TBL_NO" : `${tableNo.TABLE_INFO}`, 
        "PRINT_YN" : "Y",
        "USER_PRINT_YN" : "Y",
        "PRINT_ORDER_NO" : orderNo, 
        "TOT_INWON" : 4,
        "ITEM_CNT" : orderList.length,
        "ITEM_INFO" :itemList
    }    
    return orderData;

}
import { useSelector } from "react-redux";
import { LANGUAGE } from "../../resources/strings";
import { CancelText, CancleBtn, OrderPayAmtTitle, OrderPayCardShape, OrderPayCardText, OrderPayCardWrapper } from "../../styles/popup/orderListPopupStyle";
import { numberWithCommas } from "../../utils/common";
import { Alert, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { colorCardEnd, colorCardStart } from "../../assets/colors/color";
import { KocesAppPay } from '../../utils/payment/kocesPay';
import AsyncStorage from "@react-native-async-storage/async-storage";


const PaidDataItem = (props) =>{
    const {language} = useSelector(state=>state.languages);
    const data = props?.data;
    const paidData = `${data?.paidData?.InpNm}\n${data?.paidData?.CardNo}\n${numberWithCommas(Number(data?.paidData?.TrdAmt)+Number(data?.paidData?.TaxAmt))}원`
    
    const auNo = data?.paidData?.AuNo;
    const amt = Number(data?.paidData?.TrdAmt)
    const taxAmt  = +Number(data?.paidData?.TaxAmt);
    const auDate = data?.paidData?.TrdDate?.substring(0,6);
    const tradeNo = "";

    const requestCancel = async (amt,taxAmt,auDate,auNo,tradeNo) => {
        const bsnNo = await AsyncStorage.getItem("BSN_NO");
        const tidNo = await AsyncStorage.getItem("TID_NO");
        const serialNo = await AsyncStorage.getItem("SERIAL_NO");
        if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
            displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
            return;
        }
        
        var kocessAppPay = new KocesAppPay();
        kocessAppPay.cancelPayment({amt,taxAmt,auDate,auNo,tradeNo})
        .then(async (result)=>{ 
            
            console.log("result: ",result);
            props?.onCancel();
            Alert.alert(
                "",
                "취소되었습니다.",
                [{
                    text:'확인',
                }]
                );

        })
        .catch((err)=>{
            console.log("error: ",err)
            
        })
        
    }
    return(
        <>
            <OrderPayCardWrapper>
                <OrderPayCardShape>
                    <OrderPayCardText>{paidData}</OrderPayCardText>
                    <TouchableWithoutFeedback onPress={()=>{ requestCancel(amt,taxAmt,auDate,auNo,tradeNo); }} >
                        <CancleBtn>
                            <CancelText>{LANGUAGE[language]?.orderPay.payAmCancel}</CancelText>
                        </CancleBtn>
                    </TouchableWithoutFeedback>
                </OrderPayCardShape>
            </OrderPayCardWrapper>
        </>
    )
}
export default PaidDataItem;
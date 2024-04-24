import { useSelector } from "react-redux";
import { LANGUAGE } from "../../resources/strings";
import { CancelText, CancleBtn, OrderPayAmtTitle, OrderPayCardShape, OrderPayCardText, OrderPayCardWrapper } from "../../styles/popup/orderListPopupStyle";
import { numberWithCommas } from "../../utils/common";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { colorCardEnd, colorCardStart } from "../../assets/colors/color";
import { KocesAppPay } from '../../utils/payment/kocesPay';


const PaidDataItem = (props) =>{
    const {language} = useSelector(state=>state.languages);
    const data = props?.data;
    const paidData = `${data?.paidData?.InpNm}\n${data?.paidData?.CardNo}\n${numberWithCommas(Number(data?.paidData?.TrdAmt)+Number(data?.paidData?.TaxAmt))}원`
    
    const auNo = data?.paidData?.AuNo;
    const amt = Number(data?.paidData?.TrdAmt)
    const taxAmt  = +Number(data?.paidData?.TaxAmt);
    const auDate = data?.paidData?.TrdDate?.substring(0,6);
    const tradeNo = "";

    const requestCancel = () => {
        props?.onCancel();
        /* 
        var kocessAppPay = new KocesAppPay();
        kocessAppPay.cancelPayment({amt,taxAmt,auDate,auNo,tradeNo})
        .then(async (result)=>{ 
            
            console.log("result: ",result);
            
        })
        .catch((err)=>{
            console.log("error: ",err)
            
        })
 */
    }
    return(
        <>
            <OrderPayCardWrapper>
                <OrderPayCardShape>
                    <OrderPayCardText>{paidData}</OrderPayCardText>
                    <TouchableWithoutFeedback onPress={()=>{ console.log("cancel!!!!"); requestCancel(); }} >
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
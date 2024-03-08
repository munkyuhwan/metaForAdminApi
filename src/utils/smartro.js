import { NativeModules } from 'react-native'
import { BASIC_DATA, BUSINESS_NO, DEVICE_NO } from '../resources/cardReaderConstant';
import isEmpty from 'lodash';
import { hasPayError, payErrorHandler } from './errorHandler/ErrorHandler';
import { useDispatch } from 'react-redux';
import LogWriter from './logWriter';

export const serviceIndicate = async () => {
    const {SmartroPay} = NativeModules;
    const smartroData = {"service":"indicate","available":"com"};
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}
export const serviceSetting = async () =>{
    const {SmartroPay} = NativeModules;
    const smartroData = {"service":"setting","device":"dongle", "device-comm":["com","auto-detection"],"additional-device":""};
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}
export const serviceGetting = async () => {
    const {SmartroPay} = NativeModules;
    const smartroData = {"service":"getting","device":"dongle", "device-comm":["com","auto-detection"],"additional-device":""};
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}
export const serviceFunction =async (funcStr) => {
    const {SmartroPay} = NativeModules;
    const smartroData = {"service":"function","cat-id":`${DEVICE_NO}`,"business-no":`${BUSINESS_NO}`};
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify({...smartroData,...funcStr}),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}
export const servicePayment = async(dispatch, data)=>{
    const {SmartroPay} = NativeModules;
    if(hasPayError(dispatch,data)) {
        return;
    }
    const smartroData = {"service":"payment", "type":"credit", "persional-id":"01040618432", ...data, ...BASIC_DATA};
    // write log
    const lw = new LogWriter();
    const logStr = `\nPOST PAYMENT DATA==================================\nfunction:servicePayment\ndata:${JSON.stringify(smartroData)}\n`
    lw.writeLog(logStr);
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                const logErr = `\nERROR PAYMENT DATA==================================\nerrorResult:${JSON.stringify(error)}\n`
                lw.writeLog(logErr);
                reject(error);
            },
            (msg)=>{
                const logMsg = `\nMSG PAYMENT DATA==================================\nerrorResult:${JSON.stringify(msg)}\n`
                lw.writeLog(logMsg);
                resolve(msg);
            });
    })
}
export const getLastPaymentData = async(dispatch)=>{
    const {SmartroPay} = NativeModules;
    const smartroData = {"service":"function","getting-data":"last-payment",...BASIC_DATA};
    
    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}



export const varivariTest = async() =>{
    const {SmartroPay} = NativeModules;
    // 사용 가능한 통신장치 정보 확인
    //const smartroData = `{"service":"indicate","available":"com"}`;
    // auto-detection, Ftdi1

    // setting 
    //const smartroData = {"service":"setting","device":"dongle", "device-comm":["com","auto-detection"],"additional-device":""};

    // getting
    //const smartroData = {"service":"getting","device":"dongle", "device-comm":["com","auto-detection"],"additional-device":""};

    // function device-manage exchange key
    //const smartroData = {"service":"function","device-manage":"exchange-key","cat-id":DEVICE_NO,"business-no":BUSINESS_NO,}

    // function device-manage check-integrity
    //const smartroData = {"service":"function","device-manage":"check-integrity",...BASIC_DATA};

    // getting-data last-payment 
    //const smartroData = {"service":"function","getting-data":"last-payment",...BASIC_DATA};

    // service payment 결제 승인 요청
    //const smartroData = {"service":"payment", "type":"credit", "deal":"approval", "persional-id":"01040618432","total-amount":"10", ...BASIC_DATA};
    // service payment 결제 취소 요청
    //const smartroData = {"service":"payment", "type":"credit", "deal":"cancellation", "persional-id":"01040618432","total-amount":"10", "approval-no":"10556666","approval-date":"231020", ...BASIC_DATA};

    return await new Promise(function(resolve, reject){
        SmartroPay.prepareSmartroPay(
            JSON.stringify(smartroData),
            (error)=>{
                reject(error);
            },
            (msg)=>{
                resolve(msg);
            });
    })
}



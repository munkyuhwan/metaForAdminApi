import axios from "axios";
import { posErrorHandler } from "./errorHandler/ErrorHandler";
import { ADMIN_BASE_URL, ADMIN_CATEGORIES, ADMIN_ORDER_LOG, ADMIN_PAY_LOG, POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_MAIN_CAT, POS_WORK_CD_MID_CAT } from "../../resources/apiResources";
import { displayErrorPopup, metaErrorHandler } from "../errorHandler/metaErrorHandler";
import { ADMIN_API_BASE_URL } from "../../resources/newApiResource";

const posOrderHeader = {Accept: 'application/json','Content-Type': 'application/json'}
const adminOrderHeader = {'Content-Type' : "text/plain"};
// admin post order log
export const  postOrderLog = async(data) =>{
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_API_BASE_URL}${ADMIN_ORDER_LOG}`,
            data,
            adminOrderHeader,
        ) 
        .then((response => {
            //console.log("response: ",response)
            
        })) 
        .catch(error=>{
            //console.log("error: ",error)
            //reject(error.response.data)
        });
    }) 
}

// admin 메인카테고리
export const  getAdminMainCategory = async(dispatch) =>{
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_BASE_URL}${ADMIN_CATEGORIES}`,
            adminOrderHeader,
        ) 
        .then((response => {
            const data = response?.data;
            if(data?.result) {
                const goodsCategories = data?.goods_category;
                resolve(goodsCategories);     
            }else {
                displayErrorPopup(dispatch,"XXXX",`매니지 사이트에 연동할 수 없습니다.`);
                reject(error.response.data)
            }
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`매니지 사이트에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// admin 결재 로그
export const  postPayLog = async(data) =>{
    return await new Promise(function(resolve, reject){
        axios.post(
            `${ADMIN_API_BASE_URL}${ADMIN_PAY_LOG}`,
            data,
            adminOrderHeader,
        ) 
        .then((response => {
            const data = response?.data;
            if(data?.result) {
                resolve();     
            }else {
                reject()
            }
        })) 
        .catch(error=>{
            reject()
        });
    }) 
}


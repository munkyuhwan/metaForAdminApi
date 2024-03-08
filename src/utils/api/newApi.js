import axios from "axios";
import { ADMIN_API_BASE_URL, ADMIN_API_CATEGORY, ADMIN_API_GOODS } from "../../resources/newApiResource";
import { callApiWithExceptionHandling } from "./apiRequest";


const posOrderHeader = {'Content-Type' : "text/plain"};

export const getCategories = async() =>{
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_CATEGORY}`, {
          method: 'GET',
          // 필요한 경우 추가 옵션 설정
        });
        //console.log('카테고리 데이터:', data);
      } catch (error) {
        // 예외 처리
        console.error(error.message);

    }
}

export const getItems = async () =>{
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_GOODS}`, {
            
            method: 'GET',
          // 필요한 경우 추가 옵션 설정
        });
        //console.log('데이터:', data);
      } catch (error) {
        // 예외 처리
        console.error(error.message);

    }
}

export const getGoodsByStoreID = () => {
    axios.post(
        `${ADMIN_API_BASE_URL}${ADMIN_API_GOODS}`,
        {"STORE_ID":"I23113000015"},
        posOrderHeader,
    ) 
    .then((response => {
        console.log("new api result: ",response);
    })) 
    .catch(error=>{
        
    });


}
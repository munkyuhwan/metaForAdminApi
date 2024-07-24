import axios from 'axios';
import { waitFor } from '../common';
import { EventRegister } from 'react-native-event-listeners';
import { ADMIN_API_GOODS } from '../../resources/apiResources';

export async function callApiWithExceptionHandling(url,postData={}, options = {}) {
    const delayTime = 5000;
    // Axios를 사용하여 API 호출
    const uploadFunction = () =>{
      EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"데이터 요청중 입니다."});
    }
    const optData = {timeout:1000*60*1, timeoutErrorMessage:'요청시간이 초과되었습니다.', onUploadProgress:uploadFunction};
    try {
      // Axios를 사용하여 API 호출
      console.log("최초 요청");
      const response = await axios.post(url,postData, optData);
      // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
      if (response?.status < 200 || response?.status >= 300) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        throw new Error(`API 호출 실패: 상태 코드 ${response?.status}`);
      }
      //"result": true, "resultMsg": ""

      if(response?.result == false ) {
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        throw new Error(`API 호출 실패: 상태 코드 ${response?.resultMsg}`);
      }
      // 성공적인 응답 데이터 반환
      EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
      return response?.data;
    } catch (error) {
      // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
      if (error.response) {
        // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
        //throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}`);
        
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        // 재요청
        //===================================================================================================
        //throw new Error('API 응답을 받지 못했습니다.');
        // 1차 재요청
        await waitFor(delayTime);
        try {
          // Axios를 사용하여 API 호출
          console.log("1차 요청");
          const responseOne = await axios.post(url,postData, optData);
          // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
          if (responseOne?.status < 200 || responseOne?.status >= 300) {
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            throw new Error(`API 호출 실패: 상태 코드 ${responseOne?.status}`);
          }
          //"result": true, "resultMsg": ""
    
          if(responseOne?.result == false ) {
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            throw new Error(`API 호출 실패: 상태 코드 ${responseOne?.resultMsg}`);
          }
          // 성공적인 응답 데이터 반환
          EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
          return responseOne?.data;
        } catch (errorOne) {
          // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
          if (errorOne.response) {
            // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
            //throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            throw new Error(`API 호출 실패: 상태 코드 ${errorOne.response.status}`);
            
          } else if (errorOne.request) {
            // 요청이 이루어졌으나 응답을 받지 못한 경우
            // 재요청
            //===================================================================================================
            //throw new Error('API 응답을 받지 못했습니다.');
            //2차 재요청
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            await waitFor(delayTime);
            try {
              // Axios를 사용하여 API 호출
              console.log("2차 요청");
              const responseTwo = await axios.post(url,postData, optData);
              // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
              if (responseTwo?.status < 200 || responseTwo?.status >= 300) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                throw new Error(`API 호출 실패: 상태 코드 ${responseTwo?.status}`);
              }
              //"result": true, "resultMsg": ""
        
              if(responseTwo?.result == false ) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                throw new Error(`API 호출 실패: 상태 코드 ${responseTwo?.resultMsg}`);
              }
              // 성공적인 응답 데이터 반환
              EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
              return responseTwo?.data;
            } catch (errorTwo) {
              // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
              if (errorTwo.response) {
                // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
                //throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                throw new Error(`API 호출 실패: 상태 코드 ${errorTwo.response.status}`);
                
              } else if (errorTwo.request) {
                // 요청이 이루어졌으나 응답을 받지 못한 경우
                // 재요청
                //===================================================================================================
                //throw new Error('API 응답을 받지 못했습니다.');
                //3차 재요청
                await waitFor(delayTime);
                try {
                  // Axios를 사용하여 API 호출
                  console.log("3차 요청");
                  const responseThree = await axios.post(url,postData, optData);
                  // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
                  if (responseThree?.status < 200 || responseThree?.status >= 300) {
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                    throw new Error(`API 호출 실패: 상태 코드 ${responseThree?.status}`);
                  }
                  //"result": true, "resultMsg": ""
            
                  if(responseThree?.result == false ) {
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                    throw new Error(`API 호출 실패: 상태 코드 ${responseThree?.resultMsg}`);
                  }
                  // 성공적인 응답 데이터 반환
                  EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                  return responseThree?.data;
                } catch (errorThree) {
                  // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
                  if (errorThree.response) {
                    // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
                    //throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                    throw new Error(`API 호출 실패: 상태 코드 ${errorThree.response.status}`);
                    
                  } else if (errorThree.request) {
                    // 요청이 이루어졌으나 응답을 받지 못한 경우
                    // 재요청
                    //===================================================================================================
                    //throw new Error('API 응답을 받지 못했습니다.');
                    //4차 재요청
                    await waitFor(delayTime);
                    try {
                      // Axios를 사용하여 API 호출
                      console.log("4차 요청");
                      const responseFour = await axios.post(url,postData, optData);
                      // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
                      if (responseFour?.status < 200 || responseFour?.status >= 300) {
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        throw new Error(`API 호출 실패: 상태 코드 ${responseFour?.status}`);
                      }
                      //"result": true, "resultMsg": ""
                
                      if(responseFour?.result == false ) {
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        throw new Error(`API 호출 실패: 상태 코드 ${responseFour?.resultMsg}`);
                      }
                      // 성공적인 응답 데이터 반환
                      EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                      return responseFour?.data;
                    } catch (errorFour) {
                      // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
                      EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                      if (errorFour.response) {
                        // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
                        //throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
                        throw new Error(`API 호출 실패: 상태 코드 ${errorFour.response.status}`);
                        
                      } else if (errorFour.request) {
                        // 요청이 이루어졌으나 응답을 받지 못한 경우
                        // 재요청
                        //===================================================================================================
                        throw new Error('API 응답을 받지 못했습니다.');
                      } else {
                        // 요청 설정 중 발생한 오류
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        throw new Error(`API 호출 설정 오류: ${errorFour.message}`);
                      }
                    }
                  } else {
                    // 요청 설정 중 발생한 오류
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                    throw new Error(`API 호출 설정 오류: ${errorThree.message}`);
                  }
                }
                
        
        
        
        
              } else {
                // 요청 설정 중 발생한 오류
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                throw new Error(`API 호출 설정 오류: ${errorTwo.message}`);
              }
            }
    
    
    
    
          } else {
            // 요청 설정 중 발생한 오류
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            throw new Error(`API 호출 설정 오류: ${errorOne.message}`);
          }
        }




      } else {
        // 요청 설정 중 발생한 오류
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
        throw new Error(`API 호출 설정 오류: ${error.message}`);
      }
    }

}

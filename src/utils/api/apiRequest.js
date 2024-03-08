import axios from 'axios';

export async function callApiWithExceptionHandling(url,postData={}, options = {}) {
    try {
      // Axios를 사용하여 API 호출
      const response = await axios.post(url,postData, options);
  
      // 응답 상태 코드가 2xx 범위가 아니라면 예외 발생
      if (response?.status < 200 || response?.status >= 300) {
        throw new Error(`API 호출 실패: 상태 코드 ${response?.status}`);
      }
      //"result": true, "resultMsg": ""

      if(response?.result == false ) {
        throw new Error(`API 호출 실패: 상태 코드 ${response?.resultMsg}`);
      }
  
      // 성공적인 응답 데이터 반환
      return response?.data;
    } catch (error) {
      // Axios가 네트워크 에러 또는 타임아웃 등으로 인해 예외를 던졌을 경우
      if (error.response) {
        // 서버 응답이 있으며 상태 코드가 2xx 범위 밖인 경우
        throw new Error(`API 호출 실패: 상태 코드 ${error.response.status}, 메시지: ${error.response.data}`);
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        throw new Error('API 응답을 받지 못했습니다.');
      } else {
        // 요청 설정 중 발생한 오류
        throw new Error(`API 호출 설정 오류: ${error.message}`);
      }
    }
  }
  
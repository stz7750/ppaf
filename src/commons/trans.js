import axios from 'axios';

// 기본 URL 설정을 포함한 커스텀 axios 인스턴스 생성
const trans = axios.create({
  baseURL: 'http://localhost:8888',
});

// axios의 이름 변경
trans.get = (url, config) => trans.request({ ...config, method: 'get', url });
trans.post = (url, data, config) => trans.request({ ...config, method: 'post', url, data });
trans.put = (url, data, config) => trans.request({ ...config, method: 'put', url, data });
trans.delete = (url, config) => trans.request({ ...config, method: 'delete', url });

// 응답 인터셉터 추가
trans.interceptors.response.use(
  (response) => {
    // HTTP 상태 코드가 200인 경우에 "성공" 메시지를 결과에 추가
    if (response.status === 200) {
      return {
        ...response,
        message: '성공'
      };
    }
    return response;
  },
  (error) => {
    // 요청 실패 시 처리 (예: 상태 코드에 따른 오류 메시지 설정)
    return Promise.reject(error);
  }
);

export default trans;

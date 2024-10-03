import axios from 'axios';
import { store } from '../redux/store';
import { showSpinner, hideSpinner } from '../redux/spinnerSlice';
// 기본 URL 설정을 포함한 커스텀 axios 인스턴스 생성
const trans = axios.create({
	baseURL: 'http://localhost:8888',
});

const osrm = axios.create({
	baseURL: 'http://localhost:5001/route/v1/driving/126.9784,37.5665;127.0366,37.5506?overview=false',
});

// axios의 이름 변경
trans.get = (url, config) => trans.request({ ...config, method: 'get', url });
trans.post = (url, data, config) => trans.request({ ...config, method: 'post', url, data });
trans.put = (url, data, config) => trans.request({ ...config, method: 'put', url, data });
trans.delete = (url, config) => trans.request({ ...config, method: 'delete', url });

trans.interceptors.request.use(
	config => {
		const token = localStorage.getItem('authToken'); // 저장된 토큰 가져오기
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
		}
		store.dispatch(showSpinner());
		if (config.url === '/api/login') {
			const formData = new URLSearchParams();

			// data 객체를 순회하며 URLSearchParams로 변환
			for (const key in config.data) {
				formData.append(key, config.data[key]);
			}

			// 데이터를 URLSearchParams로 변환 후 헤더에 Content-Type 설정
			config.data = formData;
			config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}
		return config;
	},
	error => {
		store.dispatch(hideSpinner());
		// 요청 실패 처리
		return Promise.reject(error);
	}
);
// 응답 인터셉터 추가
trans.interceptors.response.use(
	response => {
		store.dispatch(hideSpinner());
		// HTTP 상태 코드가 200인 경우에 "성공" 메시지를 결과에 추가
		if (response.status === 200) {
			return {
				...response,
				message: '성공',
			};
		}
		return response;
	},
	error => {
		store.dispatch(hideSpinner());
		return Promise.reject(error);
	}
);

export default trans;

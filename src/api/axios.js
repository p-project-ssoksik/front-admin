// src/api/axios.js
import axios from 'axios';

// 인스턴스 생성
const instance = axios.create({
  // .env 파일에서 주소 가져옴(Vite 기준)
  baseURL: import.meta.env.VITE_API_URL, 
  
  // 요청이 5초 이상 걸리면 에러 처리 (타임아웃 설정)
  timeout: 5000, 
  
  // 기본 헤더 설정(서버에 보낼 데이터 형식 JSON으로 고정)
  headers: {
    'Content-Type': 'application/json',
  }
});

// 응답 인터셉터(에러 로그 확인용)
instance.interceptors.response.use(
  (response) => {
    // 응답이 성공적으로 오면 그대로 내보냄
    return response;
  },
  (error) => {
    // 에러가 나면 콘솔에 출력
    console.error('API 호출 에러:', error);
    return Promise.reject(error);
  }
);

export default instance;
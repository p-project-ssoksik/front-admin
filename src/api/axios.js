import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  
  timeout: 5000, 
  
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 호출 에러:', error);
    return Promise.reject(error);
  }
);

export default instance;
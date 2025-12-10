import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 외부 접속 허용
    port: 80, // 프론트엔드 포트 번호(80번 포트) 고정
    proxy: {
      // '/management'로 시작하는 요청을 백엔드(8081번 포트)로 넘김
      '/management': {
        target: 'http://3.37.92.99:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
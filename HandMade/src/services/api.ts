import axios from 'axios';

// Kiểm tra xem đang chạy ở môi trường nào
const isProduction = process.env.NODE_ENV === 'production';

const api = axios.create({
    // Nếu là production (Vercel), dùng đường dẫn tương đối '/'
    // Nếu là local, có thể dùng biến môi trường hoặc mặc định localhost
    baseURL: isProduction ? '/' : (process.env.REACT_APP_API_URL || 'http://localhost:5000'),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Log để bạn kiểm tra trên Console của trình duyệt
console.log("Current API BaseURL:", api.defaults.baseURL);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === "Network Error") {
            console.error("Lỗi kết nối API! Kiểm tra server.js trên Vercel.");
        }
        return Promise.reject(error);
    }
);

export default api;
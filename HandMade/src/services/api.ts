import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Interceptor tự động thêm .json vào cuối mỗi request
api.interceptors.request.use((config) => {
  // Ví dụ: '/products' sẽ thành '/products.json'
  // Nếu url đã có .json hoặc là url tuyệt đối thì bỏ qua
  if (config.url && !config.url.includes('.json')) {
    config.url = `${config.url}.json`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
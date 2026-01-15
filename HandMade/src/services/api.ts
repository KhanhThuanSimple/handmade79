import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Interceptor tự động thêm .json vào cuối mỗi request
api.interceptors.request.use((config) => {
  if (config.url && !config.url.includes('.json')) {
    // Tách phần query string nếu có
    const [path, query] = config.url.split('?');
    // Ghép lại theo đúng chuẩn Firebase: path + .json + query
    config.url = query ? `${path}.json?${query}` : `${path}.json`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
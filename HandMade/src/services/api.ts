import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Chỉ xử lý nếu url tồn tại và chưa có đuôi .json
  if (config.url && !config.url.includes('.json')) {
    
    // Kiểm tra xem URL có chứa tham số query (?) không
    const hasQuery = config.url.includes('?');
    
    if (hasQuery) {
      // Tách path và query: ví dụ "users?email=abc"
      const [path, query] = config.url.split('?');
      // Ghép lại thành "users.json?email=abc"
      config.url = `${path}.json?${query}`;
    } else {
      // Nếu không có query, chỉ cần thêm .json vào cuối: "products" -> "products.json"
      config.url = `${config.url}.json`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
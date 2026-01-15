import axios from 'axios';

// CRA tự động load đúng file .env theo môi trường
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Log để debug
console.log('Môi trường:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

export default api;
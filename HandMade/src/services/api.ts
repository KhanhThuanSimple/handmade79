import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Production trên Vercel
    : 'http://localhost:5000',  // Development local
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
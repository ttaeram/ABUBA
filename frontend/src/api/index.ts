import axios from 'axios';
import config from '../config/config';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
  (config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`; 
      }
      return config; 
  },
  (error) => {
      return Promise.reject(error);
  }
);


export default api;
import axios from 'axios';
import config from '../config/config';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    // withCredentials: true,
});

// //요청 인터셉터
// api.interceptors.request.use(
//     (config) => {
//       const accessToken = localStorage.getItem('accessToken');
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

// //응답 인터셉터
// api.interceptors.response.use(
// (response) => response,
// async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;
//     try {
//         const { data } = await axios.post(`${config.apiUrl}/auth/refresh-token`, {}, {
//         withCredentials: true,
//         });

//         localStorage.setItem('accessToken', data.accessToken);

//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(originalRequest);
//     } catch (refreshError) {

//         return Promise.reject(refreshError);
//     }
//     }

//     return Promise.reject(error);
// }
// );

export default api;
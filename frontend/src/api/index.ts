import axios from 'axios';
import config from '../config/config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
(response) => {
    return response;
},
(error) => {
    return Promise.reject(error);
}
);

export default api;
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
    'Content-Type': 'application/json; charset=utf-8',
    },
});

export default axiosInstance;
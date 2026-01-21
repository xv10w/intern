import axios from 'axios';

// Create axios instance with base URL and credentials
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://intern-b.onrender.com',
    withCredentials: true,
});

export default axiosInstance;

import axios from 'axios';

// Create a custom axios instance with configured defaults
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://intern-b.onrender.com',
    withCredentials: true, // Important for sending cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;

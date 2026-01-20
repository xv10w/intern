import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://intern-b.onrender.com';

// Enable credentials for cookies
axios.defaults.withCredentials = true;

export default axios;

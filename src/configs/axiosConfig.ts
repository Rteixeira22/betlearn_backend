import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
    apikey: process.env.API_KEY_ADMINS,
  },
});


export default axiosInstance;

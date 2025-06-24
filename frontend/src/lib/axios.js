import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: import.meta.env.SERVER_URL || 'https://socialapp-1-f2ri.onrender.com/api',
  withCredentials: true, // Include cookies in requests
});


/*
|--------------------------------------------------------------------------
| Axios Base Instance
|--------------------------------------------------------------------------
| - Central axios config
| - Automatically attaches token
*/

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://mainproject-4asn.onrender.com/api", // backend URL
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
     const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

  return config;
});

export default axiosInstance;

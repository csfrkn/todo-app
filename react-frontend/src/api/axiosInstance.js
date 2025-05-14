import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Response interceptor ekle
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Axios Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Request interceptor ekle
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

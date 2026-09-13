import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error messaging for offline & backend failure handling
    if (!error.response) {
      return Promise.reject({
        message: 'Backend Connection Unavailable (Network Error / Backend Offline)',
        isOffline: true,
        code: 'ERR_NETWORK',
      });
    }
    return Promise.reject({
      message: error.response.data?.message || error.message || 'API request failed',
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export default apiClient;

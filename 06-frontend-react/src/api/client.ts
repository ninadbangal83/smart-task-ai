import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth.store';

// Create a flexible axios instance
export const apiClient = axios.create({
  withCredentials: true, // Crucial for Session/Cookie based authentication
});

// Request interceptor for logging & attaching JWT tokens if present
apiClient.interceptors.request.use(
  (config) => {
    const serverUrl = useAuthStore.getState().serverUrl;
    config.baseURL = serverUrl;

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Industrial standard client-side request logging
    console.log(`%c[API Request] %c${config.method?.toUpperCase()} %c${config.url}`, 
      'color: #3b82f6; font-weight: bold;', 
      'color: #10b981; font-weight: bold;', 
      'color: #f59e0b;'
    );
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging & globally handling auth expiration or errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`%c[API Response] %c${response.status} %c${response.config.url}`, 
      'color: #10b981; font-weight: bold;', 
      'color: #3b82f6; font-weight: bold;', 
      'color: #6b7280;',
      response.data
    );

    // Capture and save X-Auth-Token from headers if the backend sent one (JWT Strategy)
    const token = response.headers['x-auth-token'];
    if (token) {
      useAuthStore.getState().setToken(token);
    }

    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data: any = error.response?.data;
    const message = data?.message || error.message || 'An unexpected error occurred';

    console.error(`%c[API Response Error] %c${status || 'NETWORK'} %c${message}`, 
      'color: #ef4444; font-weight: bold;', 
      'color: #f59e0b; font-weight: bold;', 
      'color: #6b7280;'
    );

    // Auto logout on 401 Unauthorized if previously logged in
    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new Error(message));
  }
);

import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Set up custom axios instance with interceptors
 * 
 * This configures a shared axios instance with:
 * - Base URL configuration
 * - Request and response interceptors for global error handling
 * - Toast notifications for error communication
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You could add auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      if (status === 401) {
        toast.error('جلسة منتهية. يرجى تسجيل الدخول مرة أخرى.');
        // Could redirect to login page
      } else if (status === 403) {
        toast.error('ليس لديك صلاحية للوصول إلى هذا المورد');
      } else if (status === 404) {
        toast.error('لم يتم العثور على المورد المطلوب');
      } else if (status >= 500) {
        toast.error('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا');
      } else {
        const message = error.response.data?.message || 'حدث خطأ ما';
        toast.error(message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('لا يمكن الوصول إلى الخادم. يرجى التحقق من اتصالك بالإنترنت');
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('حدث خطأ غير معروف');
    }
    
    return Promise.reject(error);
  }
);

// Add retry logic (you can implement this with axios-retry if you install the package)
const retryRequest = (originalRequest: any, retryCount = 0) => {
  // Simple retry mechanism for failed requests
  if (retryCount < 3) {
    console.log(`Retrying request (${retryCount + 1}/3)`);
    const retryRequest = { ...originalRequest };
    // Add exponential backoff
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(api(retryRequest));
      }, 1000 * Math.pow(2, retryCount));
    });
  }
  return Promise.reject(originalRequest);
};

export default api; 
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // ✅ Relative path for Vite proxy
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens with refresh
api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return Promise.reject(err);

      try {
        const res = await axios.post('/api/auth/refresh', { refreshToken }); // ✅ no full URL
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;

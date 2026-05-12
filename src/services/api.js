import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Adjust if backend runs on a different port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                const { data } = await axios.post('http://localhost:8080/auth/refresh', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });
                localStorage.setItem('token', data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh failure (e.g., logout)
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        if (error.response && error.response.status === 403) {
            console.error('Access denied (403). Please check your permissions.');
        }
        return Promise.reject(error);
    }
);

export default api;

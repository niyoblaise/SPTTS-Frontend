import api from './api';

export const authService = {
    login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },
    register: async (userData) => {
        await api.post('/auth/register', userData);
    },
    me: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },
    changePassword: async (passwordData) => {
        await api.put('/auth/change-password', passwordData);
    },
    getNotifications: async () => {
        const { data } = await api.get('/passenger/notifications/unread');
        return data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
    }
};

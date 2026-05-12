import api from './api';

export const adminService = {
    getUsers: async () => {
        const { data } = await api.get('/admin/users');
        return data;
    },
    deleteUser: async (userId) => {
        await api.delete(`/admin/users/${userId}`);
    },
    updateUser: async (userId, userData) => {
        const { data } = await api.put(`/admin/users/${userId}`, userData);
        return data;
    },
    createBus: async (busData) => {
        const { data } = await api.post('/buses', busData);
        return data;
    },
    updateBus: async (busId, busData) => {
        const { data } = await api.put(`/buses/${busId}`, busData);
        return data;
    },
    deleteBus: async (busId) => {
        await api.delete(`/buses/${busId}`);
    },
    getBuses: async () => {
        const { data } = await api.get('/buses');
        return data;
    },
    createRoute: async (routeData) => {
        const { data } = await api.post('/routes', routeData);
        return data;
    },
    createStop: async (stopData) => {
        const { data } = await api.post('/stops', stopData);
        return data;
    },
    getStops: async () => {
        const { data } = await api.get('/stops');
        return data;
    },
    updateStop: async (stopId, stopData) => {
        const { data } = await api.put(`/stops/${stopId}`, stopData);
        return data;
    },
    deleteStop: async (stopId) => {
        await api.delete(`/stops/${stopId}`);
    },
    updateRoute: async (routeId, routeData) => {
        const { data } = await api.put(`/routes/${routeId}`, routeData);
        return data;
    },
    deleteRoute: async (routeId) => {
        await api.delete(`/routes/${routeId}`);
    },
    getFares: async () => {
        const { data } = await api.get('/fares');
        return data;
    },
    createFare: async (fareData) => {
        const { data } = await api.post('/fares', fareData);
        return data;
    },
    updateFare: async (fareId, fareData) => {
        const { data } = await api.put(`/fares/${fareId}`, fareData);
        return data;
    },
    deleteFare: async (fareId) => {
        await api.delete(`/fares/${fareId}`);
    },
    getBusHistory: async (busId) => {
        const { data } = await api.get(`/gps/${busId}/history`);
        return data;
    },
    getSummaryReport: async () => {
        const { data } = await api.get('/admin/reports/summary');
        return data;
    },
    getTripReport: async (startDate, endDate) => {
        const { data } = await api.get('/admin/reports/trips', {
            params: { startDate, endDate }
        });
        return data;
    },
    getRevenueReport: async (startDate, endDate) => {
        const { data } = await api.get('/admin/reports/revenue', {
            params: { startDate, endDate }
        });
        return data;
    },
    getUserReport: async (startDate, endDate) => {
        const { data } = await api.get('/admin/reports/users', {
            params: { startDate, endDate }
        });
        return data;
    },
    getBusReport: async () => {
        const { data } = await api.get('/admin/reports/buses');
        return data;
    },
    getIncidentReport: async (startDate, endDate) => {
        const { data } = await api.get('/admin/reports/incidents', {
            params: { startDate, endDate }
        });
        return data;
    },
    getDashboardStats: async () => {
        const { data } = await api.get('/admin/dashboard/stats');
        return data;
    }
};

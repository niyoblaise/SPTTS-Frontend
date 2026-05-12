import api from './api';

export const passengerService = {
    requestBus: async (requestData) => {
        const { data } = await api.post('/passenger/request-bus', requestData);
        return data;
    },
    getFare: async (routeId) => {
        const { data } = await api.get(`/passenger/routes/${routeId}/fare`);
        return data;
    },
    trackTrip: async (tripId) => {
        const { data } = await api.get(`/passenger/trips/${tripId}/track`);
        return data;
    },
    getNotifications: async () => {
        const { data } = await api.get('/passenger/notifications/unread');
        return data;
    },
    cancelTrip: async (tripId) => {
        await api.delete(`/passenger/trips/${tripId}/cancel`);
    },
    getHistory: async () => {
        const { data } = await api.get('/passenger/trips/history');
        return data;
    },
    payTrip: async (tripId) => {
        const { data } = await api.post(`/passenger/trips/${tripId}/payment`);
        return data;
    },
    rateTrip: async (tripId, score) => {
        await api.post(`/passenger/trips/${tripId}/rate`, { score });
    },
    getBusesOnRoute: async (routeId) => {
        const { data } = await api.get(`/passenger/routes/${routeId}/buses`);
        return data;
    },
    reportIncident: async (incidentData) => {
        await api.post('/passenger/incidents', incidentData);
    }
};

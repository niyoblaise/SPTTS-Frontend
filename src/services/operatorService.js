import api from './api';

export const operatorService = {
    getMyTrips: async () => {
        const { data } = await api.get('/operator/my-trips');
        return data;
    },
    acceptTrip: async (tripId, operatorId) => {
        await api.post('/operator/accept-request', { tripId, operatorId });
    },
    markArrived: async (tripId) => {
        await api.put(`/operator/trips/${tripId}/arrived`);
    },
    markCompleted: async (tripId) => {
        await api.put(`/operator/trips/${tripId}/complete`);
    },
    updateBusStatus: async (busId, status) => {
        await api.put(`/operator/buses/${busId}/status`, null, { params: { status } });
    },
    reportIncident: async (incidentData) => {
        await api.post('/operator/incidents', incidentData);
    },
    getMyBuses: async () => {
        const { data } = await api.get('/operator/my-buses');
        return data;
    }
};

import api from './api';

export const ruraService = {
    getStats: async () => {
        const response = await api.get('/rura/stats');
        return response.data;
    },
    getIncidents: async () => {
        const response = await api.get('/rura/incidents');
        return response.data;
    },
    issueFine: async (fineData) => {
        await api.post('/rura/fines', fineData);
    },
    getAuditLogs: async () => {
        const response = await api.get('/rura/audit-logs');
        return response.data;
    },
    exportMonthlyReport: async () => {
        const response = await api.get('/rura/reports/monthly', {
            responseType: 'blob'
        });
        // Create blob link to download PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'SPTTS_Monthly_Report_' + new Date().toISOString().slice(0,7) + '.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
            if (filenameMatch && filenameMatch.length === 2) {
                filename = filenameMatch[1];
            }
        }
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return "PDF report downloaded successfully";
    },
    reviewIncident: async (id) => {
        const response = await api.put(`/rura/incidents/${id}/review`);
        return response.data;
    },
    getOperatorCompliance: async () => {
        const response = await api.get('/rura/operators/compliance');
        return response.data;
    },
    suspendOperator: async (id) => {
        const response = await api.put(`/rura/operators/${id}/suspend`);
        return response.data;
    },
    activateOperator: async (id) => {
        const response = await api.put(`/rura/operators/${id}/activate`);
        return response.data;
    }
};

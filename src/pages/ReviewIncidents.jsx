import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, Grid, Button, Chip,
    CircularProgress, Alert, Avatar
} from '@mui/material';
import { Warning, CheckCircle } from '@mui/icons-material';
import { ruraService } from '../services/ruraService';

export default function ReviewIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { loadIncidents(); }, []);

    const loadIncidents = async () => {
        try {
            const data = await ruraService.getIncidents();
            setIncidents(data);
        } catch (err) {
            console.error("Failed to load incidents", err);
            setError("Failed to load incidents.");
        } finally {
            setLoading(false);
        }
    };

    const handleReviewIncident = async (id) => {
        try {
            await ruraService.reviewIncident(id);
            setIncidents(incidents.map(inc =>
                inc.incidentId === id ? { ...inc, status: 'REVIEWED' } : inc
            ));
        } catch (err) {
            console.error("Failed to review incident", err);
            alert("Failed to update incident status.");
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>Incident Review</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor and address reported transport incidents
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                    <Warning />
                </Avatar>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {incidents.length === 0 ? (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                            <Typography variant="h5" color="text.secondary">No incidents found.</Typography>
                        </Box>
                    ) : (
                        incidents.map((incident) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={incident.incidentId}>
                                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: incident.status === 'REVIEWED' ? 'success.main' : 'error.main', width: 40, height: 40 }}>
                                            {incident.status === 'REVIEWED' ? <CheckCircle /> : <Warning />}
                                        </Avatar>
                                        <Chip
                                            label={incident.status || "PENDING"}
                                            color={incident.status === 'REVIEWED' ? "success" : "warning"}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" noWrap>{incident.type || 'General Incident'}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                        {incident.reportedAt ? new Date(incident.reportedAt).toLocaleDateString() : 'Date Unknown'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                        {incident.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Location</Typography>
                                            <Typography variant="body2">{incident.location || "Unknown"}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Bus ID</Typography>
                                            <Typography variant="body2">{incident.busId || "N/A"}</Typography>
                                        </Box>
                                    </Box>
                                    {incident.status !== 'REVIEWED' ? (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => handleReviewIncident(incident.incidentId)}
                                        >
                                            Mark as Reviewed
                                        </Button>
                                    ) : (
                                        <Button fullWidth variant="outlined" color="success" disabled startIcon={<CheckCircle />}>
                                            Reviewed
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Container>
    );
}

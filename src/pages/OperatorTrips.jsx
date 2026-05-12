import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid, Button, CircularProgress, Alert, Container, IconButton, Divider, Stack, Avatar, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { operatorService } from '../services/operatorService';
import { Person, Email, DirectionsBus, Refresh, CheckCircle, Schedule, Map } from '@mui/icons-material';

export default function OperatorTrips() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTrips();
        const interval = setInterval(loadTrips, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        try {
            const [tripsData, busesData] = await Promise.all([operatorService.getMyTrips(), operatorService.getMyBuses()]);
            if (busesData.length === 0) { setError("You have no buses assigned."); setBuses([]); }
            else { setTrips(tripsData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))); setBuses(busesData); setError(''); }
        } catch (err) { console.error(err); setError("Failed to load your trips."); }
        finally { setLoading(false); }
    };

    const handleStatusUpdate = async (tripId, action) => {
        try {
            if (action === 'arrived') await operatorService.markArrived(tripId);
            else if (action === 'complete') await operatorService.markCompleted(tripId);
            loadTrips();
        } catch (err) { console.error(err); alert("Failed to update trip status"); }
    };

    const handleAccept = async (tripId) => {
        if (!user?.userId) { alert("User ID not found."); return; }
        try { await operatorService.acceptTrip(tripId, user.userId); loadTrips(); }
        catch (err) { console.error(err); alert("Failed to accept trip"); }
    };

    const getStatusColor = (status) => {
        switch (status) { case 'TRIP_COMPLETED': return 'success'; case 'REQUESTED': return 'info'; case 'CONFIRMATION': return 'warning'; case 'SOON_TO_ARRIVE': return 'primary'; default: return 'default'; }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} /><Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading trips...</Typography>
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(45deg, #EC4899 30%, #8B5CF6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        My Trips
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Manage your assigned trips and new requests
                        <Chip label="LIVE" size="small" color="error" sx={{ height: 20, fontWeight: 'bold', animation: 'pulse 2s infinite' }} />
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="text.secondary">Monitoring Routes:</Typography>
                        {[...new Set(buses.map(b => b.routeName))].length > 0
                            ? [...new Set(buses.map(b => b.routeName))].map(route => <Chip key={route} label={route} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />)
                            : <Typography variant="body2" color="error">None (Please assign a bus)</Typography>}
                    </Box>
                </Box>
                <IconButton onClick={loadTrips} color="primary" sx={{ bgcolor: 'rgba(236,72,153,0.1)', width: 48, height: 48 }}><Refresh /></IconButton>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            {trips.length === 0 ? (
                <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <DirectionsBus sx={{ fontSize: 80, mb: 2, color: 'text.disabled' }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>No trips found</Typography>
                    <Typography variant="body2" color="text.disabled">New requests will appear here when passengers request a ride.</Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {trips.map((trip) => (
                        <Paper key={trip.tripId} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' } }}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 40, height: 40 }}><DirectionsBus color="primary" /></Avatar>
                                            <Typography variant="h6" fontWeight="bold">Trip #{trip.tripId?.substring(0, 8)}</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={3} sx={{ mt: 1, color: 'text.secondary' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Schedule sx={{ fontSize: 18 }} />
                                                <Typography variant="body2" fontWeight="500">{new Date(trip.startTime).toLocaleString()}</Typography>
                                            </Box>
                                            {trip.route && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Map sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2" color="primary.main" fontWeight="600">{trip.route.routeName}</Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                    <Chip label={trip.status.replace(/_/g, ' ')} color={getStatusColor(trip.status)} sx={{ fontWeight: 700, borderRadius: 2, height: 32 }} />
                                </Box>

                                <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 2.5, borderRadius: 3, mb: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, letterSpacing: 1, fontWeight: 600 }}>PASSENGER DETAILS</Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}><Person /></Avatar>
                                                <Box><Typography variant="caption" color="text.secondary">Name</Typography><Typography variant="body1" fontWeight="600">{trip.passengerName || 'Unknown'}</Typography></Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'info.main' }}><Email /></Avatar>
                                                <Box><Typography variant="caption" color="text.secondary">Email</Typography><Typography variant="body1" fontWeight="600">{trip.passengerEmail || 'No Email'}</Typography></Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    {trip.status === 'REQUESTED' && <Button variant="contained" size="large" onClick={() => handleAccept(trip.tripId)} startIcon={<CheckCircle />} sx={{ borderRadius: 2, px: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>Accept Request</Button>}
                                    {trip.status === 'CONFIRMATION' && <Button variant="contained" color="warning" size="large" onClick={() => handleStatusUpdate(trip.tripId, 'arrived')} startIcon={<DirectionsBus />} sx={{ borderRadius: 2, px: 4 }}>Mark Arrived</Button>}
                                    {trip.status === 'SOON_TO_ARRIVE' && <Button variant="contained" color="success" size="large" onClick={() => handleStatusUpdate(trip.tripId, 'complete')} startIcon={<CheckCircle />} sx={{ borderRadius: 2, px: 4 }}>Complete Trip</Button>}
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Container>
    );
}

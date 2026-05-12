import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, Container, Paper, Alert } from '@mui/material';
import { DirectionsBus, NotificationsActive, ArrowForward, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { operatorService } from '../services/operatorService';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const pingIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const KIGALI = { lat: -1.9397, lng: 30.0444 };

export default function OperatorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map) { setTimeout(() => map.invalidateSize(), 300); }
    }, [map]);

    useEffect(() => {
        const handleResize = () => map?.invalidateSize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [map]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await operatorService.getMyTrips();
                setRequests(data.filter(t => t.status === 'REQUESTED').map(t => ({
                    ...t,
                    lat: KIGALI.lat + (Math.random() * 0.02 - 0.01),
                    lng: KIGALI.lng + (Math.random() * 0.02 - 0.01)
                })));
            } catch (e) { console.error("Failed to fetch requests", e); }
        };
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (tripId) => {
        if (!user?.userId) { alert("User ID not found. Please relogin."); return; }
        setRequests(prev => prev.filter(r => r.tripId !== tripId));
        try {
            await operatorService.acceptTrip(tripId, user.userId);
            const data = await operatorService.getMyTrips();
            setRequests(data.filter(t => t.status === 'REQUESTED').map(t => ({
                ...t, lat: KIGALI.lat + (Math.random() * 0.02 - 0.01), lng: KIGALI.lng + (Math.random() * 0.02 - 0.01)
            })));
        } catch (err) { console.error("Accept failed", err); setError("Failed to accept trip."); }
    };

    const actions = [
        { title: 'My Trips', desc: 'View requests and active trips', icon: <DirectionsBus fontSize="large" />, path: '/operator/trips', color: '#EC4899' },
        { title: 'Notifications', desc: 'Check updates on your requests', icon: <NotificationsActive fontSize="large" />, path: '/notifications', color: '#F59E0B' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome back, {user?.fullName?.split(' ')[0]}!
                </Typography>
                <Typography variant="h6" color="text.secondary">Manage your trips and see live passenger requests.</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                <Grid size={12}>
                    <Grid container spacing={3}>
                        {actions.map((action) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={action.title}>
                                <Card sx={{ height: '100%', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', cursor: 'pointer', boxShadow: `0 10px 30px ${action.color}40` } }}
                                    onClick={() => navigate(action.path)}>
                                    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: `${action.color}20`, color: action.color, width: 64, height: 64, mb: 1 }}>{action.icon}</Avatar>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>{action.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{action.desc}</Typography>
                                        </Box>
                                        <Button endIcon={<ArrowForward />} sx={{ mt: 'auto', color: action.color, p: 0, '&:hover': { bgcolor: 'transparent' } }}>Go Now</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid size={12}>
                    <Paper sx={{ borderRadius: 4, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ height: '500px', width: '100%' }}>
                            <MapContainer ref={setMap} center={[KIGALI.lat, KIGALI.lng]} zoom={13} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                                {requests.map((req) => (
                                    <Marker key={req.tripId} position={[req.lat, req.lng]} icon={pingIcon}>
                                        <Popup>
                                            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                                                <Avatar sx={{ width: 32, height: 32, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}><Person fontSize="small" /></Avatar>
                                                <Typography variant="subtitle2" fontWeight="bold">{req.passengerName || 'Passenger'}</Typography>
                                                <Button size="small" variant="contained" color="success" sx={{ mt: 1 }} onClick={() => handleAccept(req.tripId)}>Accept</Button>
                                            </Box>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                        <Box sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', borderRadius: 2, px: 2, py: 1, zIndex: 900 }}>
                            <Typography variant="subtitle2" color="white" fontWeight="bold">Live Requests — Kigali</Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">{requests.length} passenger{requests.length !== 1 ? 's' : ''} nearby</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

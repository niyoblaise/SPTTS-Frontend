import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    MenuItem,
    Alert,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    CircularProgress,
    Container
} from '@mui/material';
import { Route as RouteIcon, Place, DirectionsBus, Search } from '@mui/icons-material';
import { passengerService } from '../services/passengerService';
import api from '../services/api';

export default function RequestBus() {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [buses, setBuses] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedStop, setSelectedStop] = useState('');
    const [selectedBus, setSelectedBus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchRoutes() {
            try {
                const { data } = await api.get('/routes');
                setRoutes(data);
            } catch (e) {
                console.error("Failed to load routes", e);
                setError("Failed to load routes.");
            }
        }
        fetchRoutes();
    }, []);

    const handleRouteChange = async (routeId) => {
        setSelectedRoute(routeId);
        setSelectedStop('');
        setSelectedBus('');
        setBuses([]);
        setStops([]);

        try {
            const { data: stopsData } = await api.get(`/routes/${routeId}/stops`);
            setStops(stopsData);

            const { data: busesData } = await api.get(`/buses/route/${routeId}`);
            setBuses(busesData);
        } catch (e) {
            console.error("Failed to load stops/buses", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const requestPayload = {
                routeId: selectedRoute,
                destinationStopId: selectedStop,
                busId: (selectedBus && selectedBus !== "" && selectedBus !== "undefined") ? selectedBus : null
            };
            console.log("Sending request payload:", requestPayload);

            const trip = await passengerService.requestBus(requestPayload);
            navigate('/track-trip/active');
        } catch (err) {
            console.error("Request bus error:", err);
            setError(err.response?.data?.message || err.message || 'Failed to request bus. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: 'text.primary' }}>
                    Request a Bus
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Choose your route to begin your journey
                </Typography>
            </Box>

            <Card sx={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                borderRadius: 3,
                bgcolor: 'background.paper'
            }}>
                <CardContent sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Select Route</InputLabel>
                            <Select
                                value={selectedRoute}
                                label="Select Route"
                                onChange={(e) => handleRouteChange(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <RouteIcon color="action" />
                                    </InputAdornment>
                                }
                            >
                                {routes.map((route) => (
                                    <MenuItem key={route.routeId} value={route.routeId}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <Typography fontWeight="bold">{route.routeName}</Typography>
                                                <Typography color="text.secondary" variant="body2">
                                                    {route.price ? route.price.toLocaleString() : 0} RWF
                                                </Typography>
                                            </Box>
                                            {(route.startStop || route.destinationStop) && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {route.startStop || '?'} ➝ {route.destinationStop || '?'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth disabled={!selectedRoute}>
                            <InputLabel>Destination Stop (Optional)</InputLabel>
                            <Select
                                value={selectedStop}
                                label="Destination Stop (Optional)"
                                onChange={(e) => setSelectedStop(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Place color={!selectedRoute ? "disabled" : "action"} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">
                                    <em>Any Stop / Not Decided</em>
                                </MenuItem>
                                {stops.map((stop) => (
                                    <MenuItem key={stop.stopId} value={stop.stopId}>
                                        {stop.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth disabled={!selectedRoute}>
                            <InputLabel>Select Bus (Optional)</InputLabel>
                            <Select
                                value={selectedBus}
                                label="Select Bus (Optional)"
                                onChange={(e) => setSelectedBus(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <DirectionsBus color={!selectedRoute ? "disabled" : "action"} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">
                                    <em>Any Bus</em>
                                </MenuItem>
                                {buses.map((bus) => (
                                    <MenuItem key={bus.id} value={bus.id}>
                                        {bus.plateNumber} ({bus.status})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading || !selectedRoute}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                            sx={{
                                height: 50,
                                mt: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            {loading ? 'Requesting...' : 'Find Bus'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
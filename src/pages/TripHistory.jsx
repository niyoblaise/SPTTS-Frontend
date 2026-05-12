import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    Container,
    IconButton,
    CircularProgress,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Refresh,
    DirectionsBus,
    AttachMoney,
    Star,
    AccessTime,
    CalendarToday,
    Map
} from '@mui/icons-material';
import { passengerService } from '../services/passengerService';

export default function TripHistory() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await passengerService.getHistory();
            // Sort by date descending
            const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setTrips(sortedData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TRIP_COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            case 'REQUESTED': return 'info';
            case 'CONFIRMATION': return 'warning';
            case 'SOON_TO_ARRIVE': return 'primary';
            default: return 'default';
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ');
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                    <Typography variant="h4" fontWeight="700" gutterBottom>
                        Trip History
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        View and manage your past and current trips
                    </Typography>
                </Box>
                <IconButton onClick={loadHistory} color="primary" sx={{ bgcolor: 'action.hover' }}>
                    <Refresh />
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : trips.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                    <DirectionsBus sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">No trips found</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/request-bus')}
                    >
                        Request a Trip
                    </Button>
                </Box>
            ) : (
                <Stack spacing={3}>
                    {trips.map((trip) => (
                        <Card
                            key={trip.tripId}
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            Trip #{trip.tripId.substring(0, 8)}
                                        </Typography>
                                        <Stack direction="row" spacing={2} sx={{ mt: 1, color: 'text.secondary' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarToday sx={{ fontSize: 16 }} />
                                                <Typography variant="body2">
                                                    {new Date(trip.startTime).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 16 }} />
                                                <Typography variant="body2">
                                                    {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Chip
                                        label={formatStatus(trip.status)}
                                        color={getStatusColor(trip.status)}
                                        size="small"
                                        sx={{ fontWeight: 600, borderRadius: 1 }}
                                    />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                            FARE
                                        </Typography>
                                        <Typography variant="h6" fontWeight="600" color="primary.main">
                                            {trip.fare ? trip.fare.toLocaleString() : 0} RWF
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1}>
                                        {/* Pay Button */}
                                        {!trip.isPaid && (trip.status === 'TRIP_COMPLETED' || trip.status === 'SOON_TO_ARRIVE') && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<AttachMoney />}
                                                onClick={() => navigate(`/pay/${trip.tripId}`, { state: { trip: trip } })}
                                                size="small"
                                            >
                                                Pay
                                            </Button>
                                        )}

                                        {/* Track Button */}
                                        {['REQUESTED', 'CONFIRMATION', 'SOON_TO_ARRIVE'].includes(trip.status) && (
                                            <Button
                                                variant="contained"
                                                color="info"
                                                startIcon={<Map />}
                                                onClick={() => navigate(`/track-trip/${trip.tripId}`)}
                                                size="small"
                                            >
                                                Track
                                            </Button>
                                        )}

                                        {/* Rate Button */}
                                        {trip.rating === null && trip.status === 'TRIP_COMPLETED' && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<Star />}
                                                onClick={() => navigate(`/rate-trip/${trip.tripId}`)}
                                                size="small"
                                            >
                                                Rate
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
    );
}
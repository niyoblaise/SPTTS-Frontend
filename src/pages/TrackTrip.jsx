import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Button
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { passengerService } from '../services/passengerService';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// Component to update map center when coordinates change
function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

export default function TrackTrip() {
    const { tripId } = useParams();
    const [tripStatus, setTripStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                let currentTripId = tripId;

                if (tripId === 'active') {
                    const history = await passengerService.getHistory();
                    // Sort by startTime descending to get the latest trip
                    history.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

                    const activeTrip = history.find(t =>
                        ['REQUESTED', 'CONFIRMATION', 'SOON_TO_ARRIVE', 'TRIP_COMPLETED'].includes(t.status)
                    );

                    if (activeTrip) {
                        currentTripId = activeTrip.tripId;
                    } else {
                        setError("No active trip found.");
                        setLoading(false);
                        return;
                    }
                }

                const status = await passengerService.trackTrip(currentTripId);
                console.log("Fetched Trip Status:", status);
                setTripStatus(status);
                setLoading(false);
            } catch (err) {
                console.error("Tracking error:", err);
                setError("Failed to track trip.");
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [tripId]);

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Finding your trip...</Typography>
        </Box>
    );

    if (error) return (
        <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600, textAlign: 'center' }}>
            <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
            {error.includes("No active trip") && (
                <Button variant="contained" color="primary" href="/request-bus">
                    Request a Bus
                </Button>
            )}
        </Box>
    );

    if (tripStatus?.status === 'WAITING_FOR_APPROVAL') {
        return (
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
                    <CircularProgress size={60} sx={{ mb: 4, color: 'warning.main' }} />
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Waiting for Operator
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your request has been sent. Please wait for an operator to accept your trip.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                        Status: <strong>Pending Approval</strong>
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
                Track Your Trip
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Trip Details Card */}
                <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 350px' } }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main', mb: 3 }}>
                                Trip Details
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">STATUS</Typography>
                                    <Typography variant="body1" fontWeight="500">{tripStatus?.status || 'Loading...'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">BUS PLATE</Typography>
                                    <Typography variant="body1" fontWeight="500">{tripStatus?.busPlate || 'Assigning...'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">ESTIMATED ARRIVAL</Typography>
                                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                                        {tripStatus?.etaMinutes !== undefined && tripStatus.etaMinutes >= 0 ? `${tripStatus.etaMinutes} min` : 'Calculating...'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">DISTANCE</Typography>
                                        <Typography variant="body1">{tripStatus?.distance !== undefined ? `${tripStatus.distance.toFixed(2)} km` : '...'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">FARE</Typography>
                                        <Typography variant="body1">{tripStatus?.fare ? `${tripStatus.fare} RWF` : '...'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Map Container */}
                <Box sx={{ flex: 1, minHeight: '500px' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            height: '100%',
                            minHeight: '500px',
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: 3,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative'
                        }}
                    >
                        {tripStatus?.currentLocation &&
                            typeof tripStatus.currentLocation.latitude === 'number' &&
                            typeof tripStatus.currentLocation.longitude === 'number' ? (
                            <MapContainer
                                center={[tripStatus.currentLocation.latitude, tripStatus.currentLocation.longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%', minHeight: '500px' }}
                            >
                                <RecenterMap lat={tripStatus.currentLocation.latitude} lng={tripStatus.currentLocation.longitude} />
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    position={[tripStatus.currentLocation.latitude, tripStatus.currentLocation.longitude]}
                                    icon={busIcon}
                                >
                                    <Popup>
                                        <Typography variant="subtitle2" fontWeight="bold">Bus Location</Typography>
                                        <Typography variant="body2">Speed: {tripStatus.currentLocation.speed} km/h</Typography>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                bgcolor: 'background.paper',
                                color: 'text.secondary'
                            }}>
                                <CircularProgress size={40} sx={{ mb: 2 }} />
                                <Typography>Waiting for bus location...</Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}

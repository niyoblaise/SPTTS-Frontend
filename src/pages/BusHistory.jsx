import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Container,
    Alert
} from '@mui/material';
import { History, DirectionsBus } from '@mui/icons-material';
import { adminService } from '../services/adminService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

export default function BusHistory() {
    const { busId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHistory();
    }, [busId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await adminService.getBusHistory(busId);
            setHistory(data);
        } catch (e) {
            console.error("Failed to load bus history", e);
            setError("Failed to load bus location history.");
        } finally {
            setLoading(false);
        }
    };

    const pathCoordinates = history.map(loc => [loc.latitude, loc.longitude]);
    const center = pathCoordinates.length > 0 ? pathCoordinates[0] : [-1.9441, 30.0619]; // Default to Kigali

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Bus Location History
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Visualizing past movements for Bus ID: {busId?.substring(0, 8)}
                </Typography>
            </Box>

            <Paper sx={{
                height: '70vh',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative'
            }}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Box sx={{ p: 4 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && !error && (
                    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {history.length > 0 && (
                            <>
                                <Polyline positions={pathCoordinates} color="#2196F3" weight={4} opacity={0.7} />
                                <Marker position={pathCoordinates[0]} icon={busIcon}>
                                    <Popup>Start Point<br />{new Date(history[0].timestamp).toLocaleString()}</Popup>
                                </Marker>
                                <Marker position={pathCoordinates[pathCoordinates.length - 1]} icon={busIcon}>
                                    <Popup>Latest Point<br />{new Date(history[history.length - 1].timestamp).toLocaleString()}</Popup>
                                </Marker>
                            </>
                        )}
                    </MapContainer>
                )}
            </Paper>
        </Container>
    );
}

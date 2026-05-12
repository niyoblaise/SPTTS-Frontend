import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { DirectionsBus } from '@mui/icons-material';
import { passengerService } from '../services/passengerService';

export default function BusesOnRoute() {
    const { routeId } = useParams();
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        loadBuses();
    }, [routeId]);

    const loadBuses = async () => {
        try {
            const data = await passengerService.getBusesOnRoute(routeId);
            setBuses(data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Buses on Route
            </Typography>

            <Grid container spacing={3}>
                {buses.map((bus) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bus.id}>
                        <Card>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <DirectionsBus fontSize="large" color="primary" />
                                <Box>
                                    <Typography variant="h6">{bus.plateNumber}</Typography>
                                    <Chip
                                        label={bus.status}
                                        size="small"
                                        color={bus.status === 'ON_ROUTE' ? 'success' : 'default'}
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
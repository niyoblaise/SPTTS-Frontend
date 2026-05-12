import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Container,
    useTheme,
    Button
} from '@mui/material';
import {
    DirectionsBus,
    People,
    LocalShipping,
    AdminPanelSettings,
    ArrowForward,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [operators, setOperators] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, busesData, routesData] = await Promise.all([
                adminService.getUsers(),
                adminService.getBuses(),
                api.get('/routes')
            ]);

            setUsers(usersData);
            setBuses(busesData);
            setRoutes(routesData.data);

            const ops = usersData.filter(u => u.userType === 'BUS_OPERATOR' || u.userType === 'SYSTEM_ADMIN');
            setOperators(ops);
        } catch (e) {
            console.error("Failed to load dashboard data", e);
        }
    };

    const StatCard = ({ title, value, icon, color, path }) => (
        <Card
            sx={{
                height: '100%',
                borderRadius: 4,
                background: `linear-gradient(135deg, ${color} 0%, ${theme.palette.background.paper} 150%)`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                cursor: path ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                }
            }}
            onClick={() => path && navigate(path)}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 1, opacity: 0.8 }}>
                            {title.toUpperCase()}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: 'text.primary' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'text.primary', width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
                {path && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Typography variant="body2">View Details</Typography>
                        <ArrowForward fontSize="small" />
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                    background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Overview of system performance and management
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Users" value={users.length} icon={<People />} color="rgba(33, 150, 243, 0.1)" path="/admin/users" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Buses" value={buses.length} icon={<DirectionsBus />} color="rgba(156, 39, 176, 0.1)" path="/admin/fleet" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Active Routes" value={routes.length} icon={<LocalShipping />} color="rgba(0, 191, 166, 0.1)" path="/create-route" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Operators" value={operators.length} icon={<AdminPanelSettings />} color="rgba(255, 152, 0, 0.1)" path="/admin/users" />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)', border: '1px solid rgba(33, 150, 243, 0.2)', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.02)' } }} onClick={() => navigate('/create-route')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}><LocalShipping /></Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Create New Route</Typography>
                                <Typography variant="body2" color="text.secondary">Define new paths and assign prices</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)', border: '1px solid rgba(255, 152, 0, 0.2)', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.02)' } }} onClick={() => navigate('/create-stop')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'warning.main' }}><DirectionsBus /></Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Add Bus Stop</Typography>
                                <Typography variant="body2" color="text.secondary">Expand your network with new stops</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(186, 104, 200, 0.1) 100%)', border: '1px solid rgba(156, 39, 176, 0.2)', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.02)' } }} onClick={() => navigate('/admin/reports')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main' }}><TrendingUpIcon /></Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">View Reports</Typography>
                                <Typography variant="body2" color="text.secondary">Analytics and data export</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

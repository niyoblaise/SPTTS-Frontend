import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Alert,
    Container,
    Paper,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import api from '../services/api';
import { Place, DirectionsBus, FormatListNumbered, Add, Signpost } from '@mui/icons-material';

export default function CreateBusStop() {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({
        routeId: '',
        name: '',
        latitude: '',
        longitude: '',
        stopOrder: ''
    });
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await adminService.createStop({
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                stopOrder: parseInt(formData.stopOrder)
            });
            // Reset form or navigate
            setFormData({ ...formData, name: '', latitude: '', longitude: '', stopOrder: '' });
            alert('Bus stop created successfully!');
        } catch (err) {
            console.error("Create stop error:", err);
            setError(err.response?.data?.message || 'Failed to create bus stop.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="800" gutterBottom sx={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    letterSpacing: '-0.02em'
                }}>
                    Create Bus Stop
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                    Add a new stop to an existing route to improve connectivity
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    bgcolor: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background element */}
                <Box sx={{
                    position: 'absolute',
                    top: -100,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0
                }} />

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 4,
                            borderRadius: 2,
                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                            color: '#ffcdd2',
                            border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'grid', gap: 4 }}>
                        <TextField
                            select
                            label="Select Route"
                            name="routeId"
                            fullWidth
                            required
                            variant="outlined"
                            value={formData.routeId}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DirectionsBus sx={{ color: 'warning.main' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: 'warning.main' }
                                }
                            }}
                        >
                            {routes.map((route) => (
                                <MenuItem key={route.routeId} value={route.routeId}>
                                    {route.routeName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Stop Name"
                            name="name"
                            fullWidth
                            required
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Central Station"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Signpost sx={{ color: 'warning.main' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: 'warning.main' }
                                }
                            }}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <TextField
                                label="Latitude"
                                name="latitude"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.latitude}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Place sx={{ color: 'warning.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        '&.Mui-focused fieldset': { borderColor: 'warning.main' }
                                    }
                                }}
                            />
                            <TextField
                                label="Longitude"
                                name="longitude"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.longitude}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Place sx={{ color: 'warning.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        '&.Mui-focused fieldset': { borderColor: 'warning.main' }
                                    }
                                }}
                            />
                        </Box>

                        <TextField
                            label="Stop Order"
                            name="stopOrder"
                            type="number"
                            fullWidth
                            required
                            helperText="Order in the route (e.g., 1, 2, 3)"
                            variant="outlined"
                            value={formData.stopOrder}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FormatListNumbered sx={{ color: 'warning.main' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: 'warning.main' }
                                },
                                '& .MuiFormHelperText-root': {
                                    color: 'text.secondary'
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
                            sx={{
                                height: 56,
                                mt: 2,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                                    background: 'linear-gradient(135deg, #f57c00 0%, #e64a19 100%)',
                                }
                            }}
                        >
                            {loading ? 'Creating Stop...' : 'Create Stop'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

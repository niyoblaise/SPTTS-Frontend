import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Container, Paper, InputAdornment, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { DirectionsBus, Description, Place, Add } from '@mui/icons-material';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        bgcolor: 'rgba(255,255,255,0.03)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    }
};

export default function CreateRoute() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        routeName: '', description: '', endStopLatitude: '', endStopLongitude: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await adminService.createRoute({
                ...formData,
                endStopLatitude: parseFloat(formData.endStopLatitude),
                endStopLongitude: parseFloat(formData.endStopLongitude)
            });
            navigate('/admin/routes');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create route.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                Create New Route
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                Define a new bus route to expand the network
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider' }}>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Route Name" name="routeName" fullWidth required variant="outlined"
                        value={formData.routeName} onChange={handleChange}
                        placeholder="e.g., Downtown Express"
                        InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsBus color="primary" /></InputAdornment> }}
                        sx={fieldSx}
                    />
                    <TextField
                        label="Description" name="description" fullWidth multiline rows={3} variant="outlined"
                        value={formData.description} onChange={handleChange}
                        placeholder="Brief description of the route..."
                        InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: 1.5, alignSelf: 'flex-start' }}><Description color="primary" /></InputAdornment> }}
                        sx={fieldSx}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                        <TextField
                            label="End Stop Latitude" name="endStopLatitude" type="number" fullWidth required variant="outlined"
                            value={formData.endStopLatitude} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Place color="primary" /></InputAdornment> }}
                            sx={fieldSx}
                        />
                        <TextField
                            label="End Stop Longitude" name="endStopLongitude" type="number" fullWidth required variant="outlined"
                            value={formData.endStopLongitude} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Place color="primary" /></InputAdornment> }}
                            sx={fieldSx}
                        />
                    </Box>
                    <Button
                        type="submit" variant="contained" size="large" fullWidth disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                        sx={{ height: 48, borderRadius: 1, mt: 1 }}
                    >
                        {loading ? 'Creating Route...' : 'Create Route'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DirectionsBus, LocationOn, Schedule } from '@mui/icons-material';
import { authService } from '../services/authService';

const inputSx = { sx: { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } } };
const labelSx = { sx: { color: 'text.secondary' } };

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', userType: 'PASSENGER' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(form);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
        finally { setLoading(false); }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
            <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0, 191, 166, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', animation: 'float 12s infinite ease-in-out' }} />
            <Box sx={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(108, 99, 255, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', animation: 'float 15s infinite ease-in-out reverse' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', px: 2, zIndex: 1 }}>
                <Box sx={{ display: 'flex', width: '100%', maxWidth: 1100, minHeight: 600, borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', bgcolor: 'rgba(30, 41, 59, 0.6)' }}>
                    <Box sx={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 191, 166, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)', p: 6, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                        <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                        <DirectionsBus sx={{ fontSize: 100, mb: 4, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
                        <Typography variant="h3" fontWeight="800" gutterBottom textAlign="center" sx={{ letterSpacing: 1 }}>Join SPTTS</Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, textAlign: 'center', fontWeight: 500 }}>Smart Public Transport Tracking System</Typography>
                        <Box sx={{ mt: 4, width: '100%', maxWidth: 350 }}>
                            {[{ icon: <LocationOn sx={{ mr: 2, fontSize: 32, opacity: 0.9 }} />, title: 'Real-time Tracking', desc: 'Know exactly where your bus is' },
                            { icon: <Schedule sx={{ mr: 2, fontSize: 32, opacity: 0.9 }} />, title: 'Smart Scheduling', desc: 'Plan your journey efficiently' },
                            { icon: <DirectionsBus sx={{ mr: 2, fontSize: 32, opacity: 0.9 }} />, title: 'Easy Payments', desc: 'Seamless fare management' }].map((item) => (
                                <Box key={item.title} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    {item.icon}
                                    <Box><Typography variant="subtitle1" fontWeight="700">{item.title}</Typography><Typography variant="body2" sx={{ opacity: 0.8 }}>{item.desc}</Typography></Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Card sx={{ flex: 1, borderRadius: 0, boxShadow: 'none', bgcolor: 'transparent', display: 'flex', alignItems: 'center' }}>
                        <CardContent sx={{ width: '100%', p: { xs: 4, sm: 6 } }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>Create Account</Typography>
                                <Typography variant="body1" color="text.secondary">Join the smart transport network today</Typography>
                            </Box>
                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#ff8a80' }}>{error}</Alert>}
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField label="Full Name" name="fullName" required fullWidth value={form.fullName} onChange={handleChange} InputProps={inputSx} InputLabelProps={labelSx} />
                                <TextField label="Email Address" name="email" type="email" required fullWidth value={form.email} onChange={handleChange} InputProps={inputSx} InputLabelProps={labelSx} />
                                <TextField label="Phone Number" name="phone" required fullWidth value={form.phone} onChange={handleChange} InputProps={inputSx} InputLabelProps={labelSx} />
                                <TextField label="Password" name="password" type="password" required fullWidth value={form.password} onChange={handleChange} InputProps={inputSx} InputLabelProps={labelSx} />
                                <TextField select label="I am a..." name="userType" value={form.userType} onChange={handleChange} fullWidth InputProps={inputSx} InputLabelProps={labelSx}>
                                    <MenuItem value="PASSENGER">Passenger</MenuItem>
                                    <MenuItem value="BUS_OPERATOR">Bus Operator</MenuItem>
                                    <MenuItem value="REGULATOR">Government Regulator (RURA)</MenuItem>
                                    <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>
                                </TextField>
                                <Button type="submit" variant="contained" size="large" disabled={loading}
                                    sx={{ mt: 2, height: 56, fontSize: '1.1rem', fontWeight: 600, borderRadius: 2, background: 'linear-gradient(45deg, #00BFA6 30%, #6C63FF 90%)' }}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </Box>
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" sx={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Sign In</Link>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}

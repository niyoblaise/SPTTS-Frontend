import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert, InputAdornment, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, DirectionsBus } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const inputSx = { sx: { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } } };
const labelSx = { sx: { color: 'text.secondary' } };

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(form);
            login({ ...data.user, token: data.accessToken });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refresh', data.refreshToken);
            const routes = { REGULATOR: '/rura/dashboard', BUS_OPERATOR: '/operator/dashboard', SYSTEM_ADMIN: '/admin' };
            navigate(routes[data.user.userType] || '/');
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
        finally { setLoading(false); }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
            <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', animation: 'float 10s infinite ease-in-out' }} />
            <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0,191,166,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', animation: 'float 15s infinite ease-in-out reverse' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', px: 2, zIndex: 1 }}>
                <Box sx={{ display: 'flex', width: '100%', maxWidth: 1000, minHeight: 600, borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', bgcolor: 'rgba(30,41,59,0.6)' }}>
                    <Box sx={{ flex: 1, background: 'linear-gradient(135deg, rgba(108,99,255,0.9) 0%, rgba(37,99,235,0.9) 100%)', p: 6, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                        <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                        <DirectionsBus sx={{ fontSize: 100, mb: 4, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
                        <Typography variant="h3" fontWeight="800" gutterBottom textAlign="center" sx={{ letterSpacing: 1 }}>SPTTS</Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, textAlign: 'center', fontWeight: 500 }}>Smart Public Transport Tracking System</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'center', maxWidth: 350, lineHeight: 1.6 }}>Experience the future of public transit. Real-time tracking, seamless payments, and smart scheduling.</Typography>
                    </Box>
                    <Card sx={{ flex: 1, borderRadius: 0, boxShadow: 'none', bgcolor: 'transparent', display: 'flex', alignItems: 'center' }}>
                        <CardContent sx={{ width: '100%', p: { xs: 4, sm: 6 } }}>
                            <Box sx={{ mb: 5 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>Welcome Back</Typography>
                                <Typography variant="body1" color="text.secondary">Please sign in to your account</Typography>
                            </Box>
                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#ff8a80' }}>{error}</Alert>}
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField label="Email Address" name="email" type="email" required fullWidth value={form.email} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'text.secondary' }} /></InputAdornment>, ...inputSx.sx }} InputLabelProps={labelSx} />
                                <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} required fullWidth value={form.password} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'text.secondary' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>, ...inputSx.sx }} InputLabelProps={labelSx} />
                                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 2, height: 56, fontSize: '1.1rem', fontWeight: 600, borderRadius: 2, background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)' }}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Box>
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">Don't have an account?{' '}
                                    <Link component={RouterLink} to="/register" sx={{ color: '#00BFA6', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Create Account</Link>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
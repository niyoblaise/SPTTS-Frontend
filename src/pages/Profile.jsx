import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Container,
    Avatar,
    Divider,
    Alert,
    Grid
} from '@mui/material';
import {
    Person,
    Lock,
    Save,
    Email,
    Badge
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Profile() {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e) {
            console.error(e);
            setMessage({ type: 'error', text: 'Failed to update password. Please check your current password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                {/* Header Profile Section */}
                <Box sx={{
                    p: 5,
                    background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.2) 0%, rgba(0,0,0,0) 100%)',
                    textAlign: 'center'
                }}>
                    <Avatar sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2.5rem',
                        boxShadow: '0 0 30px rgba(108, 99, 255, 0.5)'
                    }}>
                        {user?.fullName?.charAt(0)}
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">{user?.fullName}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, opacity: 0.8 }}>
                        {user?.userType?.replace('_', ' ')}
                    </Typography>
                </Box>

                <Box sx={{ p: 5 }}>
                    <Grid container spacing={4}>
                        {/* User Details */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" /> Personal Information
                            </Typography>
                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField label="Full Name" value={user?.fullName || ''} fullWidth disabled InputProps={{ startAdornment: <Badge color="action" sx={{ mr: 2 }} /> }} />
                                <TextField label="Email Address" value={user?.email || ''} fullWidth disabled InputProps={{ startAdornment: <Email color="action" sx={{ mr: 2 }} /> }} />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Lock color="secondary" /> Security
                            </Typography>
                            {message.text && <Alert severity={message.type} sx={{ mb: 2, borderRadius: 2 }}>{message.text}</Alert>}
                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField label="Current Password" type="password" fullWidth value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                                <TextField label="New Password" type="password" fullWidth value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                                <TextField label="Confirm New Password" type="password" fullWidth value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
                                <Button variant="contained" size="large" startIcon={<Save />} onClick={handleChangePassword} disabled={loading || !passwords.currentPassword || !passwords.newPassword} sx={{ mt: 1, borderRadius: 3, background: 'linear-gradient(45deg, #00BFA6 30%, #6C63FF 90%)' }}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

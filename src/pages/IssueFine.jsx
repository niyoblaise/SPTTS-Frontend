import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Alert,
    CircularProgress
} from '@mui/material';
import { Gavel, Email, AttachMoney, Description } from '@mui/icons-material';
import { ruraService } from '../services/ruraService';
import { useNavigate } from 'react-router-dom';

export default function IssueFine() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ issuedTo: '', amount: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await ruraService.issueFine(form);
            setSuccess('Fine issued successfully.');
            setForm({ issuedTo: '', amount: '', reason: '' });
            setTimeout(() => navigate('/rura/dashboard'), 2000);
        } catch (err) {
            console.error(err);
            setError('Failed to issue fine. Please check the operator ID/Email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#0f172a',
            color: 'white',
            py: 8,
            px: 2
        }}>
            <Container maxWidth="md">
                <Paper sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <Box sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                        }}>
                            <Gavel sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Issue Regulatory Fine
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Sanction operators for non-compliance
                            </Typography>
                        </Box>
                    </Box>

                    {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Operator Email or ID"
                            name="issuedTo"
                            required
                            fullWidth
                            variant="outlined"
                            value={form.issuedTo}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                    '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.08)' }
                                }
                            }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                        />

                        <TextField
                            label="Fine Amount (RWF)"
                            name="amount"
                            type="number"
                            required
                            fullWidth
                            variant="outlined"
                            value={form.amount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                    '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.08)' }
                                }
                            }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                        />

                        <TextField
                            label="Reason for Sanction"
                            name="reason"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={form.reason}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ mt: 1.5, mr: 1, alignSelf: 'flex-start' }}>
                                        <Description sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                    '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.08)' }
                                }
                            }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #EF4444 30%, #B91C1C 90%)',
                                boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #DC2626 30%, #991B1B 90%)',
                                    boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.5)',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Issue Fine'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

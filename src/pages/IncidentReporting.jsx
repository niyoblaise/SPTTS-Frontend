import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Container,
    MenuItem,
    Alert,
    Avatar
} from '@mui/material';
import {
    ReportProblem,
    Send,
    Warning
} from '@mui/icons-material';
import { operatorService } from '../services/operatorService';
import { useNavigate } from 'react-router-dom';

export default function IncidentReporting() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [incident, setIncident] = useState({
        type: 'BREAKDOWN',
        description: '',
        location: ''
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await operatorService.reportIncident(incident);
            setSuccess(true);
            setTimeout(() => {
                navigate('/operator/dashboard');
            }, 2000);
        } catch (e) {
            console.error("Failed to report incident", e);
            setError("Failed to submit incident report. Please try again.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Paper sx={{ p: 5, borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'success.main', mx: 'auto', mb: 3 }}>
                        <Send fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'success.main' }}>
                        Report Submitted
                    </Typography>
                    <Typography color="text.secondary">
                        The administration has been notified. Redirecting...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                    background: 'linear-gradient(45deg, #FF5252 30%, #FFB74D 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Report Incident
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Submit a report for breakdowns, accidents, or delays
                </Typography>
            </Box>

            <Paper sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255, 82, 82, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 82, 82, 0.2)' }}>
                        <Warning color="error" />
                        <Typography variant="body2" color="text.secondary">
                            Please provide accurate details to help the support team assist you quickly.
                        </Typography>
                    </Box>

                    <TextField
                        select
                        label="Incident Type"
                        fullWidth
                        variant="outlined"
                        value={incident.type}
                        onChange={(e) => setIncident({ ...incident, type: e.target.value })}
                        InputProps={{
                            startAdornment: <ReportProblem color="action" sx={{ mr: 1 }} />,
                        }}
                    >
                        <MenuItem value="BREAKDOWN">Vehicle Breakdown</MenuItem>
                        <MenuItem value="ACCIDENT">Accident</MenuItem>
                        <MenuItem value="DELAY">Heavy Traffic / Delay</MenuItem>
                        <MenuItem value="MEDICAL">Medical Emergency</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                    </TextField>

                    <TextField
                        label="Location"
                        fullWidth
                        variant="outlined"
                        placeholder="e.g. Near Nyabugogo Station"
                        value={incident.location}
                        onChange={(e) => setIncident({ ...incident, location: e.target.value })}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Describe what happened..."
                        value={incident.description}
                        onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                    />

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !incident.description || !incident.location}
                        size="large"
                        startIcon={<Send />}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #FF5252 30%, #FFB74D 90%)',
                            boxShadow: '0 4px 14px 0 rgba(255, 82, 82, 0.39)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #D32F2F 30%, #F57C00 90%)',
                            }
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

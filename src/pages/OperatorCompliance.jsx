import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Avatar,
    Chip,
    Button,
    CircularProgress,
    LinearProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Business,
    VerifiedUser,
    Gavel,
    Block,
    CheckCircle,
    Warning,
    TrendingUp
} from '@mui/icons-material';
import { ruraService } from '../services/ruraService';

export default function OperatorCompliance() {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await ruraService.getOperatorCompliance();
            setOperators(data);
        } catch (error) {
            console.error("Failed to load compliance data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (operator) => {
        try {
            if (operator.status === 'SUSPENDED') {
                await ruraService.activateOperator(operator.operatorId);
            } else {
                if (window.confirm(`Are you sure you want to suspend ${operator.name}?`)) {
                    await ruraService.suspendOperator(operator.operatorId);
                } else {
                    return;
                }
            }
            loadData(); // Refresh list
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update operator status");
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#0f172a',
            color: 'white',
            pb: 4
        }}>
            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                pt: 6,
                pb: 8,
                px: 4,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                mb: 4
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h3" fontWeight="800" sx={{
                                background: 'linear-gradient(45deg, #10B981 30%, #34D399 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                letterSpacing: '-0.02em'
                            }}>
                                Operator Compliance Monitor
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, lineHeight: 1.6 }}>
                                Real-time oversight of operator safety scores, incident history, and license status management.
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            display: { xs: 'none', md: 'block' }
                        }}>
                            <VerifiedUser sx={{ fontSize: 48, color: '#10B981' }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: '#10B981' }} />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {operators.map((op) => (
                            <Grid size={{ xs: 12, md: 6 }} key={op.operatorId}>
                                <Paper sx={{
                                    p: 0,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(30, 41, 59, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease-in-out',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        bgcolor: 'rgba(30, 41, 59, 0.8)'
                                    }
                                }}>
                                    {/* Card Header */}
                                    <Box sx={{
                                        p: 4,
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                            <Avatar sx={{
                                                width: 72,
                                                height: 72,
                                                bgcolor: op.complianceScore > 80 ? 'rgba(16, 185, 129, 0.2)' : op.complianceScore > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: op.complianceScore > 80 ? '#10b981' : op.complianceScore > 50 ? '#f59e0b' : '#ef4444',
                                                border: '1px solid',
                                                borderColor: op.complianceScore > 80 ? 'rgba(16, 185, 129, 0.3)' : op.complianceScore > 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                            }}>
                                                <Business sx={{ fontSize: 36 }} />
                                            </Avatar>
                                            <Chip
                                                label={op.status || 'ACTIVE'}
                                                color={op.status === 'SUSPENDED' ? 'error' : 'success'}
                                                sx={{
                                                    height: 32,
                                                    px: 1,
                                                    fontSize: '0.875rem',
                                                    fontWeight: 'bold',
                                                    borderRadius: 2
                                                }}
                                                variant={op.status === 'SUSPENDED' ? 'filled' : 'outlined'}
                                                icon={op.status === 'SUSPENDED' ? <Block /> : <CheckCircle />}
                                            />
                                        </Box>
                                        <Typography variant="h5" fontWeight="800" noWrap title={op.company || op.name} sx={{ mb: 0.5 }}>
                                            {op.company || op.name}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Operator ID: <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>{op.email}</span>
                                        </Typography>
                                    </Box>

                                    {/* Card Content */}
                                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ mb: 4 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                                                <Typography variant="body1" color="rgba(255,255,255,0.7)">Safety Compliance Score</Typography>
                                                <Typography variant="h4" fontWeight="800" color={
                                                    op.complianceScore > 80 ? '#10b981' : op.complianceScore > 50 ? '#f59e0b' : '#ef4444'
                                                }>
                                                    {op.complianceScore.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={op.complianceScore}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
                                                    bgcolor: 'rgba(255,255,255,0.05)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 5,
                                                        bgcolor: op.complianceScore > 80 ? '#10b981' : op.complianceScore > 50 ? '#f59e0b' : '#ef4444'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Grid container spacing={3} sx={{ mb: 4 }}>
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{
                                                    p: 2.5,
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    textAlign: 'center'
                                                }}>
                                                    <Typography variant="body2" color="rgba(255,255,255,0.5)" display="block" mb={0.5}>
                                                        Total Incidents
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {op.totalIncidents}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{
                                                    p: 2.5,
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    textAlign: 'center'
                                                }}>
                                                    <Typography variant="body2" color="rgba(255,255,255,0.5)" display="block" mb={0.5}>
                                                        Performance
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                        <TrendingUp sx={{ fontSize: 20, color: '#10b981' }} />
                                                        <Typography variant="h6" fontWeight="bold" color="#10b981">Stable</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {/* Active Fleet Section */}
                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom>
                                                Active Fleet (License Plates)
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {op.activePlates && op.activePlates.length > 0 ? (
                                                    op.activePlates.map((plate, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={plate}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                                color: 'white',
                                                                border: '1px solid rgba(255,255,255,0.1)'
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="rgba(255,255,255,0.4)">
                                                        No active buses found.
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 'auto' }}>
                                            <Button
                                                fullWidth
                                                variant={op.status === 'SUSPENDED' ? 'contained' : 'outlined'}
                                                color={op.status === 'SUSPENDED' ? 'success' : 'error'}
                                                startIcon={op.status === 'SUSPENDED' ? <CheckCircle /> : <Block />}
                                                onClick={() => handleToggleStatus(op)}
                                                size="large"
                                                sx={{
                                                    py: 2,
                                                    borderRadius: 3,
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    textTransform: 'none',
                                                    boxShadow: op.status === 'SUSPENDED' ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 'none',
                                                    borderColor: op.status !== 'SUSPENDED' && 'rgba(239, 68, 68, 0.5)',
                                                    color: op.status !== 'SUSPENDED' && '#ef4444',
                                                    borderWidth: 2,
                                                    '&:hover': {
                                                        borderWidth: 2,
                                                        borderColor: op.status !== 'SUSPENDED' && '#ef4444',
                                                        bgcolor: op.status !== 'SUSPENDED' && 'rgba(239, 68, 68, 0.05)'
                                                    }
                                                }}
                                            >
                                                {op.status === 'SUSPENDED' ? 'Reactivate Operator License' : 'Suspend Operator License'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

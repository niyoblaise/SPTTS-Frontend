import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    Divider,
    CircularProgress,
    Container,
    Paper,
    Avatar
} from '@mui/material';
import {
    CreditCard,
    AccountBalance,
    CheckCircle,
    DirectionsBus,
    LocationOn,
    Schedule,
    Lock
} from '@mui/icons-material';
import { passengerService } from '../services/passengerService';

export default function Payment() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [tripDetails, setTripDetails] = useState(location.state?.trip || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    useEffect(() => {
        if (!tripDetails && tripId) {
            loadTripDetails();
        }
    }, [tripId]);

    const loadTripDetails = async () => {
        try {
            const data = await passengerService.trackTrip(tripId);
            setTripDetails(data);
        } catch (err) {
            setError('Failed to load trip details');
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            await passengerService.payTrip(tripId);
            setSuccess(true);
            setTimeout(() => {
                navigate('/trip-history');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Card sx={{
                    maxWidth: 500,
                    textAlign: 'center',
                    p: 5,
                    borderRadius: 4,
                    background: 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)'
                }}>
                    <CheckCircle sx={{ fontSize: 100, color: '#10b981', mb: 3 }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#10b981' }}>
                        Payment Successful!
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem' }}>
                        Your payment has been processed successfully.
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        Redirecting to trip history...
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2) 0%, rgba(0, 191, 166, 0.2) 100%)',
                        p: 5,
                        textAlign: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                >
                    <Avatar sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 0 20px rgba(108, 99, 255, 0.5)'
                    }}>
                        <CreditCard sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Complete Payment
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Secure & Fast Transaction
                    </Typography>
                </Box>

                <CardContent sx={{ p: 5 }}>
                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

                    {/* Trip Details */}
                    {tripDetails && (
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: 1 }}>
                                Trip Summary
                            </Typography>
                            <Box
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    borderRadius: 3,
                                    p: 3,
                                    mt: 2,
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(108, 99, 255, 0.1)', color: 'primary.main', mr: 2, width: 40, height: 40 }}>
                                        <DirectionsBus fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Trip ID</Typography>
                                        <Typography variant="body1" fontWeight="600">#{tripId.substring(0, 8)}</Typography>
                                    </Box>
                                </Box>
                                {tripDetails.route && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(0, 191, 166, 0.1)', color: 'secondary.main', mr: 2, width: 40, height: 40 }}>
                                            <LocationOn fontSize="small" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Route</Typography>
                                            <Typography variant="body1" fontWeight="600">{tripDetails.route.routeName}</Typography>
                                        </Box>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: 'warning.main', mr: 2, width: 40, height: 40 }}>
                                        <Schedule fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Date</Typography>
                                        <Typography variant="body1" fontWeight="600">{new Date(tripDetails.startTime).toLocaleString()}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

                    {/* Payment Amount */}
                    <Box sx={{ mb: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'linear-gradient(90deg, rgba(108, 99, 255, 0.1) 0%, rgba(108, 99, 255, 0.05) 100%)',
                                borderRadius: 3,
                                p: 3,
                                border: '1px solid rgba(108, 99, 255, 0.2)'
                            }}
                        >
                            <Typography variant="h6" fontWeight="600">
                                Total Amount
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#6C63FF' }}>
                                {tripDetails?.fare ? `${tripDetails.fare.toLocaleString()} RWF` : 'Loading...'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Payment Method */}
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: 1 }}>
                            Select Payment Method
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    border: paymentMethod === 'card' ? '2px solid #6C63FF' : '1px solid rgba(255,255,255,0.1)',
                                    bgcolor: paymentMethod === 'card' ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        bgcolor: 'rgba(108, 99, 255, 0.05)'
                                    },
                                }}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <CreditCard sx={{ fontSize: 32, color: paymentMethod === 'card' ? '#6C63FF' : 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" fontWeight="600" color={paymentMethod === 'card' ? 'text.primary' : 'text.secondary'}>
                                        Credit/Debit Card
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    border: paymentMethod === 'mobile' ? '2px solid #6C63FF' : '1px solid rgba(255,255,255,0.1)',
                                    bgcolor: paymentMethod === 'mobile' ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        bgcolor: 'rgba(108, 99, 255, 0.05)'
                                    },
                                }}
                                onClick={() => setPaymentMethod('mobile')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <AccountBalance sx={{ fontSize: 32, color: paymentMethod === 'mobile' ? '#6C63FF' : 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" fontWeight="600" color={paymentMethod === 'mobile' ? 'text.primary' : 'text.secondary'}>
                                        Mobile Money
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    {/* Payment Button */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading || !tripDetails}
                        onClick={handlePayment}
                        sx={{
                            height: 64,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)',
                            boxShadow: '0 8px 20px rgba(108, 99, 255, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5a52d5 30%, #00a08b 90%)',
                                boxShadow: '0 12px 24px rgba(108, 99, 255, 0.4)',
                            },
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                                Processing...
                            </>
                        ) : (
                            `Pay Now • ${tripDetails?.fare ? tripDetails.fare.toLocaleString() : ''} RWF`
                        )}
                    </Button>

                    <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary', opacity: 0.7 }}>
                        <Lock fontSize="small" />
                        <Typography variant="caption">
                            Payments are secure and encrypted
                        </Typography>
                    </Box>
                </CardContent>
            </Paper>
        </Container>
    );
}
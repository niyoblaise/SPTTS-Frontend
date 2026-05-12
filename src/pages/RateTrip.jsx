import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    CardContent,
    Typography,
    Rating,
    Button,
    Container,
    Paper,
    Avatar,
    TextField
} from '@mui/material';
import { Star, RateReview } from '@mui/icons-material';
import { passengerService } from '../services/passengerService';

export default function RateTrip() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await passengerService.rateTrip(tripId, rating, comment);
            navigate('/trip-history');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                }}
            >
                <Box sx={{
                    p: 5,
                    background: 'linear-gradient(180deg, rgba(255, 152, 0, 0.1) 0%, rgba(0,0,0,0) 100%)'
                }}>
                    <Avatar sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'warning.main',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 0 20px rgba(255, 152, 0, 0.4)'
                    }}>
                        <Star sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Rate Your Trip
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        How was your experience with us?
                    </Typography>
                </Box>

                <CardContent sx={{ px: 5, pb: 5 }}>
                    <Box sx={{ mb: 4 }}>
                        <Rating
                            name="trip-rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            size="large"
                            sx={{
                                fontSize: '4rem',
                                '& .MuiRating-iconFilled': {
                                    color: '#FFC107',
                                    filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.4))'
                                },
                                '& .MuiRating-iconHover': {
                                    color: '#FFD54F',
                                }
                            }}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            {rating === 0 ? 'Tap to rate' :
                                rating <= 2 ? 'Not good' :
                                    rating <= 4 ? 'Good' : 'Excellent!'}
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Share your feedback (optional)..."
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(255,255,255,0.03)',
                                borderRadius: 3
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !rating}
                        startIcon={<RateReview />}
                        sx={{
                            height: 56,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                            boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #F57C00 30%, #FFA000 90%)',
                            },
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </CardContent>
            </Paper>
        </Container>
    );
}
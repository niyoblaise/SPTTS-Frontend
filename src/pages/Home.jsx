import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    useTheme,
} from '@mui/material';
import {
    DirectionsBus,
    History,
    NotificationsActive,
    ArrowForward,
    ReportProblem,
    Chat as ChatIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const actions = [
        {
            title: 'Request a Bus',
            desc: 'Find and book a bus for your route',
            icon: <DirectionsBus fontSize="large" />,
            path: '/request-bus',
            color: theme.palette.primary.main,
        },
        {
            title: 'Trip History',
            desc: 'View your past trips and payments',
            icon: <History fontSize="large" />,
            path: '/trip-history',
            color: theme.palette.secondary.main,
        },
        {
            title: 'Notifications',
            desc: 'Check updates on your requests',
            icon: <NotificationsActive fontSize="large" />,
            path: '/notifications',
            color: '#F59E0B', // Amber
        },
        {
            title: 'Report Incident',
            desc: 'Report issues or breakdowns',
            icon: <ReportProblem fontSize="large" />,
            path: '/incident-reporting',
            color: '#EF4444', // Red
        },
        {
            title: 'Chat Support',
            desc: 'Chat with operators or support',
            icon: <ChatIcon fontSize="large" />,
            path: '/chat',
            color: '#10B981', // Emerald
        },
    ];

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
            {/* Background Decorative Elements */}
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 191, 166, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{
                        background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: -1
                    }}>
                        Hello, {user?.fullName?.split(' ')[0]}! 👋
                    </Typography>
                    <Typography variant="h5" color="text.secondary" fontWeight="500">
                        Where would you like to go today?
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {actions.map((action, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={action.title}>
                            <Card
                                onClick={() => navigate(action.path)}
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 4,
                                    background: 'rgba(30, 41, 59, 0.4)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 40px -10px ${action.color}40`,
                                        border: `1px solid ${action.color}40`,
                                        '& .icon-bg': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                        }
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3 }}>
                                    <Box
                                        className="icon-bg"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}10 100%)`,
                                            color: action.color,
                                            transition: 'transform 0.3s ease',
                                            boxShadow: `0 8px 16px -4px ${action.color}30`,
                                        }}
                                    >
                                        {action.icon}
                                    </Box>

                                    <Box>
                                        <Typography variant="h5" fontWeight="700" gutterBottom>
                                            {action.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {action.desc}
                                        </Typography>
                                    </Box>

                                    <Button
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            mt: 2,
                                            color: action.color,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            px: 3,
                                            py: 1,
                                            borderRadius: 3,
                                            bgcolor: `${action.color}10`,
                                            '&:hover': {
                                                bgcolor: action.color,
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        Go Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
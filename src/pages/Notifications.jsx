import React, { useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Paper,
    IconButton,
    Container,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Button
} from '@mui/material';
import {
    Notifications as NotifIcon,
    CheckCircle,
    Refresh,
    Info,
    Warning,
    Error as ErrorIcon
} from '@mui/icons-material';
import { passengerService } from '../services/passengerService';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await passengerService.getNotifications();
            // Sort by timestamp descending
            const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setNotifications(sortedData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        // Assuming notification might have a type, otherwise default
        switch (type) {
            case 'SUCCESS': return <CheckCircle />;
            case 'WARNING': return <Warning />;
            case 'ERROR': return <ErrorIcon />;
            default: return <Info />;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'success.main';
            case 'WARNING': return 'warning.main';
            case 'ERROR': return 'error.main';
            default: return 'primary.main';
        }
    };

    const getAvatarBg = (type) => {
        switch (type) {
            case 'SUCCESS': return 'rgba(46, 125, 50, 0.1)';
            case 'WARNING': return 'rgba(237, 108, 2, 0.1)';
            case 'ERROR': return 'rgba(211, 47, 47, 0.1)';
            default: return 'rgba(25, 118, 210, 0.1)';
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                    <Typography variant="h4" fontWeight="700" gutterBottom>
                        Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Stay updated with your trip status
                    </Typography>
                </Box>
                <IconButton onClick={loadNotifications} color="primary" sx={{ bgcolor: 'action.hover' }}>
                    <Refresh />
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                    <NotifIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">No new notifications</Typography>
                </Box>
            ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <ListItem alignItems="flex-start" sx={{ p: 2 }}>
                                <ListItemAvatar sx={{ mt: 0.5 }}>
                                    <Avatar sx={{
                                        bgcolor: getAvatarBg(notif.type),
                                        color: getIconColor(notif.type)
                                    }}>
                                        {getIcon(notif.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                                            {notif.title || "Notification"}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ display: 'block', mb: 1 }}
                                            >
                                                {notif.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {new Date(notif.timestamp).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        </Card>
                    ))}
                </List>
            )}
        </Container>
    );
}
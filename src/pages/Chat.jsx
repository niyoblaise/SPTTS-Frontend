import React, { useState } from 'react';
import { Container, Grid, List, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Box, Paper, useTheme } from '@mui/material';
import ChatWindow from '../components/ChatWindow';
import { SupportAgent, Group, Person } from '@mui/icons-material';

export default function Chat() {
    const [selectedRoom, setSelectedRoom] = useState({ id: 'global', title: 'General Support' });
    const theme = useTheme();

    const rooms = [
        { id: 'global', title: 'General Support', icon: <SupportAgent /> },
        { id: 'drivers', title: 'Drivers Group', icon: <Group /> },
        { id: 'passengers', title: 'Passengers Community', icon: <Person /> },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{
                    background: 'linear-gradient(45deg, #6C63FF 30%, #00BFA6 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: -1
                }}>
                    Chat Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Connect with support, drivers, and the community.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: '100%' }}>
                    <Paper sx={{
                        height: '100%',
                        bgcolor: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Typography variant="h6" fontWeight="bold">Conversations</Typography>
                        </Box>
                        <List sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                            {rooms.map((room) => (
                                <ListItemButton
                                    key={room.id}
                                    selected={selectedRoom.id === room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    sx={{
                                        borderRadius: 3,
                                        mb: 1,
                                        p: 2,
                                        transition: 'all 0.2s',
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(108, 99, 255, 0.15)',
                                            border: '1px solid rgba(108, 99, 255, 0.3)',
                                            '&:hover': { bgcolor: 'rgba(108, 99, 255, 0.25)' }
                                        },
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: selectedRoom.id === room.id ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                            color: selectedRoom.id === room.id ? 'white' : 'primary.main',
                                            transition: 'all 0.3s'
                                        }}>
                                            {room.icon}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={room.title}
                                        primaryTypographyProps={{ fontWeight: selectedRoom.id === room.id ? 700 : 500 }}
                                        secondary="Click to join"
                                        secondaryTypographyProps={{ sx: { color: 'text.secondary', fontSize: '0.8rem' } }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 8, lg: 9 }} sx={{ height: '100%' }}>
                    <ChatWindow roomId={selectedRoom.id} title={selectedRoom.title} />
                </Grid>
            </Grid>
        </Container>
    );
}

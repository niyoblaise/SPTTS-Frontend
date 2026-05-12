// src/components/Navbar.js
import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem,
    ListItemButton, ListItemText, Avatar, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon, DirectionsBus, Notifications, History, Payment, Star, Home, EditLocation, AddLocation
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Home', path: '/', icon: <Home /> },
        { label: 'Request Bus', path: '/request-bus', icon: <DirectionsBus /> },
        { label: 'Notifications', path: '/notifications', icon: <Notifications /> },
        { label: 'Trip History', path: '/trip-history', icon: <History /> },
        { label: 'Pay', path: '/pay', icon: <Payment /> },
        ...(user?.userType === 'SYSTEM_ADMIN' ? [
            { label: 'Create Route', path: '/create-route', icon: <EditLocation /> },
            { label: 'Create Stop', path: '/create-stop', icon: <AddLocation /> },
        ] : [])
    ];

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    /* ---------- desktop auth buttons ---------- */
    const AuthButtons = () =>
        !user ? (
            <>
                <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                >
                    Login
                </Button>
                <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="small"
                >
                    Register
                </Button>
            </>
        ) : (
            <Button variant="outlined" size="small" onClick={() => { logout(); navigate('/'); }}>
                Logout
            </Button>
        );

    /* ---------- drawer content ---------- */
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
            <Typography variant="h6" sx={{ my: 2 }}>Smart Transport</Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}

                {/* mobile auth controls */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to={user ? '/' : '/login'}
                        onClick={() => user && logout()}
                    >
                        <ListItemText primary={user ? 'Logout' : 'Login / Register'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    background: 'rgba(18, 18, 18, 0.72)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,.3)',
                    borderBottom: '1px solid rgba(255,255,255,.08)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Left: logo + desktop nav */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DirectionsBus sx={{ mr: 1 }} />
                        <Typography variant="h6" noWrap component="div">
                            Smart Transport
                        </Typography>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 3 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    color={location.pathname === item.path ? 'secondary' : 'inherit'}
                                    sx={{ textTransform: 'none', fontWeight: 500 }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Right: avatar / auth + hamburger */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user && (
                            <Tooltip title={user.email}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    {user.email[0].toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        )}

                        {/* auth buttons */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <AuthButtons />
                        </Box>

                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Navbar;
import React, { useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, useMediaQuery, useTheme, InputBase, Badge, Tooltip, Paper, ClickAwayListener
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, DirectionsBus as BusIcon, History,
    Notifications as NotifIcon, Person as PersonIcon, Logout,
    AttachMoney, ReportProblem, AltRoute, Chat as ChatIcon,
    Search as SearchIcon, Settings, Gavel, RateReview, VerifiedUser, EditLocation
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DW = 220;

export default function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/login'); };

    const searchOptions = [
        { label: 'Dashboard', path: user?.userType === 'PASSENGER' ? '/' : '/operator/dashboard' },
        { label: 'Request Bus', path: '/request-bus', role: 'PASSENGER' },
        { label: 'Trip History', path: '/trip-history', role: 'PASSENGER' },
        { label: 'Profile', path: '/profile' },
        { label: 'Notifications', path: '/notifications' },
    ];

    const menuByRole = {
        PASSENGER: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/' },
            { text: 'Request Bus', icon: <BusIcon />, path: '/request-bus' },
            { text: 'Track Trip', icon: <EditLocation />, path: '/track-trip/active' },
            { text: 'Trip History', icon: <History />, path: '/trip-history' },
            { text: 'Notifications', icon: <NotifIcon />, path: '/notifications' },
            { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
        ],
        BUS_OPERATOR: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/operator/dashboard' },
            { text: 'My Trips', icon: <BusIcon />, path: '/operator/trips' },
            { text: 'Notifications', icon: <NotifIcon />, path: '/notifications' },
            { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
        ],
        SYSTEM_ADMIN: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
            { text: 'Users', icon: <PersonIcon />, path: '/admin/users' },
            { text: 'Fleet', icon: <BusIcon />, path: '/admin/fleet' },
            { text: 'Fares', icon: <AttachMoney />, path: '/admin/fares' },
            { text: 'Routes', icon: <AltRoute />, path: '/admin/routes' },
            { text: 'Notifications', icon: <NotifIcon />, path: '/notifications' },
        ],
        REGULATOR: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/rura/dashboard' },
            { text: 'Review Incidents', icon: <RateReview />, path: '/rura/review-incidents' },
            { text: 'Compliance', icon: <VerifiedUser />, path: '/rura/compliance' },
            { text: 'Issue Fine', icon: <Gavel />, path: '/rura/issue-fine' },
            { text: 'Notifications', icon: <NotifIcon />, path: '/notifications' },
        ],
    };

    const menuItems = menuByRole[user?.userType] || [];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1rem' }}>S</Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="700" sx={{ lineHeight: 1.2 }}>SPTTS</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user?.userType?.replace('_', ' ')}</Typography>
                </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />
            <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
                {menuItems.map((item) => {
                    const sel = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton selected={sel} onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                                sx={{ borderRadius: 2, py: 1, '&.Mui-selected': { bgcolor: 'rgba(108,99,255,0.15)', '& .MuiListItemIcon-root': { color: '#6C63FF' } }, '&:not(.Mui-selected):hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                                <ListItemIcon sx={{ color: sel ? '#6C63FF' : 'rgba(255,255,255,0.5)', minWidth: 36 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: sel ? 600 : 400, fontSize: '0.9rem' }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main', '&:hover': { bgcolor: 'rgba(244,67,54,0.08)' } }}>
                    <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${DW}px)` }, ml: { md: `${DW}px` }, bgcolor: 'rgba(15,23,42,0.85)', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}><MenuIcon /></IconButton>
                    <Box sx={{ position: 'relative' }} ref={searchRef}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, px: 1.5, py: 0.3, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 0.5 }} />
                            <InputBase placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }} onFocus={() => setShowSearch(true)}
                                sx={{ color: 'white', width: 160, fontSize: '0.85rem', '& input::placeholder': { color: 'text.secondary', opacity: 1 } }} />
                        </Box>
                        {showSearch && searchQuery && (
                            <ClickAwayListener onClickAway={() => setShowSearch(false)}>
                                <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 4, zIndex: 10 }}>
                                    <List dense>
                                        {searchOptions.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()) && (!o.role || o.role === user?.userType)).map(o => (
                                            <ListItemButton key={o.path} onClick={() => { navigate(o.path); setSearchQuery(''); setShowSearch(false); }}><ListItemText primary={o.label} /></ListItemButton>
                                        ))}
                                        {searchOptions.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()) && (!o.role || o.role === user?.userType)).length === 0 && (
                                            <ListItem><ListItemText primary="No results" sx={{ color: 'text.secondary' }} /></ListItem>
                                        )}
                                    </List>
                                </Paper>
                            </ClickAwayListener>
                        )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Notifications">
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'text.secondary' }}><Badge badgeContent={0} color="error"><NotifIcon /></Badge></IconButton>
                        </Tooltip>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: 1.5, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.08)', minWidth: 180 } }}>
                            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}><ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon> Profile</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon> Logout</MenuItem>
                        </Menu>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.3, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 30, height: 30, fontSize: '0.8rem' }}>{user?.fullName?.charAt(0) || <PersonIcon />}</Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { md: DW }, flexShrink: { md: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DW, bgcolor: '#0f172a' } }}>
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DW, borderRight: '1px solid rgba(255,255,255,0.06)', bgcolor: '#0f172a' } }} open>
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${DW}px)` }, minHeight: '100vh', mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

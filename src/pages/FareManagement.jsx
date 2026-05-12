import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Container, CircularProgress, Alert, InputAdornment, MenuItem
} from '@mui/material';
import { Delete, Edit, Add, AttachMoney, Search, PriceChange, Route } from '@mui/icons-material';
import api from '../services/api';
import { adminService } from '../services/adminService';

export default function FareManagement() {
    const [displayFares, setDisplayFares] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentFare, setCurrentFare] = useState({ amount: '', currency: 'RWF', description: '', routeId: '', routeName: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { loadFares(); }, []);

    const loadFares = async () => {
        setLoading(true);
        try {
            const [faresData, routesData] = await Promise.all([adminService.getFares(), api.get('/routes')]);
            const mergedData = routesData.data.map(route => {
                const explicitFare = faresData.find(f => f.routeId === route.routeId);
                return explicitFare ? { ...explicitFare, isExplicit: true, routeName: route.routeName }
                    : { fareId: null, routeId: route.routeId, routeName: route.routeName, amount: route.price || 0, description: route.description || 'Default Route Price', currency: 'RWF', isExplicit: false };
            });
            setDisplayFares(mergedData);
            setRoutes(routesData.data);
        } catch (e) { console.error(e); setError("Failed to load data."); }
        finally { setLoading(false); }
    };

    const handleDeleteFare = async (id) => {
        if (window.confirm('Delete this fare?')) {
            try { await adminService.deleteFare(id); loadFares(); }
            catch (e) { console.error(e); alert("Failed to delete fare."); }
        }
    };

    const handleSaveFare = async () => {
        try {
            const payload = { ...currentFare, amount: parseFloat(currentFare.amount), effectiveDate: new Date().toISOString().split('T')[0] };
            if (currentFare.fareId) await adminService.updateFare(currentFare.fareId, payload);
            else await adminService.createFare(payload);
            setOpenDialog(false);
            setCurrentFare({ amount: '', currency: 'RWF', description: '', routeId: '', routeName: '' });
            setIsEditing(false);
            loadFares();
        } catch (e) { console.error(e); alert("Failed to save fare."); }
    };

    const openEditDialog = (fare) => { setCurrentFare({ ...fare, amount: fare.amount || '' }); setIsEditing(true); setOpenDialog(true); };

    const filteredFares = displayFares.filter(f =>
        f.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(45deg, #00BFA6 30%, #6C63FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Fare Management
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Configure trip pricing and rules</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField placeholder="Search fares..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 250, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }} />
                    <Button startIcon={<Add />} variant="contained" onClick={() => { setCurrentFare({ amount: '', currency: 'RWF', description: '', routeId: '', routeName: '' }); setIsEditing(false); setOpenDialog(true); }}
                        sx={{ borderRadius: 3, px: 3, background: 'linear-gradient(45deg, #00BFA6 30%, #6C63FF 90%)' }}>Add New Fare</Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <Paper sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box> : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5, pl: 4 }}>ROUTE</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5 }}>AMOUNT</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5 }}>CURRENCY</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5, pr: 4 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFares.length > 0 ? filteredFares.map((fare) => (
                                    <TableRow key={fare.routeId} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell sx={{ pl: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(108,99,255,0.1)', color: '#6C63FF' }}><PriceChange fontSize="small" /></Box>
                                                <Box>
                                                    <Typography fontWeight="600" variant="body2">{fare.routeName || 'General Fare'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{fare.description}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography variant="body1" fontWeight="600" color="success.main">{fare.amount?.toLocaleString()}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" color="text.secondary">{fare.currency}</Typography></TableCell>
                                        <TableCell align="right" sx={{ pr: 4 }}>
                                            <IconButton onClick={() => openEditDialog(fare)} size="small" sx={{ mr: 1, color: 'primary.main', bgcolor: 'rgba(108,99,255,0.1)' }}><Edit fontSize="small" /></IconButton>
                                            <IconButton onClick={() => handleDeleteFare(fare.fareId)} size="small" disabled={!fare.isExplicit}
                                                sx={{ color: 'error.main', bgcolor: 'rgba(244,67,54,0.1)', '&.Mui-disabled': { opacity: 0.3 } }}><Delete fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 8 }}><Typography color="text.secondary">No fares configured.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.08)' } }}>
                <DialogTitle sx={{ pb: 1 }}><Typography variant="h5" fontWeight="bold">{currentFare.fareId ? 'Edit Fare' : 'Set Route Fare'}</Typography></DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField autoFocus label="Description" fullWidth value={currentFare.description} onChange={(e) => setCurrentFare({ ...currentFare, description: e.target.value })} />
                        <TextField select label="Route" fullWidth value={currentFare.routeId} disabled={isEditing}
                            onChange={(e) => { const route = routes.find(r => r.routeId === e.target.value); setCurrentFare({ ...currentFare, routeId: e.target.value, routeName: route?.routeName || '' }); }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Route color="action" /></InputAdornment> }}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            {routes.map((route) => <MenuItem key={route.routeId} value={route.routeId}>{route.routeName}</MenuItem>)}
                        </TextField>
                        <TextField label="Amount" type="number" fullWidth value={currentFare.amount} onChange={(e) => setCurrentFare({ ...currentFare, amount: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney color="action" /></InputAdornment> }} />
                        <TextField label="Currency" fullWidth value={currentFare.currency} disabled />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} size="large" sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSaveFare} variant="contained" disabled={!currentFare.amount || !currentFare.routeId} size="large" sx={{ px: 4, borderRadius: 2, background: 'linear-gradient(45deg, #00BFA6 30%, #6C63FF 90%)' }}>
                        {currentFare.fareId ? 'Update Fare' : 'Set Fare'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

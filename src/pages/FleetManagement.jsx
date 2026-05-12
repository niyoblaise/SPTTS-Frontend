import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Chip, Avatar, Container, CircularProgress, Alert, InputAdornment
} from '@mui/material';
import { Delete, Add, DirectionsBus, Search, Route, Person, History, Edit } from '@mui/icons-material';
import { adminService } from '../services/adminService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function FleetManagement() {
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openBusDialog, setOpenBusDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ plateNumber: '', model: '', status: 'ACTIVE', routeId: '', driverId: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [busesData, routesData] = await Promise.all([
                adminService.getBuses(),
                api.get('/routes')
            ]);
            setBuses(busesData);
            setRoutes(routesData.data);
            let ops = [];
            try {
                const usersData = await adminService.getUsers();
                ops = usersData.filter(u => u.userType === 'BUS_OPERATOR' || u.userType === 'SYSTEM_ADMIN');
            } catch (e) {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                if (currentUser && (currentUser.userType === 'BUS_OPERATOR' || currentUser.userType === 'SYSTEM_ADMIN')) ops = [currentUser];
            }
            setOperators(ops);
        } catch (e) {
            console.error("Failed to load fleet data", e);
            setError("Failed to load fleet data.");
        } finally { setLoading(false); }
    };

    const handleDeleteBus = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try { await adminService.deleteBus(id); loadData(); }
            catch (e) { console.error("Failed to delete bus", e); alert("Failed to delete bus."); }
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingId) await adminService.updateBus(editingId, formData);
            else await adminService.createBus(formData);
            handleCloseDialog();
            loadData();
        } catch (e) { console.error("Failed to save bus", e); alert("Failed to save bus."); }
    };

    const handleEditClick = (bus) => {
        setFormData({ plateNumber: bus.plateNumber, model: bus.model || '', status: bus.status, routeId: bus.routeId || '', driverId: bus.driverId || '' });
        setEditingId(bus.id);
        setOpenBusDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenBusDialog(false);
        setFormData({ plateNumber: '', model: '', status: 'ACTIVE', routeId: '', driverId: '' });
        setEditingId(null);
    };

    const getStatusColor = (status) => {
        switch (status) { case 'ACTIVE': return 'success'; case 'OFFLINE': return 'warning'; case 'OUT_OF_SERVICE': return 'error'; default: return 'default'; }
    };

    const filteredBuses = buses.filter(bus =>
        bus.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route?.routeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(45deg, #EC4899 30%, #8B5CF6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Fleet Management
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Manage buses and assignments</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField placeholder="Search buses..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 250, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }} />
                    <Button startIcon={<Add />} variant="contained" onClick={() => setOpenBusDialog(true)}
                        sx={{ borderRadius: 3, px: 3, background: 'linear-gradient(45deg, #EC4899 30%, #8B5CF6 90%)' }}>
                        Add New Bus
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <Paper sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5, pl: 4 }}>LICENSE PLATE</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5 }}>ROUTE</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5 }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, py: 2.5, pr: 4 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBuses.length > 0 ? (
                                    filteredBuses.map((bus) => (
                                        <TableRow key={bus.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                                            <TableCell sx={{ pl: 4 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}><DirectionsBus fontSize="small" /></Avatar>
                                                    <Box>
                                                        <Typography fontWeight="600">{bus.plateNumber}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Model: {bus.model || 'N/A'}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Route fontSize="small" color="action" />
                                                    <Typography variant="body2">{bus.routeName || bus.route?.routeName || 'Not assigned'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={bus.status} color={getStatusColor(bus.status)} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, borderWidth: 2 }} />
                                            </TableCell>
                                            <TableCell align="right" sx={{ pr: 4 }}>
                                                <IconButton onClick={() => navigate(`/admin/bus-history/${bus.id}`)} size="small" sx={{ mr: 1, color: 'info.main', bgcolor: 'rgba(33,150,243,0.1)' }}><History fontSize="small" /></IconButton>
                                                <IconButton onClick={() => handleEditClick(bus)} size="small" sx={{ mr: 1, color: 'primary.main', bgcolor: 'rgba(33,150,243,0.1)' }}><Edit fontSize="small" /></IconButton>
                                                <IconButton onClick={() => handleDeleteBus(bus.id)} size="small" sx={{ color: 'error.main', bgcolor: 'rgba(244,67,54,0.1)' }}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                            <Typography color="text.secondary">No buses found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={openBusDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)' } }}>
                <DialogTitle sx={{ pb: 1 }}><Typography variant="h5" fontWeight="bold">{editingId ? 'Edit Bus' : 'Add New Bus'}</Typography></DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField autoFocus label="License Plate" fullWidth value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsBus color="action" /></InputAdornment> }} />
                        <TextField select label="Route (Optional)" fullWidth value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Route color="action" /></InputAdornment> }}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            {routes.map((route) => <MenuItem key={route.routeId} value={route.routeId}>{route.routeName}</MenuItem>)}
                        </TextField>
                        <TextField select label="Operator (Optional)" fullWidth value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            {operators.map((op) => <MenuItem key={op.userId} value={op.userId}>{op.fullName} ({op.email})</MenuItem>)}
                        </TextField>
                        <TextField select label="Status" fullWidth value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="OFFLINE">Offline</MenuItem>
                            <MenuItem value="OUT_OF_SERVICE">Out of Service</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} size="large" sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.plateNumber} size="large"
                        sx={{ px: 4, borderRadius: 2, background: 'linear-gradient(45deg, #EC4899 30%, #8B5CF6 90%)' }}>
                        {editingId ? 'Update Bus' : 'Create Bus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

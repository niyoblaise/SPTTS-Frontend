import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Avatar, Container, CircularProgress, Alert, TextField, InputAdornment
} from '@mui/material';
import { Delete, Search, Person, AdminPanelSettings, DirectionsBus } from '@mui/icons-material';
import { adminService } from '../services/adminService';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (e) {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminService.deleteUser(id);
                loadUsers();
            } catch (e) {
                alert("Failed to delete user.");
            }
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'SYSTEM_ADMIN': return 'error';
            case 'BUS_OPERATOR': return 'warning';
            case 'PASSENGER': return 'success';
            default: return 'default';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'SYSTEM_ADMIN': return <AdminPanelSettings fontSize="small" />;
            case 'BUS_OPERATOR': return <DirectionsBus fontSize="small" />;
            default: return <Person fontSize="small" />;
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>User Management</Typography>
                    <Typography variant="body1" color="text.secondary">View and manage all system users</Typography>
                </Box>
                <TextField
                    placeholder="Search users..." variant="outlined" size="small"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 280 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#1e293b', border: 1, borderColor: 'divider' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, pl: 3 }}>USER</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>EMAIL</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>ROLE</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, pr: 3 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id || user.userId} hover>
                                            <TableCell sx={{ pl: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: `${getRoleColor(user.userType)}.main`, width: 36, height: 36 }}>
                                                        {user.fullName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight="600" variant="body2">{user.fullName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">ID: {user.userId?.substring(0, 8)}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{user.email}</Typography></TableCell>
                                            <TableCell>
                                                <Chip icon={getRoleIcon(user.userType)} label={user.userType?.replace('_', ' ')}
                                                    color={getRoleColor(user.userType)} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell align="right" sx={{ pr: 3 }}>
                                                <IconButton onClick={() => handleDeleteUser(user.id || user.userId)} size="small" color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                            <Typography color="text.secondary">No users found matching your search.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
}

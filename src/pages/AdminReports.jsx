import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, Grid, Card, CardContent,
    Button, CircularProgress, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TextField, Avatar
} from '@mui/material';
import {
    Assessment, Download, TrendingUp, People, DirectionsBus,
    AltRoute, Warning, Refresh, BarChart
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { ruraService } from '../services/ruraService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminReports() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reportType, setReportType] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0, totalBuses: 0, totalRoutes: 0,
        totalTrips: 0, totalPayments: 0, totalIncidents: 0
    });
    const [complianceData, setComplianceData] = useState([]);

    useEffect(() => {
        if (!user) { setError('Please log in to view reports.'); return; }
        loadOverviewData();
    }, [user]);

    const loadOverviewData = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const [users, buses, routes, incidents, compliance] = await Promise.all([
                adminService.getUsers().catch(() => []),
                adminService.getBuses().catch(() => []),
                api.get('/routes').catch(() => ({ data: [] })),
                ruraService.getIncidents().catch(() => []),
                ruraService.getOperatorCompliance().catch(() => [])
            ]);
            setStats({
                totalUsers: Array.isArray(users) ? users.length : 0,
                totalBuses: Array.isArray(buses) ? buses.length : 0,
                totalRoutes: Array.isArray(routes?.data) ? routes.data.length : 0,
                totalTrips: 0, totalPayments: 0,
                totalIncidents: Array.isArray(incidents) ? incidents.length : 0
            });
            setComplianceData(Array.isArray(compliance) ? compliance : []);
        } catch (err) {
            const status = err.response?.status;
            setError(status === 403 ? "Access denied." : status === 401 ? "Unauthorized." : "Failed to load report data.");
        } finally { setLoading(false); }
    };

    const handleExportReport = async () => {
        try { alert(await ruraService.exportMonthlyReport()); } catch { alert("Failed to export report"); }
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <Card sx={{ height: '100%', borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>{title}</Typography>
                        <Typography variant="h4" fontWeight="bold">{loading ? <CircularProgress size={24} /> : value}</Typography>
                        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
                    </Box>
                    <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 44, height: 44 }}>{icon}</Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>System Reports & Analytics</Typography>
                <Typography variant="body1" color="text.secondary">
                    Comprehensive reporting dashboard for system performance and compliance
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Report Type</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant={reportType === 'overview' ? 'contained' : 'outlined'} onClick={() => setReportType('overview')} startIcon={<BarChart />} size="small">Overview</Button>
                        <Button variant={reportType === 'compliance' ? 'contained' : 'outlined'} onClick={() => setReportType('compliance')} startIcon={<Assessment />} size="small">Compliance</Button>
                        <Button variant={reportType === 'operators' ? 'contained' : 'outlined'} onClick={() => setReportType('operators')} startIcon={<People />} size="small">Operators</Button>
                        <Button variant="outlined" onClick={loadOverviewData} startIcon={<Refresh />} size="small">Refresh</Button>
                        <Button variant="contained" color="secondary" startIcon={<Download />} onClick={handleExportReport} size="small">Export</Button>
                    </Box>
                </Box>
            </Paper>

            {reportType === 'overview' && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard title="Total Users" value={stats.totalUsers} icon={<People />} color="#6C63FF" subtitle="Registered users" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard title="Active Buses" value={stats.totalBuses} icon={<DirectionsBus />} color="#00BFA6" subtitle="Fleet size" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard title="Active Routes" value={stats.totalRoutes} icon={<AltRoute />} color="#F59E0B" subtitle="Monitored routes" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard title="Incidents" value={stats.totalIncidents} icon={<Warning />} color="#EF4444" subtitle="Reported incidents" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider', height: '100%' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom><TrendingUp sx={{ mr: 1, verticalAlign: 'middle', color: '#10B981' }} />System Health</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">User Growth</Typography>
                                        <Chip label="Active" color="success" size="small" />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Fleet Utilization</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#00BFA6">{stats.totalBuses > 0 ? 'Operational' : 'No Data'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Incident Rate</Typography>
                                        <Typography variant="body2" fontWeight="bold" color={stats.totalIncidents > 10 ? '#EF4444' : '#10B981'}>
                                            {stats.totalIncidents > 10 ? 'High' : 'Normal'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider', height: '100%' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Activity</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">• {stats.totalUsers} users registered</Typography>
                                    <Typography variant="body2" color="text.secondary">• {stats.totalRoutes} active routes</Typography>
                                    <Typography variant="body2" color="text.secondary">• {stats.totalBuses} buses in fleet</Typography>
                                    <Typography variant="body2" color="text.secondary">• {stats.totalIncidents} incidents reported</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}

            {reportType === 'compliance' && (
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Compliance Report - {new Date().toLocaleDateString()}</Typography>
                    <TableContainer sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Metric</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Value</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[{ metric: 'Safety Standards', value: '94%', status: 'Excellent', color: 'success' },
                                  { metric: 'Route Adherence', value: '87%', status: 'Good', color: 'warning' },
                                  { metric: 'Fare Regulations', value: '98%', status: 'Excellent', color: 'info' },
                                  { metric: 'Operator Compliance', value: `${complianceData.length} Operators`, status: 'Active', color: 'success' }
                                ].map(row => (
                                    <TableRow key={row.metric}>
                                        <TableCell sx={{ color: 'white' }}>{row.metric}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>{row.value}</TableCell>
                                        <TableCell><Chip label={row.status} color={row.color} size="small" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {reportType === 'operators' && (
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#1e293b', border: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Operator Performance Report</Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
                    ) : (
                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Operator</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Company</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Compliance Score</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Incidents</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {complianceData.map((op) => (
                                        <TableRow key={op.operatorId} hover>
                                            <TableCell sx={{ color: 'white' }}>{op.name}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{op.company || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: op.complianceScore > 80 ? '#10B981' : op.complianceScore > 50 ? '#F59E0B' : '#EF4444', fontWeight: 'bold' }}>
                                                    {op.complianceScore?.toFixed(1)}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white' }}>{op.totalIncidents || 0}</TableCell>
                                            <TableCell>
                                                <Chip label={op.status || 'ACTIVE'} color={op.status === 'SUSPENDED' ? 'error' : 'success'} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {complianceData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 5 }}>No operator data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}
        </Container>
    );
}

import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Paper, Typography, Button,
    List, ListItem, ListItemText, ListItemAvatar, Avatar,
    Chip, LinearProgress, IconButton, Divider, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    Warning, DirectionsBus, AltRoute, Launch,
    Gavel, Announcement, CheckCircle, ReportProblem,
    Security, Description
} from '@mui/icons-material';
import { ruraService } from '../services/ruraService';

const cardSx = { p: 3, borderRadius: 4, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)' };
const inputSx = { sx: { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } };
const inputLabelSx = { sx: { color: 'rgba(255,255,255,0.7)' } };

export default function RuraDashboard() {
    const [stats, setStats] = useState({ totalIncidents: 0, activeBuses: 0, activeRoutes: 0 });
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFineDialog, setOpenFineDialog] = useState(false);
    const [openLogsDialog, setOpenLogsDialog] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [fineForm, setFineForm] = useState({ issuedTo: '', amount: '', reason: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsData, incidentsData] = await Promise.all([
                ruraService.getStats(), ruraService.getIncidents()
            ]);
            setStats(statsData);
            setIncidents(incidentsData);
        } catch (error) {
            console.error("Failed to load RURA data", error);
        } finally { setLoading(false); }
    };

    const handleEmergencyBroadcast = () => alert("EMERGENCY BROADCAST SENT TO ALL OPERATORS!");
    const handleExportReport = async () => { try { alert(await ruraService.exportMonthlyReport()); } catch (e) { console.error(e); } };
    const handleOpenLogs = async () => { try { setAuditLogs(await ruraService.getAuditLogs()); setOpenLogsDialog(true); } catch (e) { console.error(e); } };

    const handleIssueFine = async () => {
        try {
            await ruraService.issueFine(fineForm);
            alert("Fine issued successfully");
            setOpenFineDialog(false);
            setFineForm({ issuedTo: '', amount: '', reason: '' });
        } catch (error) {
            console.error("Failed to issue fine", error);
            alert("Failed to issue fine");
        }
    };

    const handleReviewIncident = async (id) => {
        try {
            await ruraService.reviewIncident(id);
            setIncidents(incidents.map(inc =>
                inc.incidentId === id ? { ...inc, status: 'REVIEWED' } : inc
            ));
        } catch (error) { console.error("Failed to review incident", error); }
    };

    const StatCard = ({ value, label, icon, color }) => (
        <Paper sx={{ ...cardSx, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: `${color}20`, color, width: 56, height: 56 }}>{icon}</Avatar>
            <Box>
                <Typography variant="h4" fontWeight="bold">{value}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{label}</Typography>
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', pb: 4 }}>
            <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', pt: 4, pb: 6, px: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h3" fontWeight="800" sx={{ background: 'linear-gradient(45deg, #60A5FA 30%, #3B82F6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                                RURA Regulatory Dashboard
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>Rwanda Utilities Regulatory Authority - Transport Oversight</Typography>
                        </Box>
                        <Button variant="outlined" startIcon={<Launch />} href="https://rura.rw/" target="_blank" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                            Official Website
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard value={stats.totalIncidents} label="Total Incidents Reported" icon={<ReportProblem />} color="#ef4444" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard value={stats.activeBuses} label="Active Fleet Size" icon={<DirectionsBus />} color="#3b82f6" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard value={stats.activeRoutes} label="Monitored Routes" icon={<AltRoute />} color="#10b981" />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper sx={{ ...cardSx, minHeight: 500 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Recent Incident Reports</Typography>
                                <Chip label="Live Feed" color="error" size="small" variant="outlined" icon={<Warning />} />
                            </Box>
                            <List>
                                {incidents.length === 0 ? (
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>No incidents reported recently.</Typography>
                                ) : (
                                    incidents.map((incident, index) => (
                                        <React.Fragment key={incident.incidentId || index}>
                                            <ListItem alignItems="flex-start" sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                                                secondaryAction={incident.status !== 'REVIEWED' && (
                                                    <IconButton edge="end" onClick={() => handleReviewIncident(incident.incidentId)} sx={{ color: '#10b981' }}><CheckCircle /></IconButton>
                                                )}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: incident.status === 'REVIEWED' ? '#10b981' : '#ef4444' }}>
                                                        {incident.status === 'REVIEWED' ? <CheckCircle /> : <Warning />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={<Box sx={{ display: 'flex', justifyContent: 'space-between', mr: 4 }}>
                                                        <Typography variant="subtitle1" fontWeight="bold" color="white">{incident.type || 'General Incident'}</Typography>
                                                        <Typography variant="caption" color="rgba(255,255,255,0.5)">{incident.reportedAt ? new Date(incident.reportedAt).toLocaleDateString() : new Date().toLocaleDateString()}</Typography>
                                                    </Box>}
                                                    secondary={<Box>
                                                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 0.5 }}>{incident.description}</Typography>
                                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                            <Chip label={incident.location || "Unknown Location"} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                                                            <Chip label={incident.status || "Pending Review"} size="small" color={incident.status === 'REVIEWED' ? "success" : "warning"} variant="outlined" />
                                                        </Box>
                                                    </Box>}
                                                />
                                            </ListItem>
                                            {index < incidents.length - 1 && <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                                        </React.Fragment>
                                    ))
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper sx={cardSx}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Sector Compliance</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="rgba(255,255,255,0.7)">Safety Standards</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#10b981">94%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={94} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' }, borderRadius: 1, height: 8 }} />
                                </Box>
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="rgba(255,255,255,0.7)">Route Adherence</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#f59e0b">87%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={87} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' }, borderRadius: 1, height: 8 }} />
                                </Box>
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="rgba(255,255,255,0.7)">Fare Regulations</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#3b82f6">98%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={98} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' }, borderRadius: 1, height: 8 }} />
                                </Box>
                            </Paper>

                            <Paper sx={cardSx}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Regulatory Actions</Typography>
                                <Button fullWidth variant="contained" color="error" startIcon={<Announcement />} onClick={handleEmergencyBroadcast} sx={{ mt: 2, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}>Broadcast Emergency Alert</Button>
                                <Button fullWidth variant="outlined" startIcon={<Gavel />} onClick={() => setOpenFineDialog(true)} sx={{ mt: 2, py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 2, '&:hover': { borderColor: 'white' } }}>Issue Fine / Sanction</Button>
                                <Button fullWidth variant="outlined" startIcon={<Security />} onClick={handleOpenLogs} sx={{ mt: 2, py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 2, '&:hover': { borderColor: 'white' } }}>Audit Logs</Button>
                                <Button fullWidth variant="outlined" startIcon={<Description />} onClick={handleExportReport} sx={{ mt: 2, py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 2, '&:hover': { borderColor: 'white' } }}>Export Monthly Report</Button>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={openFineDialog} onClose={() => setOpenFineDialog(false)} PaperProps={{ sx: { borderRadius: 3, bgcolor: '#1e293b', color: 'white' } }}>
                <DialogTitle>Issue Fine / Sanction</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Operator Email / ID" fullWidth value={fineForm.issuedTo} onChange={(e) => setFineForm({ ...fineForm, issuedTo: e.target.value })} InputProps={inputSx} InputLabelProps={inputLabelSx} />
                    <TextField margin="dense" label="Amount (RWF)" type="number" fullWidth value={fineForm.amount} onChange={(e) => setFineForm({ ...fineForm, amount: e.target.value })} InputProps={inputSx} InputLabelProps={inputLabelSx} />
                    <TextField margin="dense" label="Reason" fullWidth multiline rows={3} value={fineForm.reason} onChange={(e) => setFineForm({ ...fineForm, reason: e.target.value })} InputProps={inputSx} InputLabelProps={inputLabelSx} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFineDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
                    <Button onClick={handleIssueFine} variant="contained" color="error">Issue Fine</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openLogsDialog} onClose={() => setOpenLogsDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: '#1e293b', color: 'white' } }}>
                <DialogTitle>System Audit Logs</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Timestamp</TableCell>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Action</TableCell>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Performed By</TableCell>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.logId}>
                                        <TableCell sx={{ color: 'white' }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                        <TableCell sx={{ color: '#60A5FA' }}>{log.action}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{log.performedBy}</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogsDialog(false)} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import RequestBus from './pages/RequestBus';
import TrackTrip from './pages/TrackTrip';
import Notifications from './pages/Notifications';
import TripHistory from './pages/TripHistory';
import Payment from './pages/Payment';
import RateTrip from './pages/RateTrip';
import BusesOnRoute from './pages/BusesOnRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateRoute from './pages/CreateRoute';
import CreateBusStop from './pages/CreateBusStop';
import OperatorDashboard from './pages/OperatorDashboard';
import OperatorTrips from './pages/OperatorTrips';
import IncidentReporting from './pages/IncidentReporting';
import UserManagement from './pages/UserManagement';
import FleetManagement from './pages/FleetManagement';
import FareManagement from './pages/FareManagement';
import RouteManagement from './pages/RouteManagement';
import Profile from './pages/Profile';
import BusHistory from './pages/BusHistory';
import PassengerIncidentReporting from './pages/PassengerIncidentReporting';
import Chat from './pages/Chat';
import RuraDashboard from './pages/RuraDashboard';
import IssueFine from './pages/IssueFine';
import ReviewIncidents from './pages/ReviewIncidents';
import OperatorCompliance from './pages/OperatorCompliance';
import AdminReports from './pages/AdminReports';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C63FF', // Modern Purple
        },
        secondary: {
            main: '#00BFA6', // Teal
        },
        background: {
            default: '#0F172A', // Deep Navy
            paper: '#1E293B', // Lighter Navy
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
});

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes wrapped in Layout */}
                        <Route element={<Layout />}>
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/request-bus" element={<PrivateRoute><RequestBus /></PrivateRoute>} />
                            <Route path="/track-trip/:tripId" element={<PrivateRoute><TrackTrip /></PrivateRoute>} />
                            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                            <Route path="/trip-history" element={<PrivateRoute><TripHistory /></PrivateRoute>} />
                            <Route path="/pay/:tripId" element={<PrivateRoute><Payment /></PrivateRoute>} />
                            <Route path="/rate-trip/:tripId" element={<PrivateRoute><RateTrip /></PrivateRoute>} />
                            <Route path="/buses-on-route/:routeId" element={<PrivateRoute><BusesOnRoute /></PrivateRoute>} />
                            <Route path="/incident-reporting" element={<PrivateRoute><PassengerIncidentReporting /></PrivateRoute>} />
                            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                            <Route path="/create-route" element={<PrivateRoute><CreateRoute /></PrivateRoute>} />
                            <Route path="/create-stop" element={<PrivateRoute><CreateBusStop /></PrivateRoute>} />
                            <Route path="/operator/dashboard" element={<PrivateRoute><OperatorDashboard /></PrivateRoute>} />
                            <Route path="/operator/trips" element={<PrivateRoute><OperatorTrips /></PrivateRoute>} />
                            <Route path="/operator/incidents" element={<PrivateRoute><IncidentReporting /></PrivateRoute>} />
                            <Route path="/admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
                            <Route path="/admin/fleet" element={<PrivateRoute><FleetManagement /></PrivateRoute>} />
                            <Route path="/admin/fares" element={<PrivateRoute><FareManagement /></PrivateRoute>} />
                            <Route path="/admin/routes" element={<PrivateRoute><RouteManagement /></PrivateRoute>} />
                            <Route path="/admin/bus-history/:busId" element={<PrivateRoute><BusHistory /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/rura/dashboard" element={<PrivateRoute><RuraDashboard /></PrivateRoute>} />
                            <Route path="/rura/issue-fine" element={<PrivateRoute><IssueFine /></PrivateRoute>} />
                            <Route path="/rura/review-incidents" element={<PrivateRoute><ReviewIncidents /></PrivateRoute>} />
                            <Route path="/rura/compliance" element={<PrivateRoute><OperatorCompliance /></PrivateRoute>} />
                            <Route path="/admin/reports" element={<AdminReports />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
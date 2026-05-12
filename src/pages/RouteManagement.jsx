import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material";
import {
  Delete,
  Edit,
  Add,
  Map,
  Place,
  Search,
  AltRoute,
  Directions,
  LocationOn,
  Straighten,
  Signpost,
  GpsFixed,
  DirectionsBus,
  Timeline,
  Explore,
} from "@mui/icons-material";
import { adminService } from "../services/adminService";
import api from "../services/api";

export default function RouteManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog States
  const [openRouteDialog, setOpenRouteDialog] = useState(false);
  const [openStopDialog, setOpenStopDialog] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({
    routeName: "",
    startStop: "",
    destinationStop: "",
  });
  const [currentStop, setCurrentStop] = useState({
    name: "",
    latitude: "",
    longitude: "",
    routeId: "",
    stopOrder: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stopOrder, setStopOrder] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const routesRes = await api.get("/routes");
      setRoutes(routesRes.data);
    } catch (e) {
      console.error("Failed to load routes", e);
      setError("Failed to load routes.");
    }
    try {
      const stopsData = await adminService.getStops();
      setStops(stopsData);
    } catch (e) {
      console.error("Failed to load stops", e);
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchTerm("");
  };

  // --- Route Handlers ---
  const handleSaveRoute = async () => {
    try {
      if (isEditing) {
        await adminService.updateRoute(currentRoute.routeId, currentRoute);
      } else {
        await adminService.createRoute(currentRoute);
      }
      setOpenRouteDialog(false);
      loadData();
    } catch (e) {
      console.error("Failed to save route", e);
      alert("Failed to save route.");
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm("Delete this route? This may affect assigned buses.")) {
      try {
        await adminService.deleteRoute(id);
        loadData();
      } catch (e) {
        console.error("Failed to delete route", e);
        alert("Failed to delete route.");
      }
    }
  };

  // --- Stop Handlers ---
  const handleSaveStop = async () => {
    try {
      const stopPayload = {
        ...currentStop,
        latitude: parseFloat(currentStop.latitude),
        longitude: parseFloat(currentStop.longitude),
        stopOrder: parseInt(currentStop.stopOrder, 10),
      };
      if (isEditing) {
        await adminService.updateStop(currentStop.stopId, stopPayload);
      } else {
        await adminService.createStop(stopPayload);
      }
      setOpenStopDialog(false);
      loadData();
    } catch (e) {
      console.error("Failed to save stop", e);
      alert("Failed to save stop.");
    }
  };

  const handleDeleteStop = async (id) => {
    if (window.confirm("Delete this bus stop?")) {
      try {
        await adminService.deleteStop(id);
        loadData();
      } catch (e) {
        console.error("Failed to delete stop", e);
        alert("Failed to delete stop.");
      }
    }
  };

  const filteredData =
    tabValue === 0
      ? routes.filter((r) =>
          r.routeName?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : stops.filter((s) =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: "linear-gradient(45deg, #FF9800 30%, #F44336 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Route Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage transport routes and bus stops
        </Typography>
      </Box>

      <Paper
        sx={{
          mb: 4,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.03)",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ px: 2, pt: 2 }}
        >
          <Tab
            label="Routes"
            icon={<AltRoute />}
            iconPosition="start"
            sx={{ minHeight: 60, fontSize: "1rem" }}
          />
          <Tab
            label="Bus Stops"
            icon={<Place />}
            iconPosition="start"
            sx={{ minHeight: 60, fontSize: "1rem" }}
          />
        </Tabs>

        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.2)",
          }}
        >
          <TextField
            placeholder={`Search ${tabValue === 0 ? "routes" : "stops"}...`}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.05)",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              if (tabValue === 0) {
                setCurrentRoute({
                  routeName: "",
                  startStop: "",
                  destinationStop: "",
                });
                setIsEditing(false);
                setOpenRouteDialog(true);
              } else {
                setCurrentStop({
                  name: "",
                  latitude: "",
                  longitude: "",
                  routeId: "",
                  stopOrder: "",
                });
                setIsEditing(false);
                setOpenStopDialog(true);
              }
            }}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(45deg, #FF9800 30%, #F44336 90%)",
            }}
          >
            Add New {tabValue === 0 ? "Route" : "Stop"}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      pl: 4,
                      py: 3,
                      fontWeight: 700,
                      color: "text.secondary",
                    }}
                  >
                    NAME
                  </TableCell>
                  <TableCell
                    sx={{ py: 3, fontWeight: 700, color: "text.secondary" }}
                  >
                    DETAILS
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      pr: 4,
                      py: 3,
                      fontWeight: 700,
                      color: "text.secondary",
                    }}
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.routeId || item.stopId}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}
                  >
                    <TableCell sx={{ pl: 4 }}>
                      <Typography fontWeight="600">
                        {tabValue === 0 ? item.routeName : item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {tabValue === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          {item.startStop} ➝ {item.destinationStop}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Lat: {item.latitude}, Lng: {item.longitude}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (tabValue === 0) {
                            setCurrentRoute(item);
                            setIsEditing(true);
                            setOpenRouteDialog(true);
                          } else {
                            setCurrentStop(item);
                            setIsEditing(true);
                            setOpenStopDialog(true);
                          }
                        }}
                        sx={{
                          color: "primary.main",
                          mr: 1,
                          bgcolor: "rgba(108, 99, 255, 0.1)",
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          tabValue === 0
                            ? handleDeleteRoute(item.routeId)
                            : handleDeleteStop(item.stopId)
                        }
                        sx={{
                          color: "error.main",
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Route Dialog */}
      <Dialog
        open={openRouteDialog}
        onClose={() => setOpenRouteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: "#1E293B", // Dark slate blue/grey
            backgroundImage: "none",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "white",
            p: 3,
            pb: 1,
          }}
        >
          {isEditing ? "Edit Route" : "Add Route"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              placeholder="Route Name"
              fullWidth
              variant="outlined"
              value={currentRoute.routeName}
              onChange={(e) =>
                setCurrentRoute({ ...currentRoute, routeName: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AltRoute sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              placeholder="Start Stop"
              fullWidth
              variant="outlined"
              value={currentRoute.startStop}
              onChange={(e) =>
                setCurrentRoute({ ...currentRoute, startStop: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              placeholder="Destination Stop"
              fullWidth
              variant="outlined"
              value={currentRoute.destinationStop}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  destinationStop: e.target.value,
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenRouteDialog(false)}
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontWeight: 600,
              "&:hover": { color: "white" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRoute}
            sx={{
              bgcolor: "#6C63FF",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "#5a52d5" },
            }}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stop Dialog */}
      <Dialog
        open={openStopDialog}
        onClose={() => setOpenStopDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: "#1E293B",
            backgroundImage: "none",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "white",
            p: 3,
            pb: 1,
          }}
        >
          {isEditing ? "Edit Stop" : "Add Stop"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              placeholder="Stop Name"
              fullWidth
              variant="outlined"
              value={currentStop.name}
              onChange={(e) =>
                setCurrentStop({ ...currentStop, name: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Signpost sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              placeholder="Latitude"
              type="number"
              fullWidth
              variant="outlined"
              value={currentStop.latitude}
              onChange={(e) =>
                setCurrentStop({ ...currentStop, latitude: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GpsFixed sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              placeholder="Longitude"
              type="number"
              fullWidth
              variant="outlined"
              value={currentStop.longitude}
              onChange={(e) =>
                setCurrentStop({ ...currentStop, longitude: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GpsFixed sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              select
              fullWidth
              value={currentStop.routeId}
              onChange={(e) =>
                setCurrentStop({ ...currentStop, routeId: e.target.value })
              }
              SelectProps={{ native: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsBus sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& select": { color: "white" },
                "& option": { color: "black" }, // Ensure options are visible
              }}
            >
              <option value="" style={{ color: "gray" }}>
                Select a Route
              </option>
              {routes.map((r) => (
                <option key={r.routeId} value={r.routeId}>
                  {r.routeName}
                </option>
              ))}
            </TextField>

            <TextField
              placeholder="Stop order"
              type="number"
              fullWidth
              variant="outlined"
              value={currentStop.stopOrder}
              onChange={(e) =>
                setCurrentStop({ ...currentStop, stopOrder: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GpsFixed sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenStopDialog(false)}
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontWeight: 600,
              "&:hover": { color: "white" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStop}
            sx={{
              bgcolor: "#6C63FF",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "#5a52d5" },
            }}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

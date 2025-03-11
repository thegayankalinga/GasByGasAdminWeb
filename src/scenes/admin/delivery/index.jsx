import { useState, useEffect } from "react";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Box,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header } from "./../../../components";
import { CreateRounded } from "@mui/icons-material";
import { tokens } from "./../../../theme/theme";
import { Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import StockService from "./../../../services/stock.service";
import userService from "./../../../services/user.service";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateDeliveryPopup from "../../../components/delivery/CreateDeliveryPopup";
import OutletService from "../../../services/outlet.service";
import DeliveryService from "../../../services/delivery.service";
import UpdateDeliveryPopup from "../../../components/delivery/UpdateDeliveryPopup"; // Import the update popup

const paginationModel = { page: 0, pageSize: 5 };

function DeliverySchedule() {
    const user = userService.getCurrentUser();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null); // Changed to selectedDelivery
    const [outlets, setOutlets] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await DeliveryService.getDelivery();
            if (response.data && Array.isArray(response.data)) {
                setData(response.data);
                setLoading(false);
            } else {
                setError("Data fetching error or invalid response");
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            if (error.response) {
                setError(`HTTP Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError("An unknown error occurred.");
            }
            setLoading(false);
        }
    };

    const fetchOutlets = async () => {
        try {
            const response = await OutletService.getAllOutlet();
            if (response && Array.isArray(response)) {
                setOutlets(response);
            } else {
                console.error("Failed to fetch outlets.");
            }
        } catch (error) {
            console.error("Error fetching outlets:", error);
        }
    };

    const handleOpenUpdatePopup = (delivery) => { // Changed to delivery
        setSelectedDelivery(delivery); // Changed to delivery
        setIsUpdatePopupOpen(true);
    };

    const handleCloseUpdatePopup = () => {
        setIsUpdatePopupOpen(false);
        setSelectedDelivery(null); // Changed to delivery
    };

    const handleUpdateSubmit = (updatedDeliveryData) => { // Changed to delivery
        updateStock(updatedDeliveryData);
        handleCloseUpdatePopup();
    };

    useEffect(() => {
        fetchData();
        fetchOutlets();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "deliveryDate", headerName: "Delivery Date", width: 150 },
        {
            field: "confirmedByAdmin",
            headerName: "Confirmed",
            width: 100,
            valueGetter: (params) => (params ? "Yes" : "No"),
        },
        { field: "noOfUnitsInDelivery", headerName: "Units in Delivery", width: 150 },
        {
            field: "outletId",
            headerName: "Outlet Name",
            width: 150,
            valueGetter: (params) => {
                const outlet = outlets.find((outlet) => outlet.id === params);
                return outlet ? outlet.outletName : "Unknown";
            },
        },
        { field: "dispatcherVehicleId", headerName: "Vehicle ID", width: 150 },
        {
            field: "edit",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => handleOpenUpdatePopup(params.row)}>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    const handlePopupOpen = () => setIsPopupOpen(true);
    const handlePopupClose = () => setIsPopupOpen(false);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <ToastContainer />
                <CircularProgress color="primary" sx={{ color: colors.blueAccent[700] }} />
            </Box>
        );
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <Box m="20px">
            <ToastContainer />
            <Box display="flex" justifyContent="space-between">
                <Header title="Delivery Schedules" />
                {!isXsDevices && (
                    <Box>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: colors.blueAccent[700],
                                color: "#fcfcfc",
                                fontSize: isMdDevices ? "14px" : "10px",
                                fontWeight: "bold",
                                p: "10px 20px",
                                mt: "18px",
                                transition: ".3s ease",
                                ":hover": { bgcolor: colors.blueAccent[800] },
                            }}
                            startIcon={<CreateRounded />}
                            onClick={handlePopupOpen}
                        >
                            Add Delivery
                        </Button>
                    </Box>
                )}
            </Box>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20]}
                    sx={{ border: 0 }}
                />
            </Paper>

            <CreateDeliveryPopup
                open={isPopupOpen}
                handleClose={handlePopupClose}
                rowData={user.outletId}
                fetchData={fetchData}
                outlets={outlets}
            />

            <UpdateDeliveryPopup // Add the update popup
                open={isUpdatePopupOpen}
                handleClose={handleCloseUpdatePopup}
                fetchData={fetchData}
                rowData={selectedDelivery}
                outlets={outlets}
            />
        </Box>
    );
}

export default DeliverySchedule;
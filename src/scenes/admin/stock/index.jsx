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
import StockAddPopup from "./../../../components/stock/StackAddPopup";
import StockUpdatePopup from "./../../../components/stock/StockUpdatePopup";
import userService from "./../../../services/user.service";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const paginationModel = { page: 0, pageSize: 5 };

function StockAdmin() {
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
    const [selectedStock, setSelectedStock] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await StockService.getStock(user.outletId);
            if (response && Array.isArray(response.data)) {
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

    const handleOpenUpdatePopup = (stock) => {
        setSelectedStock(stock);
        setIsUpdatePopupOpen(true);
    };

    const handleCloseUpdatePopup = () => {
        setIsUpdatePopupOpen(false);
        setSelectedStock(null);
    };

    const handleUpdateSubmit = (updatedStockData) => {
        // Call the updateStock function (passed as a prop) to update the stock
        updateStock(updatedStockData);
        handleUpdatePopupClose();
    };


    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        // { field: "outletId", headerName: "Outlet ID", width: 100 },
        { field: "requestedDate", headerName: "Requested Date", width: 150 },
        { field: "completed", headerName: "Completed", width: 100, valueGetter: (params) => params.completed ? "Yes" : "No" },
        { field: "noOfUnitsRequired", headerName: "Units Required", width: 130 },
        { field: "noOfUnitsDispatched", headerName: "Units Dispatched", width: 150 },
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
                <Header title="Stocks" />
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

            <StockUpdatePopup
                open={isUpdatePopupOpen}
                handleClose={handleCloseUpdatePopup}
                handleSubmit={handleUpdateSubmit}
                rowData={selectedStock}
            />
            <StockAddPopup
                open={isPopupOpen}
                handleClose={handlePopupClose}
                rowData={user.outletId}
                fetchData={fetchData}
            />
        </Box>
    );
}

export default StockAdmin;
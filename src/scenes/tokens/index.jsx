import { useState, useEffect } from "react";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Header } from "../../components";
import { CreateRounded } from "@mui/icons-material";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import GasTokenService from "./../../services/gastoken.service";
import OutletService from "./../../services/outlet.service";
import TokenFormPopup from "./../../components/token/TokenFormPopup";
import { SystemUserType, getSystemUserType } from "./../../utils/SystemUserType";
import userService from "./../../services/user.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit } from "@mui/icons-material";

function Tokens() {
    const user = userService.getCurrentUser();
    const [data, setData] = useState(null);
    const [outlets, setOutlets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState("");  // State to track search input
    const theme = useTheme();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [rowData, setRowData] = useState(null); 

    const columns = [
        { field: "requestDate", headerName: "Date", type: "number", width: 100 },
        { field: "expectedPickupDate", headerName: "Expected Pickup Date", type: "number", width: 100 },
        { field: "isEmpltyCylindersGiven", headerName: "Empty Cylinder", width: 80, valueGetter: (params) => params ? "Received" : "Not Yet" },
        { field: "isPaid", headerName: "Payment", width: 80, valueGetter: (params) => params ? "Received" : "Not Yet" },
        { field: "paymentDate", headerName: "Payment Date", type: "number", width: 90, valueGetter: (params) => params ? params : "_" },
        { field: "readyDate", headerName: "Cylinder Collectable Date", type: "number", width: 100, valueGetter: (params) => params ? params : "_" },
        { field: "outletName", headerName: "Outlet Name", width: 100 },
        { field: "outletAddress", headerName: "Outlet Address", width: 150 },
        { field: "outletCity", headerName: "City", type: "number", width: 80 },
        { field: "status", headerName: "Status", type: "number", width: 100 },
        { 
            field: "edit", 
            headerName: "Action", 
            width: 100, 
            renderCell: (params) => (
                <IconButton onClick={() => handlePopupOpen(params.row)}>
                    <Edit />
                </IconButton>
            )
        }
    ];
    
    const paginationModel = { page: 0, pageSize: 5 };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await GasTokenService.getAll();
            if (response) {
                const outlets = await OutletService.getAllOutlet();
                setOutlets(outlets);
                const arr = response.map(element => {
                    const outlet = outlets.find(out => out.id === element.outletId);
                    return outlet ? { ...element, outletName: outlet.outletName, outletCity: outlet.city, outletAddress: outlet.outletAddress } : element;
                });
                setData(arr);
                setLoading(false);
            } else {
                setError("Data fetching error");
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePopupOpen = (row) => {
        setRowData(row);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => setIsPopupOpen(false);

    const handleSearchChange = (e) => {
        setSearchEmail(e.target.value);
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        const exDate = formData.expectedPickupDate.format("YYYY-MM-DD");
        const outletId = formData.outletID;
        const SystemUserType = getSystemUserType(user.userType);
        const email = user.email;

        try {
            const response = await GasTokenService.createReq({ "expectedPickupDate": exDate, "userType": SystemUserType }, { "outletId": outletId, "consumerEmail": email });
            if (response) {
                toast.success('Gas Request Successfully Created.');
                fetchData();
            } else {
                toast.error('Something missing');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on email search
    const filteredData = data?.filter(row => row.userEmail?.toLowerCase().includes(searchEmail.toLowerCase()));

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full viewport height
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
                <Header title="My Tokens" subtitle="List Of Your GBG Tokens" />
                <TextField
                    label="Search by Email"
                    variant="outlined"
                    value={searchEmail}
                    onChange={handleSearchChange}
                    sx={{ width: '300px', marginBottom: '20px' }}
                />
            </Box>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={filteredData || []}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20]}
                    sx={{ border: 0 }}
                />
            </Paper>
            <TokenFormPopup open={isPopupOpen} handleClose={handlePopupClose} handleSubmit={handleFormSubmit} outletOptions={outlets} rowData={rowData} />
        </Box>
    );
}

export default Tokens;

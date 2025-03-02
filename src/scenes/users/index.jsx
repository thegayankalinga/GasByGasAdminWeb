import { useState, useEffect } from "react";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Box, Button, TextField, useMediaQuery, useTheme, Paper } from "@mui/material";
import { Header } from "../../components";
import { CreateRounded, Edit } from "@mui/icons-material";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import GasTokenService from "./../../services/gastoken.service";
import OutletService from "./../../services/outlet.service";
import TokenFormPopup from "./../../components/token/TokenFormPopup";
import userService from "./../../services/user.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationService from "../../services/notification.service";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Users() {
    const [data, setData] = useState(null);
    const [outlets, setOutlets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rowData, setRowData] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "Id", width: 50 },
        { field: "requestDate", headerName: "Date", width: 100 },
        { field: "expectedPickupDate", headerName: "Expected Pickup Date", width: 120 },
        { field: "outletName", headerName: "Outlet Name", width: 150 },
        { field: "status", headerName: "Status", width: 100 },
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await GasTokenService.getAll();
            const outletsData = await OutletService.getAllOutlet();
            setOutlets(outletsData);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePopupOpen = (row) => {
        setRowData(row);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => setIsPopupOpen(false);

    const handleSearchChange = (e) => {
        setSearchEmail(e.target.value);
    };

    const filteredData = data?.filter(row => row.userEmail?.toLowerCase().includes(searchEmail.toLowerCase()));

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("User Data", 20, 10);
        doc.autoTable({
            head: [columns.map(col => col.headerName)],
            body: filteredData.map(row => columns.map(col => row[col.field] || "-")),
        });
        doc.save("UserData.pdf");
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <ToastContainer />
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <Box m="20px">
            <ToastContainer />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Header title="User Management" subtitle="Manage Users & Requests" />
                <Box>
                    <TextField label="Search by Email" variant="outlined" value={searchEmail} onChange={handleSearchChange} sx={{ mr: 2 }} />
                    <Button variant="contained" color="primary" onClick={downloadPDF}>Download as PDF</Button>
                </Box>
            </Box>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid rows={filteredData || []} columns={columns} pageSizeOptions={[5, 10, 20]} />
            </Paper>
            <TokenFormPopup open={isPopupOpen} handleClose={handlePopupClose} rowData={rowData} />
        </Box>
    );
}

export default Users;

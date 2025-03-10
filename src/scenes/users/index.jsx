import { useState, useEffect } from "react";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Box, Button, TextField, useMediaQuery, useTheme, Paper } from "@mui/material";
import { Header } from "../../components";
import { Edit } from "@mui/icons-material";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import userService from "./../../services/user.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserUpdatePopup from "./../../components/user/UserUpdatePopup";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Users() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rowData, setRowData] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "email", headerName: "Email", width: 100 },
        { field: "fullName", headerName: "Full name", width: 120 },
        { field: "nic", headerName: "Nic", width: 150 },
        { field: "isConfirm", headerName: "Is Active", width: 100 },
        { field: "phoneNumber", headerName: "Phone number", width: 100 },
        { field: "address", headerName: "Address", width: 100 },
        { field: "city", headerName: "City", width: 100 },
        {
            field: "userType",
            headerName: "User Type",
            width: 100,
            valueGetter: (params) => {
                switch (params.userType) {
                    case 0:
                        return "Personal";
                    case 1:
                        return "Business";
                    case 2:
                        return "Industry";
                    default:
                        return "Unknown";
                }
            },
        },
        {
            field: "edit",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => handlePopupOpen(params.row)}>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userService.getConsumers();
            setData(response.data);
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

    const filteredData = data.filter(row => row.email?.toLowerCase().includes(searchEmail.toLowerCase()));

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
                <Header title="User Management" subtitle="List of outlet consumers" />
                <Box>
                    <TextField label="Search by Email" variant="outlined" value={searchEmail} onChange={handleSearchChange} sx={{ mr: 2 }} />
                    <Button variant="contained" color="primary" onClick={downloadPDF}>Download as PDF</Button>
                </Box>
            </Box>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={filteredData || []}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    getRowId={(row) => row.email}
                />
            </Paper>
            <UserUpdatePopup
                open={isPopupOpen}
                handleClose={handlePopupClose}
                rowData={rowData}
                fetchData={fetchData} // Pass fetchData to the popup
            />
        </Box>
    );
}

export default Users;
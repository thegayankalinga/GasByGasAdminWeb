import { useState, useEffect } from "react";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Box, Button, TextField, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"; 
import { Header } from "../../components";
import { CreateRounded } from "@mui/icons-material";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
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
import { Edit, Delete } from "@mui/icons-material";

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
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const columns = [
        { field: "id", headerName: "Id", type: "number", width: 5 },
        { field: "requestDate", headerName: "Date", type: "number", width: 100 },
        { field: "expectedPickupDate", headerName: "Expected Pickup Date", type: "number", width: 100 },
        { field: "isEmpltyCylindersGiven", headerName: "Empty Cylinder", width: 80, valueGetter: (params) => params ? "Received" : "Not Yet" },
        { field: "isPaid", headerName: "Payment", width: 80, valueGetter: (params) => params ? "Received" : "Not Yet" },
        { field: "paymentDate", headerName: "Payment Date", type: "number", width: 90, valueGetter: (params) => params ? params : "_" },
        { field: "readyDate", headerName: "Cylinder Collectable Date", type: "number", width: 100, valueGetter: (params) => params ? params : "_" },
        { field: "outletName", headerName: "Outlet Name", width: 100 },
        { field: "outletAddress", headerName: "Outlet Address", width: 150 },
        { field: "outletCity", headerName: "City", type: "number", width: 80 },
        {
            field: "status",
            headerName: "Token Status",
            width: 100,
            valueGetter: (params) => {
                switch (params) {
                    case 1:
                        return "Pending";
                    case 2:
                        return "Assigned";
                    case 3:
                        return "Completed";
                    case 4:
                        return "Cancelled";
                    default:
                        return "Unknown"; // Or handle other cases
                }
            },
        },
        {
            field: "edit",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handlePopupOpen(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteConfirmOpen(params.row.id)}>
                        <Delete />
                    </IconButton>
                </>
            )
        }
    ];
    const handleDeleteConfirmOpen = (id) => {
        setDeleteId(id);
        setOpenDeleteConfirm(true);
    };

    const handleDeleteConfirmClose = () => {
        setOpenDeleteConfirm(false);
    };
    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await GasTokenService.deleteReq(deleteId);
            if (response) {
                toast.success('Gas Request Successfully Deleted.');
                fetchData();
            } else {
                toast.error('Deletion failed.');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setOpenDeleteConfirm(false);
        }
    };

    const paginationModel = { page: 0, pageSize: 5 };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await GasTokenService.getByOutletId(user.outletId);
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

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Define table headers and data
        const columns = ["Id", "Date", "Expected Pickup Date", "Empty Cylinder", "Payment", "Payment Date", "Cylinder Collectable Date", "Outlet Name", "Outlet Address", "City", "Token Status"];
        const rows = data?.map((row) => [
            row.id,
            row.requestDate,
            row.expectedPickupDate,
            row.isEmpltyCylindersGiven ? "Received" : "Not Yet",
            row.isPaid ? "Received" : "Not Yet",
            row.paymentDate || "_",
            row.readyDate || "_",
            row.outletName,
            row.outletAddress,
            row.outletCity,
            row.status === 1 ? "Pending" : row.status === 2 ? "Assigned" : row.status === 3 ? "Completed" : row.status === 4 ? "Cancelled" : "Unknown"
        ]);

        // Add table to PDF
        autoTable(doc, {
            head: [columns],
            body: rows,
        });

        // Save the PDF
        doc.save("User_Management_Data.pdf");
    };



    const handleFormSubmit = async (formData) => {
        setLoading(true);
        const body = {
            "expectedPickupDate": formData.expectedPickupDate.format("YYYY-MM-DD"),
            "paymentDate": formData.paymentDate.format("YYYY-MM-DD"),
            "outletId": formData.outletID,
            "status": formData.status,
            "userEmail": formData.userEmail,
            "deliveryScheduleId": formData.deliveryScheduleId,
            "isEmpltyCylindersGivent": formData.isEmpltyCylindersGiven,
            "isPaid": formData.isPaid,
            "readyDate": formData.readyDate.format("YYYY-MM-DD"),
        };

        try {
            const response = await GasTokenService.updateReq(body, formData.id);
            if (response) {
                toast.success('Gas Request Successfully Updated.');
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
                <Header title="Outlet Tokens" subtitle="" />
                <TextField
                    label="Search by Email"
                    variant="outlined"
                    value={searchEmail}
                    onChange={handleSearchChange}
                    sx={{ width: '300px', marginBottom: '20px' }}
                />
            </Box>
            <Button variant="contained" color="primary" onClick={downloadPDF}>
                Download as PDF
            </Button>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={filteredData || []}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 100]}
                    sx={{ border: 0 }}
                />
                <Dialog
        open={openDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this item?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDeleteConfirmClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
            </Paper>
            <TokenFormPopup open={isPopupOpen} handleClose={handlePopupClose} handleSubmit={handleFormSubmit} outletOptions={outlets} rowData={rowData} />
        </Box>
    );
}

export default Tokens;

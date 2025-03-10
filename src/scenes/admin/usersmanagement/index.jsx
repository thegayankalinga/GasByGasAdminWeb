import { useState, useEffect } from "react";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Header, ProgressCircle, StatBox } from "../../../components";
import { tokens } from "../../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import OutletService from "./../../../services/outlet.service";
import UserService from "./../../../services/user.service";
import EditIcon from '@mui/icons-material/Edit';
import ManagerUpdatePopup from "./../../../components/user/ManagerUpdatePopup"; // Import ManagerUpdatePopup

function UserManagement() {
    const [outlets, setOutlets] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [openEditPopup, setOpenEditPopup] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

   
const columns = [
    { field: "email", headerName: "Email", width: 200 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    {
        field: "isConfirm",
        headerName: "Is Active",
        width: 100,
        valueGetter: (params) => {
            return params && params ? "Yes" : "No";
        },
    },
    { field: "consumerType", headerName: "Consumer Type", width: 150 },
    { field: "outletId", headerName: "Outlet ID", width: 150 },
    {
        field: "actions",
        headerName: "Actions",
        width: 100,
        renderCell: (params) => (
            <IconButton onClick={() => handleEdit(params.row)}>
                <EditIcon />
            </IconButton>
        ),
    },
];

const paginationModel = { page: 0, pageSize: 5 };
const handleEdit = (row) => {
    setSelectedRowData(row);
    setOpenEditPopup(true);
};

    const handleCloseEditPopup = () => {
        setOpenEditPopup(false);
        setSelectedRowData(null);
    };
    const fetchData = async () => {
        if (selectedOutlet) {
            setLoading(true);
            try {
                const response = await UserService.getUsersByOutletId(selectedOutlet);
                if (response && response.data) {
                    const usersWithId = response.data.map(user => ({ ...user, id: user.email }));
                    setData(usersWithId);
                } else if (response && response.status === 204) { // Check for 204 No Content
                    setData([]); // Set empty array if 204
                } else {
                    setError("User data fetching error");
                    setData([]);
                }
            } catch (error) {
                setError(error);
                setData([]);
            } finally {
                setLoading(false);
            }
        } else {
            setData(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const response = await OutletService.getAllOutlet();
                if (response) {
                    setOutlets(response);
                } else {
                    setError("Outlet data fetching error");
                }
            } catch (error) {
                setError(error);
            }
        };

        fetchOutlets();
    }, []);

    useEffect(() => {
        fetchData()
    }, [selectedOutlet]);

    const handleOutletChange = (event) => {
        setSelectedOutlet(event.target.value);
    };

    if (loading) {
        return <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress color="primary" sx={{ color: colors.blueAccent[700] }} />
        </Box>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between">
                <Header title="Managers" subtitle="Outlets Users" />
            </Box>
            <FormControl fullWidth margin="dense">
                <InputLabel id="outlet-select-label">Select Outlet</InputLabel>
                <Select
                    labelId="outlet-select-label"
                    id="outlet-select"
                    value={selectedOutlet}
                    label="Select Outlet"
                    onChange={handleOutletChange}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {outlets.map((outlet) => (
                        <MenuItem key={outlet.id} value={outlet.id}>{outlet.outletName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
                {data && <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20]}
                    sx={{ border: 0 }}
                />}
            </Paper>
            <ManagerUpdatePopup
                open={openEditPopup}
                handleClose={handleCloseEditPopup}
                rowData={selectedRowData}
                fetchData={fetchData}
            />
        </Box>
    );
}

export default UserManagement;
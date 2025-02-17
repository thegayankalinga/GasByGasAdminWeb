import { useContext, useState, useEffect } from "react";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Box,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header, ProgressCircle, StatBox } from "../../components";
import { tokens } from "../../theme/theme";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OutletService from "./../../services/outlet.service";
import userService from "./../../services/user.service"

function Outlets() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const user = userService.getCurrentUser();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await OutletService.getOutlet(user.outletId);
                if (response) {
                    setData(response);
                } else {
                    setError("Data fetching error");
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
            }}
        >
            <CircularProgress color="primary" sx={{ color: colors.blueAccent[700] }} />      </Box>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between">
                <Header title="Outlet Details" />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell size="medium">Fields</TableCell>
                            <TableCell align="left" size="medium">Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">Outlet Name</TableCell>
                            <TableCell align="left">{data.outletName}</TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">Outlet Address</TableCell>
                            <TableCell align="left">{data.outletAddress}</TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">Outlet City</TableCell>
                            <TableCell align="left">{data.city}</TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">Outlet Manager Name</TableCell>
                            <TableCell align="left">{user.fullName}</TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">Outlet Manager Email Address</TableCell>
                            <TableCell align="left">{user.email}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
export default Outlets;

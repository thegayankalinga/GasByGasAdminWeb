import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';  // Import dayjs for date manipulation

function TokenFormPopup({ open, handleClose, handleSubmit, outletOptions, rowData }) {
    const [formData, setFormData] = useState({
        readyDate: null,
        expectedPickupDate: null,
        status: "",
        isEmpltyCylindersGiven: false,
        isPaid: false,
        paymentDate: null,
        userEmail: "",
        deliveryScheduleId: "",
        outletID: "",
    });

    useEffect(() => {
        if (rowData) {
            setFormData({
                readyDate: rowData.readyDate ? dayjs(rowData.readyDate) : null,  // Ensure valid Dayjs object
                expectedPickupDate: rowData.expectedPickupDate ? dayjs(rowData.expectedPickupDate) : null,
                status: rowData.status || "",
                isEmpltyCylindersGiven: rowData.isEmpltyCylindersGiven || false,
                isPaid: rowData.isPaid || false,
                paymentDate: rowData.paymentDate ? dayjs(rowData.paymentDate) : null,
                userEmail: rowData.userEmail || "",
                deliveryScheduleId: rowData.deliveryScheduleId || "",
                outletID: rowData.outletId || "",
            });
        }
    }, [rowData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (name, date) => {
        setFormData({ ...formData, [name]: date });
    };

    const handleFormSubmit = () => {
        handleSubmit(formData);
        handleClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{rowData ? "Edit Gas Request" : "Create New Gas Request"}</DialogTitle>
                <DialogContent>
                    <DatePicker
                        label="Ready Date"
                        value={formData.readyDate}
                        onChange={(date) => handleDateChange("readyDate", date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />

                    <DatePicker
                        label="Expected Pickup Date"
                        value={formData.expectedPickupDate}
                        onChange={(date) => handleDateChange("expectedPickupDate", date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />

                    <TextField
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Empty Cylinders Given</InputLabel>
                        <Select
                            name="isEmpltyCylindersGiven"
                            value={formData.isEmpltyCylindersGiven}
                            onChange={handleChange}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Payment Received</InputLabel>
                        <Select
                            name="isPaid"
                            value={formData.isPaid}
                            onChange={handleChange}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Payment Date"
                        value={formData.paymentDate}
                        onChange={(date) => handleDateChange("paymentDate", date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />

                    <TextField
                        label="User Email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled
                    />

                    <TextField
                        label="Delivery Schedule ID"
                        name="deliveryScheduleId"
                        value={formData.deliveryScheduleId}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Outlet</InputLabel>
                        <Select
                            name="outletID"
                            value={formData.outletID}
                            onChange={handleChange}
                        >
                            {outletOptions.map((outlet) => (
                                <MenuItem key={outlet.id} value={outlet.id}>
                                    {outlet.outletName} - {outlet.city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleFormSubmit} color="primary">{rowData ? "Update" : "Submit"}</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

export default TokenFormPopup;

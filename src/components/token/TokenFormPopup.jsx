import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function TokenFormPopup({ open, handleClose, handleSubmit, outletOptions }) {
    const [formData, setFormData] = useState({
        expectedPickupDate: null,
        outletID: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, expectedPickupDate: date });
    };

    const handleFormSubmit = () => {
        handleSubmit(formData);
        handleClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create new Gas Requests</DialogTitle>
                <DialogContent>
                    <DatePicker
                        label="Expected Pickup Date"
                        value={formData.expectedPickupDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Outlet ID</InputLabel>
                        <Select
                            label="Outlet ID"
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
                    <Button onClick={handleFormSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

export default TokenFormPopup;

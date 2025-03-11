import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function StockUpdatePopup({ open, handleClose, handleSubmit, rowData }) {
    const [formData, setFormData] = useState({
        id: "",
        outletId: "",
        completed: false,
        noOfUnitsDispatched: "",
        completedDate: null,
    });

    useEffect(() => {
        if (rowData) {
            setFormData({
                id: rowData.id || "",
                outletId: rowData.outletId || "",
                completed: rowData.completed || false,
                noOfUnitsDispatched: rowData.noOfUnitsDispatched || "",
                completedDate: rowData.completedDate ? dayjs(rowData.completedDate) : null,
            });
        }
    }, [rowData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, completedDate: date });
    };

    const handleFormSubmit = () => {
        handleSubmit({
            ...formData,
            completedDate: formData.completedDate ? formData.completedDate.format('YYYY-MM-DD') : null,
        });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogContent>
                {formData.id && (
                    <TextField
                        label="ID"
                        value={formData.id}
                        fullWidth
                        margin="dense"
                        disabled
                        sx={{ display: 'none' }} // Added display: 'none'
                    />
                )}
                <TextField
                    label="Outlet ID"
                    name="outletId"
                    value={formData.outletId}
                    fullWidth
                    margin="dense"
                    disabled
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.completed}
                            onChange={(e) => handleChange({ target: { name: 'completed', type: 'checkbox', checked: e.target.checked } })}
                            name="completed"
                        />
                    }
                    label="Completed"
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Completed Date"
                        value={formData.completedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                        shouldDisableDate={(date) => date.isBefore(dayjs(), 'day')}
                    />
                </LocalizationProvider>

                <TextField
                    label="Number of Units Dispatched"
                    name="noOfUnitsDispatched"
                    type="number"
                    value={formData.noOfUnitsDispatched}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleFormSubmit} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockUpdatePopup;
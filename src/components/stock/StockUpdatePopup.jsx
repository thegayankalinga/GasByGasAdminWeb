import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

function StockUpdatePopup({ open, handleClose, handleSubmit, rowData }) {
    const [formData, setFormData] = useState({
        outletId: "",
        completed: false,
        noOfUnitsDispatched: "",
    });

    useEffect(() => {
        if (rowData) {
            setFormData({
                outletId: rowData.outletId || "",
                completed: rowData.completed || false,
                noOfUnitsDispatched: rowData.noOfUnitsDispatched || "",
            });
        }
    }, [rowData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = () => {
        handleSubmit(formData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogContent>
                <TextField
                    label="Outlet ID"
                    name="outletId"
                    value={formData.outletId}
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
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
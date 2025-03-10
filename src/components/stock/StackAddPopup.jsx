import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import StockService from "../../services/stock.service";
import { toast } from 'react-toastify';

function StockAddPopup({ open, handleClose, fetchData, rowData }) { // Remove handleSubmit prop, not needed
    const [formData, setFormData] = useState({
        outletId: "",
        noOfUnitsRequired: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (rowData) {
            setFormData({
                outletId: rowData,
                noOfUnitsRequired: "",
            });
        } else {
            setFormData({
                outletId: "",
                noOfUnitsRequired: "",
            });
        }
    }, [rowData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await StockService.addStock(formData);
            if (response) {
                toast.success('Stock added successfully!');
                fetchData();
                handleClose();
            } else {
                toast.error('Failed to add stock. Please try again.');
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error('An error occurred while adding stock.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Outlet</InputLabel>
                    <Select
                        name="outletId"
                        value={formData.outletId}
                        onChange={handleChange}
                        disabled={true} // Disable the select
                    >
                        <MenuItem value={formData.outletId}>{formData.outletId}</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Number of Units Required"
                    name="noOfUnitsRequired"
                    type="number"
                    value={formData.noOfUnitsRequired}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={loading}>Cancel</Button>
                <Button onClick={handleFormSubmit} color="primary" disabled={loading}>
                    {loading ? "Adding..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockAddPopup;
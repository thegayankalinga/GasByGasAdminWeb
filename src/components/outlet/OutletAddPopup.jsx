import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import OutletService from "../../services/outlet.service";
import { toast } from 'react-toastify';

function OutletAddPopup({ open, handleClose, fetchData }) {
    const [formData, setFormData] = useState({
        outletName: "",
        outletAddress: "",
        city: "",
        stock: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) { // Reset form only when popup opens
            setFormData({
                outletName: "",
                outletAddress: "",
                city: "",
                stock: 0,
            });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseInt(value, 10) : value });
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await OutletService.addOutlet(formData); // Assuming StockService has addOutlet function
            if (response) {
                toast.success('Outlet added successfully!');
                fetchData();
                handleClose();
            } else {
                toast.error('Failed to add outlet. Please try again.');
            }
        } catch (error) {
            console.error("API Error:", error);
            //toast.error('An error occurred while adding outlet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Outlet</DialogTitle>
            <DialogContent>
                <TextField
                    label="Outlet Name"
                    name="outletName"
                    value={formData.outletName}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Outlet Address"
                    name="outletAddress"
                    value={formData.outletAddress}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
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

export default OutletAddPopup;
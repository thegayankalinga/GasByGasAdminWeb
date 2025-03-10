import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from "@mui/material";
import DeliveryService from "../../services/delivery.service";
import { toast } from 'react-toastify';

function CreateDeliveryPopup({ open, handleClose, fetchData, rowData, outlets }) {
    const [formData, setFormData] = useState({
        deliveryDate: new Date().toISOString().split('T')[0],
        confirmedByAdmin: false,
        noOfUnitsInDelivery: "",
        outletId: rowData || (outlets.length > 0 ? outlets[0].id : ""),
        dispatcherVehicleId: "",
    });
    const [loading, setLoading] = useState(false);
    const [outletName, setOutletName] = useState("");

    useEffect(() => {
        if (rowData) {
            setFormData({
                outletId: rowData,
                deliveryDate: new Date().toISOString().split('T')[0],
                confirmedByAdmin: false,
                noOfUnitsInDelivery: "",
                dispatcherVehicleId: "",
            });
            const foundOutlet = outlets.find(outlet => outlet.id === rowData);
            setOutletName(foundOutlet ? foundOutlet.name : "");
        } else if (outlets.length > 0) {
            setFormData({
                deliveryDate: new Date().toISOString().split('T')[0],
                confirmedByAdmin: false,
                noOfUnitsInDelivery: "",
                outletId: outlets[0].id,
                dispatcherVehicleId: "",
            });
            setOutletName(outlets[0].name);
        } else {
            setFormData({
                deliveryDate: new Date().toISOString().split('T')[0],
                confirmedByAdmin: false,
                noOfUnitsInDelivery: "",
                outletId: "",
                dispatcherVehicleId: "",
            });
            setOutletName("");
        }
    }, [rowData, outlets]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (name === "outletId") {
            const foundOutlet = outlets.find(outlet => outlet.id === value);
            setOutletName(foundOutlet ? foundOutlet.name : "");
        }
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await DeliveryService.addDelivery(formData);
            if (response) {
                toast.success('Delivery created successfully!');
                fetchData();
                handleClose();
            } else {
                toast.error('Failed to create delivery. Please try again.');
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error('An error occurred while creating delivery.');
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Delivery</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Outlet</InputLabel>
                    <Select
                        name="outletId"
                        value={formData.outletId}
                        onChange={handleChange}
                    >
                        {outlets.map((outlet) => (
                            <MenuItem key={outlet.id} value={outlet.id}>
                                {outlet.outletName} - {outlet.outletAddress}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: getMinDate()
                    }}
                />

                <TextField
                    label="Number of Units in Delivery"
                    name="noOfUnitsInDelivery"
                    type="number"
                    value={formData.noOfUnitsInDelivery}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />

                <TextField
                    label="Dispatcher Vehicle ID"
                    name="dispatcherVehicleId"
                    type="text"
                    value={formData.dispatcherVehicleId}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.confirmedByAdmin}
                            onChange={handleChange}
                            name="confirmedByAdmin"
                        />
                    }
                    label="Confirmed By Admin"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={loading}>Cancel</Button>
                <Button onClick={handleFormSubmit} color="primary" disabled={loading}>
                    {loading ? "Creating..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateDeliveryPopup;
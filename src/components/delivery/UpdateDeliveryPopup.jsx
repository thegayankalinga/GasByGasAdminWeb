import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from "@mui/material";
import DeliveryService from "../../services/delivery.service";
import { toast } from 'react-toastify';

function UpdateDeliveryPopup({ open, handleClose, fetchData, rowData, outlets }) {
    const [formData, setFormData] = useState({
        deliveryDate: rowData?.deliveryDate || new Date().toISOString().split('T')[0],
        confirmedByAdmin: rowData?.confirmedByAdmin || false,
        noOfUnitsInDelivery: rowData?.noOfUnitsInDelivery || "",
        outletId: rowData?.outletId || (outlets.length > 0 ? outlets[0].id : ""),
        dispatcherVehicleId: rowData?.dispatcherVehicleId || "",
    });
    const [loading, setLoading] = useState(false);
    const [outletName, setOutletName] = useState("");

    useEffect(() => {
        if (rowData) {
            setFormData({
                deliveryDate: rowData.deliveryDate,
                confirmedByAdmin: rowData.confirmedByAdmin,
                noOfUnitsInDelivery: rowData.noOfUnitsInDelivery,
                outletId: rowData.outletId,
                dispatcherVehicleId: rowData.dispatcherVehicleId,
            });
            const foundOutlet = outlets.find(outlet => outlet.id === rowData.outletId);
            setOutletName(foundOutlet ? foundOutlet.outletName : "");
        } else if (outlets.length > 0) {
            setFormData({
                deliveryDate: new Date().toISOString().split('T')[0],
                confirmedByAdmin: false,
                noOfUnitsInDelivery: "",
                outletId: outlets[0].id,
                dispatcherVehicleId: "",
            });
            setOutletName(outlets[0].outletName);
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
            setOutletName(foundOutlet ? foundOutlet.outletName : "");
        }
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await DeliveryService.updateDelivery(rowData.id, formData);
            if (response) {
                toast.success('Delivery updated successfully!');
                fetchData();
                handleClose();
            } else {
                toast.error('Failed to update delivery. Please try again.');
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error('An error occurred while updating delivery.');
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Delivery</DialogTitle>
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
                    {loading ? "Updating..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateDeliveryPopup;
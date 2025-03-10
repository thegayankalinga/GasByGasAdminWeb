import { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import userService from "./../../services/user.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme/theme";
import React from 'react';

function ManagerUpdatePopup({ open, handleClose, rowData, fetchData }) { // Renamed the component
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        id: "",
        isConfirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (rowData) {
            setFormData({
                id: rowData.email || "",
                isConfirm: rowData.isConfirm || false,
            });
        }
    }, [rowData]);

    useEffect(() => {
        if (!open) {
            setFormData({
                id: "",
                isConfirm: false,
            });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (updateType) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (updateType) {
                case "isConfirm":
                    response = await userService.updateIsConfirm(formData.id, {
                        isConfirm: formData.isConfirm,
                    });
                    break;
                default:
                    throw new Error("Invalid update type");
            }
            if (response && response.status === 200) {
                toast.success(`Manager ${updateType} updated successfully.`);
                fetchData();
                handleClose();
            } else {
                toast.error(`Failed to update manager ${updateType}.`);
            }
        } catch (err) {
            setError(err);
            toast.error(`Error updating manager ${updateType}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Manager Details</DialogTitle>
            <DialogContent>
                <TextField
                    label="Email"
                    name="id"
                    value={formData.id}
                    fullWidth
                    margin="dense"
                    disabled
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="isConfirm-label">Is Active</InputLabel>
                    <Select
                        labelId="isConfirm-label"
                        id="isConfirm"
                        name="isConfirm"
                        value={formData.isConfirm}
                        label="Is Active"
                        onChange={handleChange}
                    >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={() => handleUpdate("isConfirm")}
                    style={{ backgroundColor: colors.primary[400], color: "white" }}
                >
                    Update Is Active
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(ManagerUpdatePopup); 
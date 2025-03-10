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

function UserUpdatePopup({ open, handleClose, rowData, fetchData }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    id: "",
    noOfCylindersAllowed: "",
    isConfirm: false,
    remainingCylindersAllowed: "",
    businessRegistration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (rowData) {
      setFormData({
        id: rowData.email || "",
        noOfCylindersAllowed: rowData.noOfCylindersAllowed || "",
        isConfirm: rowData.isConfirm || false,
        remainingCylindersAllowed: rowData.remainingCylindersAllowed || "",
        businessRegistration: rowData.businessRegistration || "",
      });
    }
  }, [rowData]);

  useEffect(() => {
    if (!open) {
      setFormData({
        id: "",
        noOfCylindersAllowed: "",
        isConfirm: false,
        remainingCylindersAllowed: "",
        businessRegistration: "",
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
        case "cylindersAllowed":
          response = await userService.updateCylindersAllowed(formData.id, {
            noOfCylindersAllowed: formData.noOfCylindersAllowed,
          });
          break;
        case "isConfirm":
          response = await userService.updateIsConfirm(formData.id, {
            isConfirm: formData.isConfirm,
          });
          break;
        case "remainingCylinders":
          response = await userService.updateRemainingCylinders(formData.id, {
            remainingCylindersAllowed: formData.remainingCylindersAllowed,
          });
          break;
        default:
          throw new Error("Invalid update type");
      }
      if (response && response.status === 200) {
        toast.success(`User ${updateType} updated successfully.`);
        fetchData();
        handleClose();
      } else {
        toast.error(`Failed to update user ${updateType}.`);
      }
    } catch (err) {
      setError(err);
      toast.error(`Error updating user ${updateType}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          name="id"
          value={formData.id}
          fullWidth
          margin="dense"
          disabled
        />
        <TextField
          label="Number of Cylinders Allowed"
          name="noOfCylindersAllowed"
          value={formData.noOfCylindersAllowed}
          onChange={handleChange}
          fullWidth
          margin="dense"
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
        <TextField
          label="Remaining Cylinders Allowed"
          name="remainingCylindersAllowed"
          value={formData.remainingCylindersAllowed}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Business Registration"
          name="businessRegistration"
          value={formData.businessRegistration}
          onChange={handleChange}
          fullWidth
          margin="dense"
          style={{ display: formData.businessRegistration ? 'block' : 'none' }} // Conditional display
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => handleUpdate("cylindersAllowed")}
          style={{ backgroundColor: colors.primary[400], color: "white" }}
        >
          Update Cylinders Allowed
        </Button>
        <Button
          onClick={() => handleUpdate("isConfirm")}
          style={{ backgroundColor: colors.primary[400], color: "white" }}
        >
          Update Is Active
        </Button>
        <Button
          onClick={() => handleUpdate("remainingCylinders")}
          style={{ backgroundColor: colors.primary[400], color: "white" }}
        >
          Update Remaining Cylinders
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(UserUpdatePopup);
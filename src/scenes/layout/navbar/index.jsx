import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from 'react';
import { tokens, ColorModeContext } from "../../../theme/theme";
import { useContext } from "react";
import "./style.css";
import AuthService from "./../../..//services/auth/auth.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import ConfirmPopup from './../../../components/confirmation_popup/ConfirmPopup';
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../SystemUser";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);
  const [showDialog, setShowDialog] = useState(false);
  const [userAgreed, setUserAgreed] = useState(null);

  const logout = async () => {
    try {
      const logoutResponse = await AuthService.logout();
      if (logoutResponse) {
        toast.success('Logout successfully you will redirect to Home page');
        setInterval(() => {
          navigate("/", { replace: true });
        }, 2000);
      }
      else {
        toast.error('Something missing');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoutClick = () => {
    setShowDialog(true);
  };

  const handleAgree = () => {
    setUserAgreed(true);
    setShowDialog(false);
    logout();
  };

  const handleDisagree = () => {
    setUserAgreed(false);
    setShowDialog(false);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    > <ToastContainer />
      {showDialog && (
        <ConfirmPopup
          open={showDialog}
          handleClose={handleDisagree}
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
          title='Waiting for your confirmation'
          content='Are you really want to log out'
          yesOptionTxt='Yes'
          noOptionTxt='No'
        />
      )}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
      </Box>

      <Box>
        {/* <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton> */}
        <IconButton onClick={handleLogoutClick}>
          <LogoutOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;

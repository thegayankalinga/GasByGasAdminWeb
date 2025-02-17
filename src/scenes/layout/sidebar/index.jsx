/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { tokens } from "../../../theme/theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  HelpOutlineOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import avatar from "../../../assets/images/avatar.png";
import Item from "./Item";
import { ToggledContext } from "../../SystemUser";
import userService from "./../../../services/user.service"
import { SystemUserType, getSystemUserType } from "./../../../utils/SystemUserType";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = userService.getCurrentUser();

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Gas By Gas
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>

            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              {user.fullName}
            </Typography>
            <Typography
              variant="4"
              fontWeight="600"
              color={colors.greenAccent[500]}
            >
              {getSystemUserType(user.userType)}
            </Typography>

          </Box>
        </Box>
      )}


      {(user.userType == 3) ?

        <Box mb={5} pl={collapsed ? undefined : "5%"}>
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >
            <Item
              title="Dashboard"
              path="/admin"
              colors={colors}
              icon={<DashboardOutlined />}
            />
          </Menu>
          <Typography
            variant="h6"
            color={colors.gray[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!collapsed ? "Gas Outlets" : " "}
          </Typography>{" "}
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >

            <Item
              title="Outlets"
              path="/admin/outlets"
              colors={colors}
              icon={<WarehouseIcon />}
            />
            

            <Item
              title="Managers"
              path="/admin/users"
              colors={colors}
              icon={<PeopleAltOutlined />}
            />
          </Menu>
          <Typography
            variant="h6"
            color={colors.gray[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!collapsed ? "Users" : " "}
          {!collapsed ? "Users" : " "}
          </Typography>{" "}
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >

            <Item
              title="User Management"
              path="/admin/outlets"
              colors={colors}
              icon={<WarehouseIcon />}
            />
            

           
          </Menu>
        </Box>
        :
        <Box mb={5} pl={collapsed ? undefined : "5%"}>
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >
            <Item
              title="Dashboard"
              path="/manager"
              colors={colors}
              icon={<DashboardOutlined />}
            />

            <Item
              title="Gas Token"
              path="/manager/mytoken"
              colors={colors}
              icon={<ReceiptOutlined />}
            />

          </Menu>
          <Typography
            variant="h6"
            color={colors.gray[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!collapsed ? "Gas Stations" : " "}
          </Typography>{" "}
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >

            <Item
              title="Outlet Details"
              path="/manager/outlets"
              colors={colors}
              icon={<PeopleAltOutlined />}
            />
          </Menu>
        </Box>
      }

    </Sidebar>
  );
};

export default SideBar;

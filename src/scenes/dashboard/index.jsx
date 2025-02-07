import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  ProgressCircle,
  StatBox,
} from "../../components";
import {
  DownloadOutlined,
  Traffic,
} from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import { tokens } from "../../theme/theme";
import { mockTransactions } from "../../data/mockData";
import userService from "./../../services/user.service";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StoreIcon from '@mui/icons-material/Store';
import { SystemUserType, getSystemUserType } from "./../../utils/SystemUserType";
function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const user = userService.getCurrentUser();
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          bgcolor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle={
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                {user.noOfCylindersAllowed} Cylinders Allowed
              </Typography>
            }
            progress={user.noOfCylindersAllowed / 10}
            icon={
              <PropaneTankIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle={
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                {user.remainingCylindersAllowed} Remaining Cylinders
              </Typography>
            }
            progress={user.remainingCylindersAllowed / 10}
            icon={
              <PropaneTankIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle={
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                {(user.isConfirm) ? "Active" : "In Active"} Account
              </Typography>
            }
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle={
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                {getSystemUserType(user.userType)}
              </Typography>
            }
            icon=
            {user.userType === 0
              ? <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
              : user.userType === 1
                ? <StoreIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
                />
                : <WarehouseIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
                />}
          />
        </Box>


        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h4" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              textAlign="center"
              variant="h4"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography textAlign="center">
              Includes extra misc expenditures and costs
            </Typography>
          </Box>
        </Box> */}

       
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="250px"
            mt="-20px"
          >
            asdasdasd
          </Box>
        </Box> */}

       
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h4" fontWeight="600" mb="15px">
            Geography Based Traffic
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
          >
            adasdasdasd
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
}

export default Dashboard;

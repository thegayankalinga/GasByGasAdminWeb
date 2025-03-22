import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header, StatBox } from "../../components";
import PersonIcon from '@mui/icons-material/Person';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import { tokens } from "../../theme/theme";
import userService from "./../../services/user.service";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StoreIcon from '@mui/icons-material/Store';
import { getSystemUserType } from "./../../utils/SystemUserType";
import GasTokenService from "./../../services/gastoken.service";
import { useState, useEffect } from 'react';

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const user = userService.getCurrentUser();

  const [statusCounts, setStatusCounts] = useState({
      Pending: 0,
      Assigned: 0,
      Completed: 0,
      Cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchTokenData = async () => {
          setLoading(true);
          try {
              const response = await GasTokenService.getByOutletId(user.outletId);
              if (response && Array.isArray(response)) {
                  const counts = {
                      Pending: 0,
                      Assigned: 0,
                      Completed: 0,
                      Cancelled: 0,
                  };

                  response.forEach(token => {
                      switch (token.status) {
                          case 1:
                              counts.Pending++;
                              break;
                          case 2:
                              counts.Assigned++;
                              break;
                          case 3:
                              counts.Completed++;
                              break;
                          case 4:
                              counts.Cancelled++;
                              break;
                          default:
                              break;
                      }
                  });

                  setStatusCounts(counts);
              } else {
                  setError("Data fetching error");
              }
          } catch (error) {
              setError(error);
          } finally {
              setLoading(false);
          }
      };

      fetchTokenData();
  }, [user.outletId]);

  if (loading) {
      return <Box m="20px">Loading...</Box>;
  }

  if (error) {
      return <Box m="20px">Error: {error}</Box>;
  }
  if (user.userType === 4 && !user.isConfirm)  {
    return <Box m="20px">Account not active</Box>;
}

  return (
      <Box m="20px">
          <Box display="flex" justifyContent="space-between">
              <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
          </Box>

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
                  bgcolor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
              >
                  <StatBox
                      subtitle={
                          <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                              Pending Tokens: {statusCounts.Pending}
                          </Typography>
                      }
                      icon={
                          <PropaneTankIcon
                              sx={{ color: colors.orange[500], fontSize: "50px" }}
                          />
                      }
                  />
              </Box>
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
                              Assigned Tokens: {statusCounts.Assigned}
                          </Typography>
                      }
                      icon={
                          <PropaneTankIcon
                              sx={{ color: colors.blueAccent[500], fontSize: "50px" }}
                          />
                      }
                  />
              </Box>
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
                              Completed Tokens: {statusCounts.Completed}
                          </Typography>
                      }
                      icon={
                          <PropaneTankIcon
                              sx={{ color: colors.greenAccent[500], fontSize: "50px" }}
                          />
                      }
                  />
              </Box>
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
                              Cancelled Tokens: {statusCounts.Cancelled}
                          </Typography>
                      }
                      icon={
                          <PropaneTankIcon
                              sx={{ color: colors.redAccent[500], fontSize: "50px" }}
                          />
                      }
                  />
              </Box>
          
          </Box>
      </Box>
  );
}

export default Dashboard;
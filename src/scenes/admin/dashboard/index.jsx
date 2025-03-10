import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header, StatBox } from "../../../components";
import PersonIcon from '@mui/icons-material/Person';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import { tokens } from "../../../theme/theme";
import userService from "./../../../services/user.service";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StoreIcon from '@mui/icons-material/Store';
import { getSystemUserType } from "./../../../utils/SystemUserType";
import StockService from "../../../services/stock.service"; // Import StockService
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const user = userService.getCurrentUser();

  const [pendingStockRequests, setPendingStockRequests] = useState(0);
  const [completedStockRequests, setCompletedStockRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await StockService.getStock();
        if (response && Array.isArray(response.data)) {
          let pendingCount = 0;
          let completedCount = 0;

          response.data.forEach(stock => {
            if (stock.completed) {
              completedCount++;
            } else {
              pendingCount++;
            }
          });

          setPendingStockRequests(pendingCount);
          setCompletedStockRequests(completedCount);
        } else {
          setError("Stock data fetching error");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return <Box m="20px">Loading...</Box>;
  }

  if (error) {
    return <Box m="20px">Error: {error}</Box>;
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
                Pending Stock Requests: {pendingStockRequests}
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
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle={
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "20px", color: "#FFF" }}>
                Completed Stock Requests: {completedStockRequests}
              </Typography>
            }
            icon={
              <PropaneTankIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
        </Box>
       
      </Box>
    </Box>
  );
}

export default AdminDashboard;
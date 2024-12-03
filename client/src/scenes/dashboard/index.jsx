import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import Card from "../../components/Card";
import ProgressCircle from "../../components/ProgressCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store sales data and loading state
  const [salesData, setSalesData] = useState([]);
  const [cardsData, setCardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true);

  // Fetch sales_data API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/sales_data")
      .then((response) => {
        // Get the last 10 transactions
        setSalesData(response.data.slice(-50).reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales data", error);
        setLoading(false);
      });
  }, []);

  // Fetch cards_data API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/cards_data")
      .then((response) => {
        setCardsData(response.data);
        setCardsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cards data", error);
        setCardsLoading(false);
      });
  }, []);

  return (
    <Box m='20px'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title='Dashboard' subtitle='Welcome to your dashboard' />

        {/* DOWNLOAD BUTTON */}
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridAutoRows='140px'
        gap='20px'
      >
        {/* ROW 1 */}
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Card
            title={cardsData?.november_orders || "loading..."}
            subtitle='Orders this month'
            progress={cardsData?.percentage_diff_orders || "loading..."}
            increase={`${
              cardsData?.percentage_diff_orders > 0
                ? `+${cardsData?.percentage_diff_orders * 100}`
                : cardsData?.percentage_diff_orders * 100
            } %`}
            icon={
              <LocalShippingIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Card
            title={`${cardsData?.november_income || "loading..."}€`}
            subtitle='Income value'
            progress={cardsData?.percentage_diff_income || "loading..."}
            increase={`${
              cardsData?.percentage_diff_income > 0
                ? `+${cardsData?.percentage_diff_income * 100}`
                : cardsData?.percentage_diff_income * 100
            } %`}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Card
            title={cardsData?.november_new_clients || "loading..."}
            subtitle='New Clients'
            progress={cardsData?.percentage_diff_new_clients || "loading..."}
            increase={`${
              cardsData?.percentage_diff_new_clients > 0
                ? `+${cardsData?.percentage_diff_new_clients * 100}`
                : cardsData?.percentage_diff_new_clients * 100
            } %`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Card
            title={cardsData?.november_inbound_traffic || "loading..."}
            subtitle='Traffic Inbound'
            progress={
              cardsData?.percentage_diff_inbound_traffic || "loading..."
            }
            increase={`${
              cardsData?.percentage_diff_inbound_traffic > 0
                ? `+${cardsData?.percentage_diff_inbound_traffic * 100}`
                : cardsData?.percentage_diff_inbound_traffic * 100
            } %`}
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn='span 8'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt='25px'
            p='0 30px'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box>
              <Typography
                variant='h5'
                fontWeight='600'
                color={colors.grey[100]}
              >
                Sales by Month
              </Typography>
            </Box>
          </Box>
          {/* LINE CHART */}
          <Box height='250px' mt='-20px' ml='40px'>
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        {/* TRANSACTIONS */}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          overflow='auto'
        >
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p='15px'
          >
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              Recent Transactions
            </Typography>
          </Box>

          {loading ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              height='100%'
            >
              <CircularProgress size={60} sx={{ color: colors.grey[100] }} />
            </Box>
          ) : (
            salesData.map((transaction) => (
              <Box
                key={transaction.saleId}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                borderBottom={`4px solid ${colors.primary[500]}`}
                p='15px'
              >
                <Box flex='1'>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant='h5'
                    fontWeight='600'
                  >
                    {transaction.saleId}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.clientName}
                  </Typography>
                </Box>
                <Box flex='1' textAlign='center' color={colors.grey[100]}>
                  {new Date(transaction.saleDate).toLocaleDateString()}
                </Box>
                <Box flex='1' display='flex' justifyContent='flex-end'>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p='5px 10px'
                    borderRadius='4px'
                  >
                    {transaction.finalPrice}€
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          p='30px'
        >
          <Typography variant='h5' fontWeight='600'>
            Annual Balance
          </Typography>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            mt='25px'
          >
            <ProgressCircle
              size='124'
              progress={
                cardsData?.percentage_diff_income_year != null
                  ? cardsData.percentage_diff_income_year
                  : "loading..."
              }
            />
            <Typography
              variant='h5'
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {`${cardsData?.annual_income_2024 || "loading..."}€  ${
                cardsData?.percentage_diff_income_year > 0
                  ? `+${cardsData?.percentage_diff_income_year * 100}`
                  : cardsData?.percentage_diff_income_year * 100
              } %`}
            </Typography>
            <Typography variant='h5' fontWeight='600' mt='5px'>
              Total Revenue in 2024
            </Typography>
          </Box>
        </Box>

        {/* BAR CHART */}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant='h5'
            fontWeight='600'
            sx={{ p: "30px 30px 0 30px" }}
          >
            Traffic by Month
          </Typography>
          <Box height='250px' mt='-27px'>
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* GEOGRAPHY CHART */}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          p='30px'
        >
          <Typography variant='h5' fontWeight='600' sx={{ mb: "15px" }}>
            Sales by Country
          </Typography>
          <Box height='200px'>
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Invoices() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store sales data fetched from the API
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch sales data from the API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/sales_data"
        );
        setSalesData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchSalesData();
  }, []); // Empty dependency array to run only once when the component mounts

  const columns = [
    { field: "saleId", headerName: "ID" },
    { field: "saleDate", headerName: "Date", flex: 1 },
    {
      field: "productBrand",
      headerName: "Brand",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "productModel",
      headerName: "Model",
      flex: 1,
    },
    {
      field: "productCategory",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "saleQuantity",
      headerName: "Qty",
      flex: 0.3,
    },
    {
      field: "finalPrice",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={colors.greenAccent[500]}
          sx={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {params.row.finalPrice.toFixed(2)} €{" "}
          {/* Rounding the price to 2 decimal places */}
        </Typography>
      ),
    },
    {
      field: "registerId",
      headerName: "Client ID",
      flex: 0.5,
    },
    {
      field: "clientName",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "clientCity",
      headerName: "City",
      flex: 1,
    },
    {
      field: "clientCountry",
      headerName: "Country",
      flex: 1,
    },
  ];

  return (
    <Box m='20px'>
      <Header
        title='Sales Data'
        subtitle='List of all sales made on the platform'
      />
      <Box
        m='40px 0 0 0'
        height='75vh'
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
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
          <DataGrid
            rows={salesData}
            columns={columns}
            getRowId={(row) => row.saleId}
            sortModel={[
              {
                field: "saleId",
                sort: "desc", // Sorting by saleId in descending order
              },
            ]}
            slots={{ toolbar: GridToolbar }} // Adding the GridToolbar
          />
        )}
      </Box>
    </Box>
  );
}

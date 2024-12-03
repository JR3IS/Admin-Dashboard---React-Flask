import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Team() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/team_data");
        setTeamData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    // Confirmation alert
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} selected user(s)?`
    );

    if (!confirmDelete) return;

    try {
      // Loop through selected rows and delete each user
      for (const userId of selectedRows) {
        await axios.delete(`http://127.0.0.1:5000/api/users/${userId}`);
      }

      // Update frontend after successful deletion
      setTeamData((prev) =>
        prev.filter((row) => !selectedRows.includes(row.id))
      );
      setSelectedRows([]);
      alert("Selected users deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete selected users.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width='60%'
            m='0 auto'
            p='5px'
            display='flex'
            justifyContent='center'
            mt='10px'
            alignItems='center'
            backgroundColor={
              access === "Admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius='4px'
          >
            {access === "Admin" && <AdminPanelSettingsOutlined />}
            {access === "Manager" && <SecurityOutlined />}
            {access === "User" && <LockOpenOutlined />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m='20px'>
      <Header title='Team' subtitle='Manage the Team Members' />
      <Box m='40px 0 20px 0' display='flex' justifyContent='flex-end'>
        <Button
          color='secondary'
          variant='contained'
          disabled={selectedRows.length === 0}
          onClick={handleDelete}
        >
          Delete Selected
        </Button>
      </Box>
      <Box
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
            rows={teamData}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
          />
        )}
      </Box>
    </Box>
  );
}

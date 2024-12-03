import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";
import { useTheme, Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";

export default function PieChart({ isDashboard = false }) {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch the pie chart data from the backend
    const fetchPieChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/pie_chart_data"
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchPieChartData();
  }, []);

  return data.length === 0 ? (
    // Show the loading spinner while data is being fetched
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: isDashboard ? "250px" : "800px",
      }}
    >
      <CircularProgress size={60} sx={{ color: colors.grey[100] }} />
    </Box>
  ) : (
    // Render the pie chart when data is available
    <ResponsivePie
      data={data}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      activeOuterRadiusOffset={8}
      innerRadius={0.3} // Increases space between arcs
      padAngle={0.5} // Adds space between pie segments
      cornerRadius={1} // Rounds the corners of pie segments
      colors={[
        colors.blueAccent[200],
        colors.blueAccent[300],
        colors.blueAccent[400],
        colors.blueAccent[500],
        colors.blueAccent[600],
        colors.greenAccent[200],
        colors.greenAccent[300],
        colors.greenAccent[400],
        colors.greenAccent[500],
        colors.greenAccent[600],
      ]}
      borderColor={{
        from: "color",
        modifiers: [["opacity", "0"]],
      }}
      enableArcLinkLabels={false}
      enableArcLabels={true}
      arcLabelsRadiusOffset={0.5}
      arcLabelsSkipAngle={20}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 10]],
      }}
      arcLabel={"id"}
      tooltip={({ datum }) => (
        <div
          style={{
            padding: "5px",
            color: colors.grey[100],
            background: colors.primary[400],
            fontSize: "16px",
            borderRadius: "4px",
          }}
        >
          <strong>{datum.id}:</strong> {datum.value}%
        </div>
      )}
      legends={[]}
      theme={{
        labels: {
          text: {
            fontSize: 15, // Increase label font size
            fill: colors.grey[100],
          },
        },
        legends: {
          text: {
            fontSize: 12, // Increase legend font size
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
            fontSize: 12,
          },
        },
      }}
    />
  );
}

import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures.js";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function GeographyChart({ isDashboard = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store geo chart data and loading state
  const [geoChartData, setGeoChartData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch geo chart data from the API
  useEffect(() => {
    const fetchGeoChartData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/geo_chart_data"
        );
        setGeoChartData(response.data);
      } catch (error) {
        console.error("Error fetching geo chart data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchGeoChartData();
  }, []); // Empty dependency array to fetch data only once on mount

  // If loading, show CircularProgress
  if (loading) {
    return (
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
    );
  }

  return (
    <ResponsiveChoropleth
      data={geoChartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[500],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[500],
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        },
      }}
      valueFormat='.2s' // Scientific notation with 2 significant digits
      tooltip={({ feature }) => {
        // Check if the feature has a valid value
        if (!feature.value || feature.value === 0) {
          return null;
        }

        return (
          <div
            style={{
              color: colors.primary[100],
              backgroundColor: colors.primary[400],
              padding: "9px",
              borderRadius: "4px",
            }}
          >
            <strong>{feature.label}</strong>: {feature.formattedValue} €
          </div>
        );
      }}
      colors={[
        colors.blueAccent[800],
        colors.blueAccent[500],
        colors.greenAccent[300],
        colors.greenAccent[200],
        colors.greenAccent[100],
      ]}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 400000]}
      unknownColor={colors.grey[700]}
      label='properties.name'
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={0.5}
      borderColor={colors.grey[600]}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
}

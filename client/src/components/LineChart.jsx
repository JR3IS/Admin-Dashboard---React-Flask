import { ResponsiveLine } from "@nivo/line";
import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

export default function LineChart({
  isCustomLineColors = true,
  isDashboard = false,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineChartData, setLineChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/line_chart_data")
      .then((response) => {
        const data = response.data;
        setYears([
          ...new Set(data.map((item) => item.id)), // Extract years from the 'id'
        ]);
        setLineChartData(data); // Directly set the data returned from the backend
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching line chart data:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: isDashboard ? "35px" : "130px",
        }}
      >
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: "8px",
            fontSize: isDashboard ? "12px" : "17px",
            borderRadius: "4px",
            border: "1px solid #cccccc",
            backgroundColor: "#cccccc",
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Box>

      {isLoading ? (
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
        <ResponsiveLine
          data={lineChartData.filter(
            (data) => !selectedYear || data.id === selectedYear // Filter by year
          )}
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
                  stroke: colors.grey[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.grey[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
            tooltip: {
              container: {
                color: colors.primary[500],
              },
            },
          }}
          // Custom line color
          colors={isCustomLineColors ? colors.greenAccent[600] : ["#FF6600"]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "500000",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=' >-.2f'
          curve='natural'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: undefined,
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5,
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: undefined,
            legendOffset: -60,
            legendPosition: "middle",
            format: (value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value.toFixed(1);
            },
          }}
          enableGridX={false}
          enableGridY={isDashboard ? false : true}
          lineWidth={5}
          enableArea={true}
          areaBaselineValue={500000}
          areaOpacity={0.35}
          pointSize={10}
          pointColor={colors.greenAccent[700]}
          pointBorderWidth={4}
          pointBorderColor={colors.greenAccent[700]}
          enableSlices='x'
          sliceTooltip={({ slice }) => {
            return (
              <div
                style={{
                  background: colors.primary[400],
                  padding: "12px",
                  borderRadius: "4px",
                }}
              >
                <div>
                  <strong>{slice.points[0].data.xFormatted}</strong>
                </div>
                <div>
                  Sales: <strong>{slice.points[0].data.yFormatted}€</strong>
                </div>
              </div>
            );
          }}
        />
      )}
    </>
  );
}

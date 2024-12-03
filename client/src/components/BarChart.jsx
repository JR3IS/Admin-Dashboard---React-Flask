import { Box, useTheme, CircularProgress } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from "react";

export default function BarChart({ isDashboard = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartData, setChartData] = useState([]);
  const [keys, setKeys] = useState(["inbound_traffic", "unique_visitors"]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bar_chart_data"
        );
        const data = await response.json();

        setChartData(data);

        const uniqueYears = [
          ...new Set(data.map((item) => item.year_month.split("-")[0])),
        ];
        setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Abbreviate month names in the data
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const filteredData = selectedYear
    ? chartData.filter((item) => item.year_month.startsWith(selectedYear))
    : chartData;

  const transformedData = filteredData.map((item) => {
    const [_, month] = item.year_month.split("-");
    return {
      ...item,
      year_month: `${monthNames[parseInt(month) - 1]}`, // Only month name
    };
  });

  useEffect(() => {
    console.log("Chart Data:", chartData);
    console.log("Filtered Data:", filteredData);
    console.log("Keys:", keys);
  }, [chartData, filteredData, keys]);

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

      <ResponsiveBar
        data={transformedData}
        keys={["unique_visitors", "inbound_traffic"]}
        indexBy='year_month'
        log={true}
        theme={{
          axis: {
            domain: { line: { stroke: colors.grey[100] } },
            legend: { text: { fill: colors.grey[100] } },
            ticks: {
              line: { stroke: colors.grey[100], strokeWidth: 1 },
              text: { fill: colors.grey[100] },
            },
          },
          legends: { text: { fill: colors.grey[100] } },
          tooltip: {
            container: { background: "white", color: "black" }, // Tooltip style
          },
        }}
        tooltip={({ data }) => (
          <div
            style={{
              color: colors.primary[100],
              backgroundColor: colors.primary[400],
              padding: "9px",
              borderRadius: "4px",
            }}
          >
            <p>
              Inbound Traffic : <strong>{data.inbound_traffic}</strong>
            </p>
            <p>
              Unique Visitors : <strong>{data.unique_visitors}</strong>
            </p>
          </div>
        )}
        margin={{ top: 50, right: 150, bottom: 60, left: 80 }} // Adjusted margins
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={[colors.greenAccent[500], colors.blueAccent[500]]}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Month",
          legendPosition: "middle",
          legendOffset: 40, // Move X-axis label further down
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Inbound Traffic",
          legendPosition: "middle",
          legendOffset: -60, // Move Y-axis label further left
          format: (value) => (value >= 1000 ? `${value / 1000}k` : value), // Abbreviate values
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 140, // Move legends further away
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 120,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: { itemOpacity: 1 },
              },
            ],
          },
        ]}
        enableLabel={false}
        barAriaLabel={(e) =>
          `${e.id}: ${e.formattedValue} in ${e.indexValue} month`
        }
      />
    </>
  );
}

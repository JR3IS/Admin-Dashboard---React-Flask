import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

export default function Pie() {
  return (
    <Box m='20px'>
      <Header
        title='Sales by Category'
        subtitle='Percentage of sales for each major category in the current year'
      />
      <Box height='75vh'>
        <PieChart />
      </Box>
    </Box>
  );
}

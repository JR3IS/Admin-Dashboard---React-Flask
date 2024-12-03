import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

export default function Bar() {
  return (
    <Box m='20px'>
      <Header
        title='Traffic by Month'
        subtitle='Inbound traffic and unique visitors per month'
      />
      <Box height='75vh'>
        <BarChart />
      </Box>
    </Box>
  );
}

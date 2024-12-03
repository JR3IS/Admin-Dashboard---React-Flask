import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import { tokens } from "../../theme";

export default function Geography() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m='20px'>
      <Header
        title='Sales by Country'
        subtitle='Balance of sales by country in the current year'
      />
      <Box
        height='75vh'
        border={`1px solid ${colors.grey[100]}`}
        borderRadius='4px'
      >
        <GeographyChart />
      </Box>
    </Box>
  );
}

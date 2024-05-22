import {Box} from "@mui/material";
import Header from "../../components/Header";
import PieCharts from "../../components/Pie/PieChart"

const Overview = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="BREAKDOWN"
        subtitle="Overview of general revenue and profit"
      />
      <Box height="75vh" mt="2rem">
        <PieCharts />
      </Box>
    </Box>
  );
};

export default Overview;

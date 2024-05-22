import {Box} from "@mui/material";
import Header from "../../components/Header";
import DailyChart from "../../components/Daily/Daily";


const Overview = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Daily"
        subtitle="Overview of general revenue and profit"
      />
      <Box height="75vh" mt="2rem">
        <DailyChart />
      </Box>
    </Box>
  );
};

export default Overview;

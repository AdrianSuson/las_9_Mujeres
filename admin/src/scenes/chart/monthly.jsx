import { Box } from "@mui/material";
import Header from "../../components/Header";
import MonthlyChart from "../../components/Monthly/Monthly";
const Monthly = () => {
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="MONTHLY" subtitle="Overview of general revenue and profit" />
			<Box height="75vh" mt="2rem">
				<MonthlyChart  />
			</Box>
		</Box>
	);
};

export default Monthly;

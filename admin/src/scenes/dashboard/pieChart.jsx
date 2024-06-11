import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Pie } from "@nivo/pie";
import axios from "axios";
import config from "../../state/config";
import PropTypes from 'prop-types';

const DailyChartComponent = ({
  salesData,
  expensesData,
  selectedYear,
  selectedMonth,
  isLoading,
}) => {
  const sortedSalesData = salesData.sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  const sortedExpensesData = expensesData.sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  let filteredSalesData;
  let filteredExpensesData;

  if (selectedMonth === "all") {
    filteredSalesData = sortedSalesData.filter(
      (entry) => new Date(entry.transaction_date).getFullYear() === selectedYear
    );

    filteredExpensesData = sortedExpensesData.filter(
      (entry) => new Date(entry.transaction_date).getFullYear() === selectedYear
    );
  } else {
    filteredSalesData = sortedSalesData.filter(
      (entry) =>
        new Date(entry.transaction_date).getFullYear() === selectedYear &&
        new Date(entry.transaction_date).getMonth() === selectedMonth - 1
    );

    filteredExpensesData = sortedExpensesData.filter(
      (entry) =>
        new Date(entry.transaction_date).getFullYear() === selectedYear &&
        new Date(entry.transaction_date).getMonth() === selectedMonth - 1
    );
  }

  const totalSales = filteredSalesData.reduce(
    (total, entry) => total + (entry.total_sales || 0),
    0
  );

  const totalExpenses = filteredExpensesData.reduce(
    (total, entry) => total + (entry.total_expenses || 0),
    0
  );

  const totalIncome = totalSales - totalExpenses;

  const chartData = [
    { id: "Sales", value: totalSales },
    { id: "Expenses", value: totalExpenses },
    { id: "Income", value: totalIncome },
  ];

  const isNoData = chartData.every((data) => data.value === 0);

  return (
    <Box
      height="400px"
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
        borderRadius: "16px",
        overflow: "hidden",
        p: 5,
        transition: "all 0.3s ease",
        background: "linear-gradient(135deg, #f5f7fa, #99c199)",
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : isNoData ? (
        <Typography variant="h6" color="textSecondary">
          No financial data available for {selectedMonth} - {selectedYear}.
        </Typography>
      ) : (
        <Pie
          width={400}
          height={400}
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3} 
          colors={["#2196f3", "#f44336", "#4caf50"]}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      )}
    </Box>
  );
};

const PieCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const salesResponse = await axios.get(
          `${config.API_URL}/sales?year=${currentYear}&month=${currentMonth}`
        );
        setSalesData(salesResponse.data);

        const expensesResponse = await axios.get(
          `${config.API_URL}/expenses?year=${currentYear}&month=${currentMonth}`
        );
        setExpensesData(expensesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentYear, currentMonth]);

  return (
    <Box>
      <DailyChartComponent
        salesData={salesData}
        expensesData={expensesData}
        selectedYear={currentYear}
        selectedMonth={currentMonth}
        isLoading={isLoading}
      />
    </Box>
  );
};

DailyChartComponent.propTypes = {
  salesData: PropTypes.array.isRequired, 
  expensesData: PropTypes.array.isRequired, 
  selectedYear: PropTypes.number.isRequired, 
  selectedMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, 
  isLoading: PropTypes.bool.isRequired,
};

PieCharts.propTypes = {
  currentYear: PropTypes.number, 
  currentMonth: PropTypes.number,
};

export default PieCharts;

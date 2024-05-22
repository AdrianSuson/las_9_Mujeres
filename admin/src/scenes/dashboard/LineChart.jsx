import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from 'prop-types';


const DailyChartComponent = ({
  combinedChartData,
  selectedYear,
  selectedMonth,
}) => {
  const theme = useTheme();
  const isNoData = !combinedChartData.some(
    (data) => data.sales > 0 || data.expenses > 0 || data.income > 0
  );
  // State to manage visibility of each line
  const [visibility, setVisibility] = useState({
    Sales: true,
    Expenses: true,
    Income: true,
  });

  // Function to toggle line visibility
  const toggleVisibility = (line) => {
    setVisibility((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  // Filter data based on visibility state
  const nivoChartData = [
    {
      id: "Sales",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.sales),
      })),
      color: "#2196f3",
    },
    {
      id: "Expenses",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.expenses),
      })),
      color: "#f44336",
    },
    {
      id: "Income",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.income),
      })),
      color: "#4caf50",
    },
  ].filter((series) => visibility[series.id]);

  return (
    <Box
      mt={4}
      height="300px"
      borderRadius={3}
      sx={{
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
        borderRadius: "16px",
        transition: "all 0.3s ease",
        background: "linear-gradient(135deg, #f5f7fa, #99c199)",
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
      }}
    >
      {!isNoData ? (
        <ResponsiveLine
          data={nivoChartData}
          margin={{ top: 50, right: 160, bottom: 90, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Day",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ datum: "color" }}
          enableArea
          pointSize={2}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          enableGridX={false}
          enableGridY={false}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          style={{ fontSize: "20px", color: theme.palette.secondary.main }}
        >
          No financial data available for {selectedMonth} - {selectedYear}.
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {["Sales", "Expenses", "Income"].map((line) => (
          <FormControlLabel
            key={line}
            control={
              <Checkbox
                checked={visibility[line]}
                onChange={() => toggleVisibility(line)}
                color="primary"
              />
            }
            label={line}
          />
        ))}
      </Box>
    </Box>
  );
};

const DailyChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth] = useState(new Date().getMonth() + 1);

  const [combinedChartData, setCombinedChartData] = useState([]);
  const [daySalesData, setDaySalesData] = useState(0);
  const [dayExpensesData, setDayExpensesData] = useState(0);
  const [dayIncomeData, setDayIncomeData] = useState(0);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5001/sales?year=${selectedYear}&month=${selectedMonth}`
      )
      .then((response) => {
        console.log("Sales Data:", response.data);
        setSalesData(response.data);
      })
      .catch((error) => console.error("Error fetching sales data:", error));

    axios
      .get(
        `http://localhost:5001/expenses?year=${selectedYear}&month=${selectedMonth}`
      )
      .then((response) => {
        console.log("Expenses Data:", response.data);
        setExpensesData(response.data);
      })
      .catch((error) => console.error("Error fetching expenses data:", error));
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const combinedData = [];
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      const daySales = salesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getDate() === i &&
            new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + (entry.total_sales || 0), 0);

      const dayExpenses = expensesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getDate() === i &&
            new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + (entry.total_expenses || 0), 0);

      const dayIncome = Math.max(0, daySales - dayExpenses);

      combinedData.push({
        x: i,
        sales: daySales,
        expenses: dayExpenses,
        income: dayIncome,
      });
    }

    setCombinedChartData(combinedData);

    const totalSales = salesData.reduce(
      (total, entry) =>
        new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
        new Date(entry.transaction_date).getFullYear() === selectedYear
          ? total + (entry.total_sales || 0)
          : total,
      0
    );
    const totalExpenses = expensesData.reduce(
      (total, entry) =>
        new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
        new Date(entry.transaction_date).getFullYear() === selectedYear
          ? total + (entry.total_expenses || 0)
          : total,
      0
    );
    const totalIncome = Math.max(0, totalSales - totalExpenses);

    setDaySalesData(totalSales);
    setDayExpensesData(totalExpenses);
    setDayIncomeData(totalIncome);
  }, [salesData, expensesData, selectedYear, selectedMonth]);

  return (
    <Box>
      <DailyChartComponent
        combinedChartData={combinedChartData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        daySalesData={daySalesData}
        dayExpensesData={dayExpensesData}
        dayIncomeData={dayIncomeData}
      />
    </Box>
  );
};

DailyChartComponent.propTypes = {
  combinedChartData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      sales: PropTypes.number.isRequired,
      expenses: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedYear: PropTypes.number.isRequired,
  selectedMonth: PropTypes.number.isRequired,
  daySalesData: PropTypes.number.isRequired,
  dayExpensesData: PropTypes.number.isRequired,
  dayIncomeData: PropTypes.number.isRequired,
  isNonMediumScreens: PropTypes.bool,
};


export default DailyChart;

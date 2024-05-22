import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import config from "../../state/config";
import MonthlyChartComponent from "./MonthlyChart";
import MonthlySummary from "./MonthlySummary";

const Monthly = () => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [combinedChartData, setCombinedChartData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.API_URL}/sales?year=${selectedYear}`)
      .then((response) => {
        console.log("Sales Data:", response.data);
        setSalesData(response.data);
      })
      .catch((error) => console.error("Error fetching sales data:", error));

    axios
      .get(`${config.API_URL}/expenses?year=${selectedYear}`)
      .then((response) => {
        console.log("Expenses Data:", response.data);
        setExpensesData(response.data);
      })
      .catch((error) => console.error("Error fetching expenses data:", error));
  }, [selectedYear]);

  useEffect(() => {
    const combinedData = [];

    for (let month = 1; month <= 12; month++) {
      const monthSales = salesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getMonth() === month - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + (entry.total_sales || 0), 0);

      const monthExpenses = expensesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getMonth() === month - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + (entry.total_expenses || 0), 0);

      const monthIncome = monthSales - monthExpenses;

      combinedData.push({
        month,
        sales: monthSales,
        expenses: monthExpenses,
        income: monthIncome,
      });
    }

    setCombinedChartData(combinedData);
  }, [salesData, expensesData, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box>
      <FormControl>
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          label="Select Year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <MenuItem key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        display="grid"
        gridTemplateColumns={isNonMediumScreens ? "repeat(12, 1fr)" : "1fr"}
        gap="10px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <Box
          gridColumn={isNonMediumScreens ? "span 12" : "span 12"}
          gridRow="span 3"
        >
          <MonthlyChartComponent
            combinedChartData={combinedChartData}
            selectedYear={selectedYear}
          />
        </Box>
        <Box
          gridColumn={isNonMediumScreens ? "span 12" : "span 12"}
          gridRow="span 3"
        >
          <MonthlySummary
            selectedYear={selectedYear}
            totalSales={combinedChartData.reduce((sum, m) => sum + m.sales, 0)}
            totalExpenses={combinedChartData.reduce(
              (sum, m) => sum + m.expenses,
              0
            )}
            totalIncome={combinedChartData.reduce(
              (sum, m) => sum + m.income,
              0
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Monthly;

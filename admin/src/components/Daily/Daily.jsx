// src/components/Daily.jsx
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
import DailyChartComponent from "./DailyChart";
import FinancialSummary from "./DailySummary";

const Daily = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [combinedChartData, setCombinedChartData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${config.API_URL}/sales?year=${selectedYear}&month=${selectedMonth}`
      )
      .then((response) => {
        console.log("Sales Data:", response.data);
        setSalesData(response.data);
      })
      .catch((error) => console.error("Error fetching sales data:", error));

    axios
      .get(
        `${config.API_URL}/expenses?year=${selectedYear}&month=${selectedMonth}`
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

      const dayIncome = daySales - dayExpenses;

      combinedData.push({
        x: i,
        sales: daySales,
        expenses: dayExpenses,
        income: dayIncome,
      });
    }

    setCombinedChartData(combinedData);
  }, [salesData, expensesData, selectedYear, selectedMonth]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <Box>
      <FormControl>
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          label="Select Year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <MenuItem key={`year-${i}`} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ marginLeft: "12px", width: "7.5rem" }}>
        <InputLabel id="month-select-label">Select Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          label="Select Month"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={`month-${i}`} value={i + 1}>
              {new Date(0, i + 1, 0).toLocaleString("default", {
                month: "long",
              })}
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
          <DailyChartComponent
            combinedChartData={combinedChartData}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        </Box>

        <Box
          gridColumn={isNonMediumScreens ? "span 12" : "span 12"}
          gridRow="span 3"
        >
          <FinancialSummary
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            daySalesData={combinedChartData.reduce(
              (acc, cur) => acc + cur.sales,
              0
            )}
            dayExpensesData={combinedChartData.reduce(
              (acc, cur) => acc + cur.expenses,
              0
            )}
            dayIncomeData={combinedChartData.reduce(
              (acc, cur) => acc + cur.income,
              0
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Daily;

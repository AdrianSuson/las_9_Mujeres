import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { Pie } from "@nivo/pie";
import axios from "axios";
import Icon from '@mdi/react';
import { mdiCash } from '@mdi/js';
import { mdiCashOff } from '@mdi/js';
import PositiveIncomeIcon from "@mui/icons-material/TrendingUp";
import NegativeIncomeIcon from "@mui/icons-material/TrendingDown";
import config from "../../state/config";
import PropTypes from 'prop-types';


const FinancialMetricBox = ({
  icon,
  label,
  value,
  currency,
  backgroundColor,
  color,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor,
        color,
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
        transition: theme.transitions.create("box-shadow"),
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          color: backgroundColor,
          marginRight: theme.spacing(2),
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h6" sx={{ marginLeft: "auto" }}>
        {value.toLocaleString(undefined, { style: "currency", currency })}
      </Typography>
    </Box>
  );
};

const DailyChartComponent = ({
  salesData,
  expensesData,
  selectedYear,
  selectedMonth,
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

  const isNoData = !chartData.some((data) => data.value > 0);

  return (
    <Box
      mt={3}
      height="300px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={3}
      style={{ background: "linear-gradient(135deg, #f5f7fa, #66a266)" }}
      mx="auto"
    >
      {!isNoData ? (
        <Box>
          <Pie
            width={400}
            height={400}
            data={chartData}
            margin={{ top: 80, right: 80, bottom: 80, left: 90 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={["#2196f3", "#f44336", "#4caf50"]}
            enableArea
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
        </Box>
      ) : (
        <Typography
          variant="subtitle1"
          align="center"
          color="primary"
          style={{ fontSize: "20px",}}
        >
          No financial data available for {selectedMonth} - {selectedYear}.
        </Typography>
      )}
    </Box>
  );
};

const DailySummary = ({
  combinedChartData,
  daySalesData,
  dayExpensesData,
  dayIncomeData,
}) => {
  const theme = useTheme();
  const isNoData = combinedChartData.length === 0;

  return (
    <Box>
      {!isNoData && (
        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12} sm={4}>
            <FinancialMetricBox
              icon={<Icon path={mdiCash} size={1} />}
              label="Sales"
              value={daySalesData}
              currency="PHP"
              backgroundColor={theme.palette.info.light}
              color={theme.palette.success.contrastText}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FinancialMetricBox
              icon={<Icon path={mdiCashOff} size={1} />}
              label="Expenses"
              value={dayExpensesData}
              currency="PHP"
              backgroundColor={theme.palette.error.light}
              color={theme.palette.error.contrastText}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FinancialMetricBox
              icon={
                dayIncomeData < 0 ? (
                  <NegativeIncomeIcon />
                ) : (
                  <PositiveIncomeIcon />
                )
              }
              label={dayIncomeData < 0 ? "Net Loss" : "Net Income"}
              value={Math.abs(dayIncomeData)}
              currency="PHP"
              backgroundColor={
                dayIncomeData < 0
                  ? theme.palette.error.light
                  : theme.palette.success.light
              }
              color={
                dayIncomeData < 0
                  ? theme.palette.error.contrastText
                  : theme.palette.info.contrastText
              }
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const PieCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [combinedChartData, setCombinedChartData] = useState([]);
  const [daySalesData, setDaySalesData] = useState(0);
  const [dayExpensesData, setDayExpensesData] = useState(0);
  const [dayIncomeData, setDayIncomeData] = useState(0);

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
    let totalSales = 0;
    let totalExpenses = 0;
    let totalIncome = 0;

    for (let i = 1; i <= lastDay; i++) {
      const daySales = salesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getDate() === i &&
            new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + Number(entry.total_sales || 0), 0);

      const dayExpenses = expensesData
        .filter(
          (entry) =>
            new Date(entry.transaction_date).getDate() === i &&
            new Date(entry.transaction_date).getMonth() === selectedMonth - 1 &&
            new Date(entry.transaction_date).getFullYear() === selectedYear
        )
        .reduce((total, entry) => total + Number(entry.total_expenses || 0), 0);

      const dayIncome = daySales - dayExpenses;

      combinedData.push({
        x: i.toString(),
        sales: daySales,
        expenses: dayExpenses,
        income: dayIncome,
      });

      totalSales += daySales;
      totalExpenses += dayExpenses;
      totalIncome += dayIncome;
    }

    setCombinedChartData(combinedData);
    setDaySalesData(totalSales);
    setDayExpensesData(totalExpenses);
    setDayIncomeData(totalIncome);
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
        <InputLabel id="year-select-label" style={{ fontSize: "16px" }}>
          Select Year
        </InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          label="Select Year"
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: "100px", fontSize: "14px" }}
        >
          <MenuItem value={new Date().getFullYear() - 2}>
            {new Date().getFullYear() - 2}
          </MenuItem>
          <MenuItem value={new Date().getFullYear() - 1}>
            {new Date().getFullYear() - 1}
          </MenuItem>
          <MenuItem value={new Date().getFullYear()}>
            {new Date().getFullYear()}
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl style={{ marginLeft: "12px" }}>
        <InputLabel id="month-select-label" style={{ fontSize: "16px" }}>
          Select Month
        </InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          label="Select Month"
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{ fontSize: "14px" }}
        >
          <MenuItem value={1}>January</MenuItem>
          <MenuItem value={2}>February</MenuItem>
          <MenuItem value={3}>March</MenuItem>
          <MenuItem value={4}>April</MenuItem>
          <MenuItem value={5}>May</MenuItem>
          <MenuItem value={6}>June</MenuItem>
          <MenuItem value={7}>July</MenuItem>
          <MenuItem value={8}>August</MenuItem>
          <MenuItem value={9}>September</MenuItem>
          <MenuItem value={10}>October</MenuItem>
          <MenuItem value={11}>November</MenuItem>
          <MenuItem value={12}>December</MenuItem>
        </Select>
      </FormControl>

      <DailyChartComponent
        salesData={salesData}
        expensesData={expensesData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      <DailySummary
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

FinancialMetricBox.propTypes = {
  icon: PropTypes.node.isRequired, 
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired, 
  currency: PropTypes.string.isRequired, 
  backgroundColor: PropTypes.string.isRequired, 
  color: PropTypes.string.isRequired,
};

DailySummary.propTypes = {
  combinedChartData: PropTypes.array.isRequired, 
  selectedYear: PropTypes.number.isRequired, 
  selectedMonth: PropTypes.number.isRequired, 
  daySalesData: PropTypes.number.isRequired, 
  dayExpensesData: PropTypes.number.isRequired, 
  dayIncomeData: PropTypes.number.isRequired, 
};

DailyChartComponent.propTypes = {
  salesData: PropTypes.array.isRequired, 
  expensesData: PropTypes.array.isRequired, 
  selectedYear: PropTypes.number.isRequired, 
  selectedMonth: PropTypes.number.isRequired,
};

export default PieCharts;

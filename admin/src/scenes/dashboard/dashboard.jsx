import { useEffect, useState } from "react";
import axios from "axios";
import { Box, useTheme, useMediaQuery, CircularProgress, Typography } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import LineChart from "./LineChart";
import EmployeeData from "./employeeChart";
import PieChartComponent from "./pieChart";
import FinancialSummary from "./FinancialSummary";
import config from "../../state/config";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/employees`);
        setEmployeeData(response.data);
        setIsLoadingEmployees(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setFetchError("Failed to fetch employee data.");
        setIsLoadingEmployees(false);
      }
    };

    const fetchFinancialData = async () => {
      try {
        const salesResponse = await axios.get(
          `${config.API_URL}/sales?year=${selectedYear}&month=${selectedMonth}`
        );
        setSalesData(salesResponse.data);

        const expensesResponse = await axios.get(
          `${config.API_URL}/expenses?year=${selectedYear}&month=${selectedMonth}`
        );
        setExpensesData(expensesResponse.data);
        setIsLoadingFinancial(false);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setFetchError("Failed to fetch financial data.");
        setIsLoadingFinancial(false);
      }
    };

    fetchEmployeeData();
    fetchFinancialData();
  }, [selectedYear, selectedMonth]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
  ];

  const sortedSalesData = salesData.sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  const sortedExpensesData = expensesData.sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  const filteredSalesData = sortedSalesData.filter(
    (entry) =>
      new Date(entry.transaction_date).getFullYear() === selectedYear &&
      new Date(entry.transaction_date).getMonth() === selectedMonth - 1
  );

  const filteredExpensesData = sortedExpensesData.filter(
    (entry) =>
      new Date(entry.transaction_date).getFullYear() === selectedYear &&
      new Date(entry.transaction_date).getMonth() === selectedMonth - 1
  );

  const combinedChartData = [];
  const lastDaySales = new Date(selectedYear, selectedMonth, 0).getDate();

  for (let i = 1; i <= lastDaySales; i++) {
    const daySalesData = filteredSalesData
      .filter((entry) => new Date(entry.transaction_date).getDate() === i)
      .reduce((total, entry) => total + (entry.total_sales || 0), 0);

    const dayExpensesData = filteredExpensesData
      .filter((entry) => new Date(entry.transaction_date).getDate() === i)
      .reduce((total, entry) => total + (entry.total_expenses || 0), 0);

    const dayIncomeData = Math.max(0, daySalesData - dayExpensesData);

    combinedChartData.push({
      x: i,
      sales: daySalesData,
      expenses: dayExpensesData,
      income: dayIncomeData,
    });
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

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </FlexBetween>
      {fetchError && <Typography variant="body1" color="error">{fetchError}</Typography>}
      <Box
        display="grid"
        gridTemplateColumns={isNonMediumScreens ? "repeat(12, 1fr)" : "1fr"}
        gap="10px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {isLoadingFinancial ? (
          <Box gridColumn="span 12" display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box gridColumn={isNonMediumScreens ? "span 12" : "span 12"} gridRow="span 3">
              <LineChart data={combinedChartData} theme={theme} />
            </Box>
            <Box mt="3rem" gridColumn={isNonMediumScreens ? "span 12" : "span 12"} gridRow="span 3">
              <FinancialSummary
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                totalSales={(totalSales)}
                totalExpenses={(totalExpenses)}
                totalIncome={(totalIncome)}
                isNonMediumScreens={isNonMediumScreens}
              />
            </Box>
            <Box gridColumn={isNonMediumScreens ? "span 6" : "span 12"} gridRow="span 3">
              <PieChartComponent
                pieChartData={[
                  { name: "Sales", value: (totalSales) },
                  { name: "Expenses", value: (totalExpenses) },
                  { name: "Income", value: (totalIncome) },
                ]}
              />
            </Box>
          </>
        )}
        {isLoadingEmployees ? (
          <Box gridColumn="span 12" display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box gridColumn={isNonMediumScreens ? "span 6" : "span 12"} gridRow="span 6">
            <EmployeeData
              isLoadingEmployees={isLoadingEmployees}
              employeeData={employeeData}
              columns={columns}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

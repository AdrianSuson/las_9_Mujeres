import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
import PrintIcon from "@mui/icons-material/Print";
import config from "../../state/config";

const Transactions = () => {
  const theme = useTheme();
  const [incomeData, setIncomeData] = useState([]);
  const [isIncomeLoading, setIsIncomeLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsIncomeLoading(true);
  
      // Fetch sales data
      const salesResponse = await axios.get(`${config.API_URL}/sales`);
      const salesData = salesResponse.data;
      console.log("Sales Data:", salesData);
  
      // Fetch expenses data
      const expensesResponse = await axios.get(`${config.API_URL}/expenses`);
      const expensesData = expensesResponse.data;
      console.log("Expenses Data:", expensesData);
  
      if (salesData && expensesData) {
        const combinedData = salesData.map((sale) => {
          const expense = expensesData.find(
            (exp) => exp.transaction_date === sale.transaction_date
          );
          const totalExpenses = expense ? expense.total_expenses : 0;
          return {
            ...sale,
            total_expenses: totalExpenses,
            income: sale.total_sales - totalExpenses,
            expenses: totalExpenses,
          };
        });
  
        setIncomeData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setIsIncomeLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchDataAndScheduleNext = async () => {
      await fetchData();
    };
    fetchDataAndScheduleNext();
  }, []);

  const formatDate = (dateString) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const incomeColumns = [
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "total_sales", headerName: "Total Sales", flex: 1 },
    { field: "total_expenses", headerName: "Total Expenses", flex: 1 },
    { field: "income", headerName: "Income", flex: 1 },
  ];
  
  

  const handlePrint = () => {
    let totalIncome = 0;

    const printableContent = incomeData.map((row) => {
      totalIncome += row.income;
      return `
        <tr>
          <td>${row.id}</td>
          <td>${formatDate(row.transaction_date)}</td>
          <td>${row.total_sales}</td>
          <td>${row.total_expenses}</td>
          <td>${row.income}</td>
        </tr>
      `;
    });

    const printableText = `
      <html>
        <head>
          <title>Total Income</title>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Total Income</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Transaction Date</th>
                <th>Total Sales</th>
                <th>Total Expenses</th>
                <th>Income</th>
              </tr>
            </thead>
            <tbody>
              ${printableContent.join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right;"> <strong> Total: </strong></td>
                <td>${totalIncome}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printableText);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="INCOME" subtitle="Entire list of income transactions" />
      <Box
              mt={2}

        height="75vh"
        width="95%"
        sx={{
          background: "linear-gradient(135deg, #f5f7fa, #99c199)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "5rem",
          },
          "& .MuiDataGrid-cell": {
            backgroundColor: theme.palette.primary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.primary[400],
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary[300],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.primary[400],
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: theme.palette.primary[600],
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon":
            {
              color: theme.palette.secondary[100],
            },
        }}
      >
        <Box display="flex" justifyContent="flex-end" height="auto">
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              mt: "1rem",
              mr: ".5rem",
              color: theme.palette.primary[500],
              background: theme.palette.secondary[500],
              transition: "transform 0.2s",
              "&:hover": {
                color: theme.palette.secondary[600],
                background: theme.palette.primary[600],
                transform: "scale(1.1)",
              },
            }}
          >
            Print
          </Button>
        </Box>

        <DataGrid
          loading={isIncomeLoading}
          rows={incomeData || []}
          columns={incomeColumns}
          autoHeight
          components={{
            Toolbar: DataGridCustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;

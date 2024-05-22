import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
import ExpensesForm from "../../scenes/transactions/expensesForm";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PrintIcon from "@mui/icons-material/Print";
import config from "../../state/config";

const Expenses = () => {
  const [isExpensesVisible, setExpensesVisible] = useState(false);
  const theme = useTheme();
  const [expensesData, setExpensesData] = useState([]);
  const [isExpensesLoading, setIsExpensesLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsExpensesLoading(true);
      const expensesResponse = await axios.get(
        `${config.API_URL}/expenses`
      );
      setExpensesData(expensesResponse.data);
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    } finally {
      setIsExpensesLoading(false);
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

  const expensesColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "expense_name", headerName: "Item Name", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "total_expenses", headerName: "Total Expense", flex: 1 },
  ];

  const handleCloseForm = () => {
    setExpensesVisible(false);
  };

  const handlePrint = () => {
    let totalExpenses = 0;

    const printableContent = expensesData.map((row) => {
      totalExpenses += row.total_expenses;
      return `
            <tr>
                <td>${row.id}</td>
                <td>${row.transaction_name}</td>
                <td>${row.expense_name}</td>
                <td>${row.amount}</td>
                <td>${row.price}</td>
                <td>${formatDate(row.transaction_date)}</td>
                <td>${row.total_expenses}</td>
            </tr>
            `;
    });

    const printableText = `
            <html>
                <head>
                    <title>Total Expenses</title>
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
                    <h1>Total Expenses</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Transaction Type</th>
                                <th>Item Name</th>
                                <th>Amount</th>
                                <th>Price</th>
                                <th>Transaction Date</th>
                                <th>Total Expenses</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${printableContent.join("")}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                                <td>${totalExpenses}</td>
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
      <Header title="EXPENSES" subtitle="Entire list of expenses" />

      <Box mb="1.5rem" mt="1rem">
        <Button
          variant="contained"
          startIcon={<MoneyOffIcon />}
          sx={{
            color: theme.palette.primary[500],
            background: theme.palette.secondary[500],
            transition: "transform 0.2s",
            "&:hover": {
              color: theme.palette.secondary[600],
              background: theme.palette.primary[600],
              transform: "scale(1.1)",
            },
          }}
          onClick={() => setExpensesVisible(true)}
        >
          Expenses
        </Button>
      </Box>

      {isExpensesVisible && <ExpensesForm onClose={handleCloseForm} />}

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
          loading={isExpensesLoading}
          rows={expensesData || []}
          columns={expensesColumns}
          autoHeight
          components={{
            Toolbar: DataGridCustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Expenses;

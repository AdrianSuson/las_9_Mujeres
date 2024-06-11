import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
import SalesForm from "../../scenes/transactions/salesForm";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PrintIcon from "@mui/icons-material/Print";
import config from "../../state/config";

const Sales = () => {
  const [isSalesVisible, setSalesVisible] = useState(false);
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const reversedSalesData = [...salesData].reverse();
  const [isSalesLoading, setIsSalesLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsSalesLoading(true);
      const salesResponse = await axios.get(`${config.API_URL}/sales`);
      setSalesData(salesResponse.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsSalesLoading(false);
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

  const salesColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "sales_name", headerName: "Item name", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "total_sales", headerName: "Total Sales", flex: 1 },
  ];

  const handleCloseForm = () => {
    setSalesVisible(false);
  };

  const handlePrint = () => {
    let totalSales = 0;

    const printableContent = salesData.map((row) => {
      totalSales += row.total_sales;
      return `
      <tr>
        <td>${row.id}</td>
        <td>${row.transaction_name}</td>
        <td>${row.sales_name}</td>
        <td>${row.amount}</td>
        <td>${row.price}</td>
        <td>${formatDate(row.transaction_date)}</td>
        <td>${row.total_sales}</td>
      </tr>
    `;
    });

    const printableText = `
    <html>
      <head>
        <title>Total Sales</title>
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
        <h1>Total Sales</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction Type</th>
              <th>Item name</th>
              <th>Amount</th>
              <th>Price</th>
              <th>Transaction Date</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            ${printableContent.join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="text-align: right;"> <strong> Total: </strong></td>
              <td>${totalSales}</td>
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
      <Header title="SALES" subtitle="Entire list of sales" />

      {/*<Box mb="1.5rem" mt="1rem">
        <Button
          variant="contained"
          startIcon={<MonetizationOnIcon />}
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
          onClick={() => setSalesVisible(true)}
        >
          Sales
        </Button>
      </Box> */}

      {isSalesVisible && <SalesForm onClose={handleCloseForm} />}

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
          loading={isSalesLoading}
          rows={reversedSalesData || []}
          columns={salesColumns}
          components={{
            Toolbar: DataGridCustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Sales;

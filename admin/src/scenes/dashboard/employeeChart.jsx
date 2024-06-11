import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const EmployeeData = ({ isLoadingEmployees, employeeData, columns }) => {
  const theme = useTheme();

  return (
    <Box
      gridColumn="span 6"
      gridRow="span 6"
      sx={{
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        background: "linear-gradient(135deg, #f5f7fa, #99c199)",
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
        height: "400px",
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
          backgroundColor: theme.palette.primary[100],
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: theme.palette.primary[400],
          color: theme.palette.secondary[100],
          borderTop: "none",
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: theme.palette.primary[600],
        },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon": {
          color: theme.palette.secondary[100],
        },
      }}
    >
      {isLoadingEmployees ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : employeeData.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h6" color="textSecondary">
            No employees to display
          </Typography>
        </Box>
      ) : (
        <DataGrid
          getRowId={(row) => row.id}
          rows={employeeData}
          columns={columns}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              color: theme.palette.text.primary,
            },
          }}
        />
      )}
    </Box>
  );
};

EmployeeData.propTypes = {
  isLoadingEmployees: PropTypes.bool.isRequired,
  employeeData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EmployeeData;

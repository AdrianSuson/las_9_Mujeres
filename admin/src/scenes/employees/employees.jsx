import { useState, useEffect } from "react";
import { Box, useTheme, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import CustomColumnMenu from "../../components/DataGridCustomColumnMenu";
import EmployeeAdd from "./employeeAdd";
import EmployeeUpdate from "./employeeUpdate";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import config from "../../state/config";

const Employees = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState({});
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
    setSelectedEmployeeId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleEmployeeUpdate = (id) => {
    const employeeData = employees.find((emp) => emp.id === id);
    setSelectedEmployeeId(id);
    setSelectedEmployeeData(employeeData);
    setUpdateFormOpen(true);
  };

  const filteredData = employees.filter(
    (employee) =>
      employee.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase()) ||
      employee.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleEmployeeUpdate(params.row.id)}
          variant="contained"
          color="primary"
          sx={{
            transition: "transform 0.2s",
            "&:hover": {
              background: theme.palette.info.dark,
              transform: "scale(1.1)",
            },
          }}
        >
          {isSmallScreen ? <UpdateIcon /> : "Update"}
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)}
          variant="contained"
          color="secondary"
          sx={{
            transition: "transform 0.2s",
            "&:hover": {
              background: theme.palette.error.dark,
              transform: "scale(1.1)",
            },
          }}
        >
          {isSmallScreen ? <DeleteIcon /> : "Delete"}
        </Button>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="EMPLOYEES"
        subtitle="Managing employees and list of employees"
      />
      <Button
        variant="contained"
        sx={{
          mt: "1rem",
          mr: ".5rem",
          color: theme.palette.getContrastText(theme.palette.primary.main),
          background: theme.palette.primary.main,
          transition: "transform 0.2s",
          "&:hover": {
            background: theme.palette.primary.dark,
            transform: "scale(1.1)",
          },
        }}
        startIcon={<PersonAddIcon />}
        onClick={handleOpenDialog}
      >
        Add Employee
      </Button>
      {isDialogOpen && <EmployeeAdd onClose={handleCloseDialog} />}
      {updateFormOpen && (
        <EmployeeUpdate
          open={updateFormOpen}
          onClose={handleUpdateFormClose}
          employeeId={selectedEmployeeId}
          initialData={selectedEmployeeData}
          fetchEmployees={fetchEmployees}
        />
      )}

      <Box
        mt={2}
        height="75vh"
        width="100%"
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearchChange}
            sx={{
              width: isSmallScreen ? "100%" : "300px",
              mr: isSmallScreen ? 0 : 2,
              ml: isSmallScreen ? 0 : "auto",
            }}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />
        </Box>

        <DataGrid
          rows={filteredData}
          columns={columns}
          autoHeight
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default Employees;

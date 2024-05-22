import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PropTypes from 'prop-types';
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Formik } from "formik";
import Header from "../../components/Header";
import config from "../../state/config";

const Expenses = ({ onClose }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [value1, setValue1] = useState(); // Initialize values with 0
  const [value2, setValue2] = useState();
  const [total, setTotal] = useState(0);
  const theme = useTheme();

  const handleValueChange = (event, setFieldValue, fieldName, otherValue) => {
    const newValue = parseFloat(event.target.value) || 0;
    setFieldValue(fieldName, newValue);

    if (fieldName === "amount") {
      setValue1(newValue);
    } else if (fieldName === "price") {
      setValue2(newValue);
    }

    const newTotal = newValue * otherValue;
    setTotal(newTotal);
    setFieldValue("total_expenses", newTotal);
  };

  const handleFormSubmit = async (values) => {
    try {
      // Make a POST request to your backend endpoint
      await fetch(`${config.API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      onClose();
      window.location.reload(false);
    } catch (error) {
      console.error("Error creating Expenses:", error);
    }
  };

  const initialValues = {
    transaction_name: "Expenses",
    expense_name: "",
    amount: value1,
    price: value2,
    transaction_date: "",
    total_expenses: total,
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        <Header title="EXPENSES" subtitle="Insert Expenses" />
      </DialogTitle>
      <DialogContent>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({
            values,
            setFieldValue,
            handleBlur,
            handleChange,
            handleSubmit,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                mt="1rem"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  variant="outlined"
                  type="text"
                  label="Item Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.expense_type}
                  name="expense_name"
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: <AddShoppingCartOutlinedIcon />,
                  }}
                  required
                  error={touched.expense_type && !!errors.expense_type}
                  helperText={touched.expense_type && errors.expense_type}
                />
                <TextField
                  variant="outlined"
                  type="number"
                  label="Amount"
                  onBlur={handleBlur}
                  value={values.amount}
                  onChange={(e) =>
                    handleValueChange(e, setFieldValue, "amount", value2)
                  }
                  name="amount"
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: <CalculateOutlinedIcon />,
                  }}
                  required
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
                <TextField
                  variant="outlined"
                  type="number"
                  label="Price"
                  onBlur={handleBlur}
                  value={values.price}
                  onChange={(e) =>
                    handleValueChange(e, setFieldValue, "price", value1)
                  }
                  name="price"
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: "₱",
                  }}
                  required
                  error={touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                />
                <TextField
                  variant="outlined"
                  type="date"
                  label="Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.transaction_date}
                  name="transaction_date"
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: <CalendarMonthOutlinedIcon />,
                  }}
                  required
                  error={touched.transaction_date && !!errors.transaction_date}
                  helperText={
                    touched.transaction_date && errors.transaction_date
                  }
                  inputProps={{
                    min: new Date().toISOString().split("T")[0], // Set min date to today
                  }}
                />
              </Box>
              <Typography
                sx={{ gridColumn: "span 2", m: "1.5rem" }}
                variant="h3"
              >
                Total: {total}
              </Typography>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    m: "1rem",
                    color: theme.palette.primary[400],
                    background: theme.palette.secondary[400],
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Typography mr="0.3rem">Save</Typography>
                  <PublishOutlinedIcon />
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
Expenses.propTypes = {
  onClose: PropTypes.func.isRequired
};
export default Expenses;

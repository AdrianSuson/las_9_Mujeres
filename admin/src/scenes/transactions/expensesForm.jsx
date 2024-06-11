import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
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
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [total, setTotal] = useState(0);

  const handleValueChange = (event, setFieldValue, fieldName,) => {
    const newValue = parseFloat(event.target.value) || 0;
    setFieldValue(fieldName, newValue);

    if (fieldName === "amount") {
      setValue1(newValue);
    } else if (fieldName === "price") {
      setValue2(newValue);
    }

    const newTotal = fieldName === "amount" ? newValue * value2 : newValue * value1;
    setTotal(newTotal);
    setFieldValue("total_expenses", newTotal);
  };

  const handleFormSubmit = async (values) => {
    try {
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
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
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
                gap="20px"
                mt="1rem"
                gridTemplateColumns="repeat(4, 1fr)"
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
                  value={values.expense_name}
                  name="expense_name"
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AddShoppingCartOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={touched.expense_name && !!errors.expense_name}
                  helperText={touched.expense_name && errors.expense_name}
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalculateOutlinedIcon />
                      </InputAdornment>
                    ),
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
                    startAdornment: (
                      <InputAdornment position="start">
                        ₱
                      </InputAdornment>
                    ),
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={touched.transaction_date && !!errors.transaction_date}
                  helperText={
                    touched.transaction_date && errors.transaction_date
                  }
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                />
              </Box>
              <Typography
                sx={{ gridColumn: "span 4", m: "1.5rem 0", textAlign: 'center' }}
                variant="h5"
              >
                Total: ₱{total}
              </Typography>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    m: "1rem",
                    "&:hover": {
                      transform: "scale(1.05)",
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
  onClose: PropTypes.func.isRequired,
};

export default Expenses;

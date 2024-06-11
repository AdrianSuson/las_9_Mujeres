import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import { useTheme } from "@emotion/react";
import PropTypes from 'prop-types';
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const EmployeeAdd = ({ onClose }) => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    try {
      // Make a POST request to your backend endpoint
      await fetch("http://localhost:5001/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      window.location.reload(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    position: "",
    phoneNumber: "",
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography color="primary" fontWeight="bold" fontSize="12px">
          Add Storage Item
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({ values, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                mt="1rem"
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(10, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  color: theme.palette.secondary[200],
                }}
              >
                <TextField
                  variant="outlined"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  sx={{
                    gridColumn: "span 3",
                    background: theme.palette.background.alt,
                  }}
                />

                <TextField
                  variant="outlined"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  value={values.lastName}
                  onChange={handleChange}
                  name="lastName"
                  sx={{
                    gridColumn: "span 3",
                    background: theme.palette.background.alt,
                  }}
                />

                <TextField
                  variant="outlined"
                  type="text"
                  label="Position"
                  onBlur={handleBlur}
                  value={values.position}
                  onChange={handleChange}
                  name="position"
                  sx={{
                    gridColumn: "span 3",
                    background: theme.palette.background.alt,
                  }}
                />
                <TextField
                  variant="outlined"
                  type="tel"
                  label="Phone Number"
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  sx={{
                    gridColumn: "span 3",
                    background: theme.palette.background.alt,
                  }}
                />
              </Box>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  <Typography mr="0.3rem">Save</Typography>
                  <PersonAddIcon />
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
EmployeeAdd.propTypes = {
  onClose: PropTypes.func.isRequired, 
};
export default EmployeeAdd;

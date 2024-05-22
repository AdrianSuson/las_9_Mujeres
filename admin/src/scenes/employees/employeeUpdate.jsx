import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { PublishOutlined as PublishOutlinedIcon } from "@mui/icons-material";
import PropTypes from 'prop-types';
import config from "../../state/config";


const EmployeeUpdateDialog = ({ open, onClose, employeeId, initialData, fetchEmployees }) => {

  const handleUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`${config.API_URL}/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee.');
      }
      alert('Employee updated successfully!');
      resetForm();
      onClose(); // Optionally refresh the employee list if applicable
      if (fetchEmployees) {
        fetchEmployees();
      }
    } catch (error) {
      console.error(`Error updating employee with ID ${employeeId}:`, error);
      alert('Failed to update employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    position: initialData?.position || "",
    phoneNumber: initialData?.phoneNumber || "",
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Employee</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleUpdate}
          enableReinitialize  // Ensure form reinitializes with new initialData
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Box
                mt="1rem"
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap="20px"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Position"
                  name="position"
                  type="text"
                  value={values.position}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={values.phoneNumber}
                  onChange={handleChange}
                />
              </Box>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<PublishOutlinedIcon />}
                >
                  Update
                </Button>
                <Button
                  onClick={onClose}
                  color="secondary"
                >
                  Close
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
EmployeeUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
  initialData: PropTypes.object.isRequired,
  fetchEmployees: PropTypes.func,
};
export default EmployeeUpdateDialog;

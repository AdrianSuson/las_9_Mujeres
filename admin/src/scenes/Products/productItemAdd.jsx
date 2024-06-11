import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import config from "../../state/config";
import PropTypes from 'prop-types';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  amount: Yup.number().min(1, "Must be at least 1").required("Required"),
  price: Yup.number().min(0.01, "Must be at least 0.01").required("Required"),
});

const FormContent = ({ setFieldValue, values, handleChange, errors, touched }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFieldValue("image", acceptedFiles[0]);
    },
  });

  return (
    <Box mt="1rem" display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
      <TextField
        fullWidth
        variant="outlined"
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Amount"
        name="amount"
        type="number"
        value={values.amount}
        onChange={handleChange}
        error={touched.amount && Boolean(errors.amount)}
        helperText={touched.amount && errors.amount}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Price"
        name="price"
        type="number"
        value={values.price}
        onChange={handleChange}
        error={touched.price && Boolean(errors.price)}
        helperText={touched.price && errors.price}
      />
      <div {...getRootProps({ className: "dropzone" })} style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
        <input {...getInputProps()} />
        <TextField
          fullWidth
          variant="outlined"
          label="Image File"
          value={values.image ? values.image.name : "No file selected"}
          InputProps={{
            readOnly: true,
          }}
          helperText="Drag 'n' drop some image here, or click to select files"
        />
      </div>
    </Box>
  );
};

const ItemAdd = ({ onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            name: "",
            amount: "",
            price: "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("amount", values.amount);
            formData.append("price", values.price);
            if (values.image) {
              formData.append("image", values.image);
            }

            setSubmitting(true);
            axios.post(`${config.API_URL}/items`, formData)
              .then(() => {
                onClose();
                window.location.reload(false);
              })
              .catch(error => {
                console.error("Error creating item:", error);
                setErrors({ submit: "Error creating item. Please try again." });
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <FormContent
                setFieldValue={setFieldValue}
                values={values}
                handleChange={handleChange}
                errors={errors}
                touched={touched}
              />
              {errors.submit && <Alert severity="error">{errors.submit}</Alert>}
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : <AddCircleOutlineIcon sx={{ mr: 1 }} />}
                  Add Item
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

FormContent.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
};

ItemAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ItemAdd;

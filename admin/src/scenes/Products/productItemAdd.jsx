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
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import config from "../../state/config";
import PropTypes from 'prop-types';


// Create a separate component for the form to utilize useDropzone
const FormContent = ({ setFieldValue, values, handleChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      // Assuming you only need the first file
      const file = acceptedFiles[0];
      setFieldValue("image", file);
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
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Amount"
        name="amount"
        type="number"
        value={values.amount}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Price"
        name="price"
        type="number"
        value={values.price}
        onChange={handleChange}
      />
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("amount", values.amount);
            formData.append("price", values.price);
            if (values.image) {
              formData.append("image", values.image);
            }

            try {
              await fetch(`${config.API_URL}/items`, {
                method: "POST",
                body: formData,
              });
              window.location.reload(false);
              onClose();
            } catch (error) {
              console.error("Error creating item:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <FormContent
                setFieldValue={setFieldValue}
                values={values}
                handleChange={handleChange}
              />
              <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  <AddCircleOutlineIcon sx={{ mr: 1 }} />
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
};
ItemAdd.propTypes = {
  onClose: PropTypes.func.isRequired, 
};
export default ItemAdd;

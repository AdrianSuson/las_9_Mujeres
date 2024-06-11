import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import { useTheme } from "@emotion/react";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from 'prop-types';
import config from "../../state/config";

const ItemUpdate = ({ open, onClose, itemData }) => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Item</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            amount: itemData?.amount || "",
            price: itemData?.price || "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            // Validate that amount and price are not empty and are numbers
            const amount = Number(values.amount);
            const price = Number(values.price);
            if (isNaN(amount) || isNaN(price)) {
              console.error("Invalid input: Amount or price is not a number.");
              return;
            }

            const body = JSON.stringify({
              amount: amount,
              price: price
            });

            if (itemData?.id) {
              try {
                const response = await fetch(`${config.API_URL}/items/${itemData.id}`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: body
                });
                if (!response.ok) {
                  throw new Error('Failed to update item.');
                }
                onClose();
                window.location.reload(false);
              } catch (error) {
                console.error("Error updating item:", error);
              } finally {
                setSubmitting(false);
              }
            } else {
              console.error(
                "Error updating item: itemData or itemData.id is undefined"
              );
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                mt="1rem"
                display="grid"
                gap={2}
                gridTemplateColumns={isNonMobile ? "repeat(2, 1fr)" : "repeat(1, 1fr)"}
              >
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
              </Box>
              <DialogActions>
                <Button onClick={onClose} variant="contained" color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  Update Item
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
ItemUpdate.propTypes = {
  open: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
  itemData: PropTypes.object.isRequired,
};
export default ItemUpdate;

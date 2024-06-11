import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ItemUpdate from "./productItemUpdate"; 
import PropTypes from 'prop-types';
import config from "../../state/config";


const Item = ({ item, fetchItems }) => {
  const imageUrl = `${config.API_URL}/assets/${item.image}`;
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this item?');
    if (!confirm) return;
    setLoading(true);
    try {
      await axios.delete(`${config.API_URL}/items/${item.id}`);
      fetchItems();
      setSnackbar({ open: true, message: 'Item deleted successfully', severity: 'success' });
    } catch (error) {
      console.error("Failed to delete item:", error);
      setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateDialog = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    if (typeof fetchItems === "function") {
      fetchItems();
    } else {
      console.error("fetchItems is not a function");
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Card sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <CardMedia component="img" height="140" image={imageUrl} alt={item.name} />
          <CardContent> 
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: ₱{item.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount: {item.amount}
            </Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" onClick={handleOpenUpdateDialog}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Delete'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {isUpdateDialogOpen && (
        <ItemUpdate
          open={isUpdateDialogOpen}
          onClose={handleCloseUpdateDialog}
          itemData={item}
        />
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired, 
  fetchItems: PropTypes.func.isRequired,
};

export default Item;

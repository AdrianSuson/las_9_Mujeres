import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ItemUpdate from "./productItemUpdate"; 
import PropTypes from 'prop-types';

const backendBaseUrl = "http://localhost:5001";

const Item = ({ item, fetchItems }) => {
  const imageUrl = `${backendBaseUrl}/assets/${item.image}`;
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendBaseUrl}/items/${item.id}`);
      fetchItems(); // Refresh the items list after deletion
      window.location.reload(false);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleOpenUpdateDialog = () => {
    setIsUpdateDialogOpen(true);
  };


  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    if (typeof fetchItems === "function") {
      fetchItems();  // Call to fetch items after update
    } else {
      console.error("fetchItems is not a function");
    }
  };
  return (
    <>
      <Card sx={{ maxWidth: 345, mb: 2 }}>
        <CardMedia component="img" height="140" image={imageUrl} alt={item.name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${item.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Amount: {item.amount}
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleOpenUpdateDialog}>
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
      {isUpdateDialogOpen && (
        <ItemUpdate
          open={isUpdateDialogOpen}
          onClose={handleCloseUpdateDialog}
          itemData={item}
        />
      )}
    </>
  );
};
Item.propTypes = {
  item: PropTypes.object.isRequired, 
  fetchItems: PropTypes.func.isRequired,
};
export default Item;

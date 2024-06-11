import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Grid, CircularProgress, Snackbar, Alert, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Item from "../../scenes/Products/item";
import ItemAddDialog from "./productItemAdd"; 
import Header from "../../components/Header";

const Products = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchItems = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get("http://localhost:5001/items");
      setItems(response.data);
    } catch (error) {
      setIsError(true);
      console.error("Failed to fetch items:", error);
      setSnackbar({ open: true, message: 'Failed to fetch items', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Header title="Products" subtitle="Manage Products" />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        sx={{ mt: 2, mb: 2 }}
      >
        Add Item
      </Button>
      <TextField
        placeholder="Search items..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{ endAdornment: <SearchIcon /> }}
        sx={{ mb: 2, width: "100%" }}
      />
      <Grid container spacing={2}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" width="100%">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box display="flex" justifyContent="center" width="100%">
            <Typography color="error">Error fetching items.</Typography>
          </Box>
        ) : (
          filteredItems.map((item) => (
            <Item key={item.id} item={item} fetchItems={fetchItems} />
          ))
        )}
      </Grid>
      {isAddDialogOpen && <ItemAddDialog onClose={handleCloseAddDialog} fetchItems={fetchItems} />}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;

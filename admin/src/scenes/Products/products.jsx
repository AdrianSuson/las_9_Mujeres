import { useState, useEffect } from "react";
import { Box, Button, TextField, Grid,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Item from "../../scenes/Products/item";
import ItemAddDialog from "./productItemAdd"; 
import axios from 'axios';
import Header from "../../components/Header";

const Items = () => {
  const [items, setItems] = useState([]); // Store items state
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Define the function to fetch items
  const fetchItems = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get("http://localhost:5001/items");
      setItems(response.data);
    } catch (error) {
      setIsError(true);
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);

  const addToCart = (item) => {
    console.log("Add to cart:", item);
    // Implement your add to cart logic here
  };

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
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching items.</div>
        ) : (
          filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item.id}>
              <Item item={item} addToCart={addToCart} />
            </Grid>
          ))
        )}
      </Grid>
      {isAddDialogOpen && <ItemAddDialog onClose={handleCloseAddDialog} />}
    </Box>
  );
};

export default Items;

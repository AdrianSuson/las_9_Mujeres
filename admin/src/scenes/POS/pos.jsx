/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  useTheme,
  ListItemText,
  ListItem,
  List,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Header from "../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Item from "./PosCard";
import config from "../../state/config";

const POS = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moneyGiven, setMoneyGiven] = useState("");
  const [change, setChange] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.API_URL}/items`);
        setItems(
          response.data.map((item) => ({
            ...item,
            quantity: 1,
            price: parseFloat(item.price),
          }))
        );
      } catch (error) {
        console.error("Error fetching items data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addOrder = (itemToAdd) => {
    const itemIndex = items.findIndex((item) => item.id === itemToAdd.id);

    if (itemIndex !== -1 && items[itemIndex].amount >= itemToAdd.quantity) {
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        amount: updatedItems[itemIndex].amount - itemToAdd.quantity,
      };

      setItems(updatedItems);

      setCart((prevCart) => {
        const existingCartItemIndex = prevCart.findIndex(
          (item) => item.id === itemToAdd.id
        );
        const newCart = [...prevCart];

        if (existingCartItemIndex >= 0) {
          const newQuantity =
            newCart[existingCartItemIndex].quantity + itemToAdd.quantity;
          newCart[existingCartItemIndex] = {
            ...newCart[existingCartItemIndex],
            quantity: newQuantity,
          };
        } else {
          newCart.push({ ...itemToAdd, quantity: itemToAdd.quantity });
        }

        return newCart;
      });
    } else {
      alert("Not enough stock");
    }
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === itemId
      );
      if (existingItemIndex === -1) return currentCart;

      const itemInItemsIndex = items.findIndex((item) => item.id === itemId);
      if (itemInItemsIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[itemInItemsIndex] = {
          ...updatedItems[itemInItemsIndex],
          amount:
            updatedItems[itemInItemsIndex].amount +
            currentCart[existingItemIndex].quantity,
        };
        setItems(updatedItems);
      }

      if (currentCart[existingItemIndex].quantity === 1) {
        return currentCart.filter((item) => item.id !== itemId);
      } else {
        return currentCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const processSale = async () => {
    const transactionName = "POS Sale - " + new Date().toLocaleDateString();
    const saleRecords = cart.map((item) => ({
      transaction_name: transactionName,
      sales_name: item.name,
      amount: item.quantity,
      price: item.price,
      transaction_date: new Date().toISOString().split("T")[0],
      total_sales: (item.price * item.quantity).toFixed(2),
      itemId: item.id,
      quantity: item.quantity,
    }));

    try {
      await Promise.all(
        saleRecords.map((record) =>
          axios.post(`${config.API_URL}/sales`, record)
        )
      );
      await Promise.all(
        cart.map((item) =>
          axios.put(`${config.API_URL}/items/${item.id}/decrement`, {
            amountToDecrement: item.quantity,
          })
        )
      );
      alert("Sale processed successfully!");
      setCart([]);
      window.location.reload(false);
    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Failed to process sale.");
    }
  };

  const handleMoneyGivenChange = (event) => {
    const value = event.target.value;
    setMoneyGiven(value);
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      const totalAmount = parseFloat(total);
      const changeAmount = parsedValue - totalAmount;
      setChange(changeAmount >= 0 ? changeAmount.toFixed(2) : null);
    } else {
      setChange(null);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem" width="100%" display="flex">
      <Box flex="1">
        <Header title="Point of Sale" subtitle="" />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <TextField
            label="Search Items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, marginRight: "15px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item.id}>
              <Item item={item} addToCart={addOrder} cart={cart} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          width: 300,
          boxSizing: "border-box",
          padding: theme.spacing(2),
          borderLeft: `1px solid ${theme.palette.divider}`,
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">List</Typography>
        </Box>
        <List>
          {cart.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${item.name} x ${item.quantity}`}
                secondary={`₱${item.price.toFixed(2)} each`}
              />
              <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                <CloseIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            width: 300,
            padding: theme.spacing(2),
            borderTop: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Typography variant="h6">Total: ₱{total}</Typography>
          <TextField
            label="Money Given"
            variant="outlined"
            value={moneyGiven}
            onChange={handleMoneyGivenChange}
            type="number"
            fullWidth
            sx={{ mt: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Change: ₱{change}
          </Typography>
          <Button
            onClick={processSale}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default POS;

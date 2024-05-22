/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  Grid,
  useTheme,
  ListItemText,
  ListItem,
  List,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../state/config";

const Item = ({ item, addToCart, cart }) => {
  const theme = useTheme();
  const imageUrl = `${config.API_URL}/assets/${item.image}`;
  const inCart = cart.find((cartItem) => cartItem.id === item.id);

  return (
    <Card
      sx={{
        maxWidth: 345,
        position: "relative",
        mb: 2,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={item.name}
      />
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
        {inCart && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            In Cart: {inCart.quantity}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        {item.amount > 0 ? (
          <Button
            size="small"
            variant="outlined"
            onClick={() => addToCart({ ...item, quantity: 1 })}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary[500],
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Add Order
          </Button>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginRight: "8px" }}
          >
            Sold Out
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

const POS = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const theme = useTheme();

  const toggleCartDialog = () => {
    setCartOpen(!cartOpen);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.API_URL}/items`);
        setItems(response.data.map((item) => ({ ...item, quantity: 1 })));
      } catch (error) {
        console.error("Error fetching items data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addOrder = (itemToAdd) => {
    // Find the index of the item in the items array
    const itemIndex = items.findIndex((item) => item.id === itemToAdd.id);

    // Check if the item exists and there is enough stock
    if (itemIndex !== -1 && items[itemIndex].amount >= itemToAdd.quantity) {
      // Update the item amount in the items state to reflect the decrease
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        amount: updatedItems[itemIndex].amount - itemToAdd.quantity,
      };

      // Update the items state with the new item amounts
      setItems(updatedItems);

      // Update the cart to include the added item or update the quantity
      setCart((prevCart) => {
        const existingCartItemIndex = prevCart.findIndex(
          (item) => item.id === itemToAdd.id
        );
        const newCart = [...prevCart];

        if (existingCartItemIndex >= 0) {
          // If the item already exists in the cart, update its quantity
          const newQuantity =
            newCart[existingCartItemIndex].quantity + itemToAdd.quantity;
          newCart[existingCartItemIndex] = {
            ...newCart[existingCartItemIndex],
            quantity: newQuantity,
          };
        } else {
          // If the item is not in the cart, add it with its quantity
          newCart.push({ ...itemToAdd, quantity: itemToAdd.quantity });
        }

        return newCart;
      });
    } else {
      // If there is not enough stock, alert the user
      alert("Not enough stock");
    }
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === itemId
      );
      if (existingItemIndex === -1) return currentCart; // Item not found in cart, do nothing

      // Increment item amount in items state
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

      // Remove or decrement quantity in cart
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
      toggleCartDialog();
    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Failed to process sale.");
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
    <Box m="1.5rem 2.5rem">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="1rem"
      >
        <TextField
          fullWidth
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, flexGrow: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={toggleCartDialog}
          sx={{
            mb: 2,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          View Orders
        </Button>
      </Box>

      <Dialog
        open={cartOpen}
        onClose={toggleCartDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Cart
          <IconButton
            onClick={toggleCartDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              borderRadius: theme.shape.borderRadius,
              "&:hover": {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {cart.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${item.name} x ${item.quantity}`}
                  secondary={`$${item.price.toFixed(2)} each`}
                />
                <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Total: ${total}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={processSale} variant="contained" color="primary">
            Checkout
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Item item={item} addToCart={addOrder} cart={cart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Inside the Item component
Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
};

// Inside the POS component
POS.propTypes = {
  items: PropTypes.array.isRequired,
  cart: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  toggleCartDialog: PropTypes.func.isRequired,
};

export default POS;

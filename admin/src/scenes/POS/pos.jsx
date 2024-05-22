/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from '../../components/Header';
import CloseIcon from '@mui/icons-material/Close';
import Item from './PosCard';
import config from '../../state/config';

const POS = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
        console.error('Error fetching items data:', error);
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
      alert('Not enough stock');
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
    const transactionName = 'POS Sale - ' + new Date().toLocaleDateString();
    const saleRecords = cart.map((item) => ({
      transaction_name: transactionName,
      sales_name: item.name,
      amount: item.quantity,
      price: item.price,
      transaction_date: new Date().toISOString().split('T')[0],
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
      alert('Sale processed successfully!');
      setCart([]);
      toggleCartDialog();
      window.location.reload(false);
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Failed to process sale.');
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
    <Box m="1.5rem 2.5rem" width="100%">
      <Header title="Kiosk" subtitle="" />
      <Box
        sx={{
          marginRight: '15px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={toggleCartDialog}
          sx={{
            mb: 2,
            color: theme.palette.primary[500],
            background: theme.palette.secondary[500],
            transition: 'transform 0.2s',
            '&:hover': {
              color: theme.palette.secondary[600],
              background: theme.palette.primary[600],
              transform: 'scale(1.1)',
            },
          }}
        >
          Item List
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginLeft: '15px', mb: 2, flexGrow: 1, mr: 2 }}
        />
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
              position: 'absolute',
              right: 8,
              top: 8,
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
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
                <IconButton
                  edge="end"
                  onClick={() => removeFromCart(item.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Total: ${total}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={processSale}
            variant="contained"
            color="primary"
          >
            Checkout
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={2.4} key={item.id}>
            <Item item={item} addToCart={addOrder} cart={cart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default POS;

import PropTypes from 'prop-types';
import { Button, Card, CardActions, CardContent, CardMedia, Typography, useTheme } from '@mui/material';
import config from '../../state/config';

const Item = ({ item, addToCart, cart }) => {
  const theme = useTheme();
  const imageUrl = `${config.API_URL}/assets/${item.image}`;
  const inCart = cart.find((cartItem) => cartItem.id === item.id);

  return (
    <Card
      sx={{
        maxWidth: 345,
        position: 'relative',
        mb: 2,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
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
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {item.amount > 0 ? (
          <Button
            size="small"
            variant="outlined"
            onClick={() => addToCart({ ...item, quantity: 1 })}
            sx={{
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
            Add Item
            {inCart && <Typography ml={1}>-{inCart.quantity}-</Typography>}
          </Button>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginRight: '8px' }}
          >
            Sold Out
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Item;

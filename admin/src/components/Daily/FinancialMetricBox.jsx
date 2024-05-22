import { Box, Avatar, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types'; 

const FinancialMetricBox = ({ icon, label, value, currency, backgroundColor, color }) => {
  const theme = useTheme();
  const formattedValue = (value || 0).toLocaleString(undefined, { style: 'currency', currency });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor,
        color,
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
        transition: theme.transitions.create('box-shadow'),
      }}
    >
      <Avatar sx={{ bgcolor: color, color: backgroundColor, marginRight: theme.spacing(2) }}>{icon}</Avatar>
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h6" sx={{ marginLeft: 'auto' }}>
        {formattedValue}
      </Typography>
    </Box>
  );
};
FinancialMetricBox.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
export default FinancialMetricBox;

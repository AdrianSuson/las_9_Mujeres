import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const StatBox = ({ label, value = "N/A" }) => {
  const toFixedSafe = (num, digits = 2) => {
    const parsedValue = Number(num);
    return !isNaN(parsedValue) ? parsedValue.toFixed(digits) : "N/A";
  };

  const formattedValue = toFixedSafe(value);

  return (
    <Box>
      <Typography variant="h6" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h5" color="textPrimary">
        {formattedValue}
      </Typography>
    </Box>
  );
};

StatBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StatBox;

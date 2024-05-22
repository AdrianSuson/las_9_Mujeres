import { Box, Typography, Grid, Avatar, useTheme } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PropTypes from 'prop-types';

const FinancialMetricBox = ({
  icon,
  label,
  value,
  currency,
  backgroundColor,
  color,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor,
        color,
        "&:hover": {
          boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
        },
        transition: theme.transitions.create("box-shadow"),
        flexDirection: { xs: "column", sm: "row" }, // Stack the layout vertically on extra small devices
        textAlign: { xs: "center", sm: "left" },
        p: { xs: theme.spacing(1), sm: theme.spacing(2) }, // Smaller padding on smaller screens
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          color: backgroundColor,
          marginRight: { sm: theme.spacing(2) },
          marginBottom: { xs: theme.spacing(1), sm: 0 }, // Add margin bottom on small screens
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6">{label}</Typography>
      <Typography
        variant="h6"
        sx={{ marginLeft: { sm: "auto" }, mt: { xs: 1, sm: 0 } }}
      >
        {value.toLocaleString(undefined, { style: "currency", currency })}
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

const FinancialSummary = ({
  totalSales,
  totalExpenses,
  totalIncome,
}) => {
  const theme = useTheme();

  const incomeIcon =
    totalIncome < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />;
  const incomeLabel = totalIncome < 0 ? "Loss" : "Income";

  return (
    <Grid container spacing={2} sx={{ p: 4 }}>
      <Grid item xs={12} md={4}>
        <FinancialMetricBox
          icon={<AttachMoneyIcon />}
          label="Sales"
          value={totalSales}
          currency="PHP"
          backgroundColor={theme.palette.info.light}
          color={theme.palette.success.contrastText}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FinancialMetricBox
          icon={<MoneyOffIcon />}
          label="Expenses"
          value={totalExpenses}
          currency="PHP"
          backgroundColor={theme.palette.error.light}
          color={theme.palette.error.contrastText}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FinancialMetricBox
          icon={incomeIcon}
          label={incomeLabel}
          value={Math.abs(totalIncome)}
          currency="PHP"
          backgroundColor={
            totalIncome < 0
              ? theme.palette.error.light
              : theme.palette.success.light
          }
          color={
            totalIncome < 0
              ? theme.palette.error.contrastText
              : theme.palette.info.contrastText
          }
        />
      </Grid>
    </Grid>
  );
};

FinancialSummary.propTypes = {
  totalSales: PropTypes.number.isRequired, 
  totalExpenses: PropTypes.number.isRequired, 
  totalIncome: PropTypes.number.isRequired, 
};

export default FinancialSummary;

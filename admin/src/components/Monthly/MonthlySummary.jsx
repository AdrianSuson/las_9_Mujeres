// src/components/MonthlySummary.jsx
import { Grid, useTheme } from '@mui/material';
import FinancialMetricBox from './FinancialMetricBox';
import SalesIcon from '@mui/icons-material/TrendingUp';
import ExpensesIcon from '@mui/icons-material/TrendingDown';
import IncomeIcon from '@mui/icons-material/MonetizationOn';
import PropTypes from 'prop-types';


const MonthlySummary = ({
  totalSales,
  totalExpenses,
  totalIncome,
}) => {
  const theme = useTheme();

  const incomeLabel = totalIncome >= 0 ? "Net Income" : "Net Loss";
  const incomeBackgroundColor = totalIncome >= 0 ? theme.palette.success.light : theme.palette.error.light;
  const incomeIcon = totalIncome >= 0 ? <IncomeIcon /> : <ExpensesIcon />;

  return (
    <Grid container spacing={2} sx={{ p: 4 }}>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={<SalesIcon />}
          label="Sales"
          value={totalSales}
          currency="PHP"
          backgroundColor={theme.palette.info.light}
          color={theme.palette.success.contrastText}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={<ExpensesIcon />}
          label="Expenses"
          value={totalExpenses}
          currency="PHP"
          backgroundColor={theme.palette.error.light}
          color={theme.palette.error.contrastText}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={incomeIcon}
          label={incomeLabel}
          value={totalIncome}
          currency="PHP"
          backgroundColor={incomeBackgroundColor}
          color={theme.palette.info.contrastText}
        />
      </Grid>
    </Grid>
  );
};
MonthlySummary.propTypes = {
  totalSales: PropTypes.number.isRequired, 
  totalExpenses: PropTypes.number.isRequired, 
  totalIncome: PropTypes.number.isRequired, 
  selectedYear: PropTypes.number.isRequired,
};
export default MonthlySummary;

import { Grid } from '@mui/material';
import FinancialMetricBox from './FinancialMetricBox';
import SalesIcon from "@mui/icons-material/TrendingUp";
import ExpensesIcon from "@mui/icons-material/TrendingDown";
import PropTypes from 'prop-types';
import IncomeIcon from "@mui/icons-material/MonetizationOn";

const FinancialSummary = ({ daySalesData, dayExpensesData, dayIncomeData }) => {
  const incomeLabel = dayIncomeData >= 0 ? "Net Income" : "Net Loss";
  const incomeIcon = dayIncomeData >= 0 ? <IncomeIcon /> : <ExpensesIcon />; 
  const incomeBackgroundColor = dayIncomeData >= 0 ? "#4caf50" : "#f44336"; 

  return (
    <Grid container spacing={2} sx={{ p: 4 }}>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={<SalesIcon />}
          label="Sales"
          value={daySalesData}
          currency="PHP"
          backgroundColor="#2196f3"
          color="#fff"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={<ExpensesIcon />}
          label="Expenses"
          value={dayExpensesData}
          currency="PHP"
          backgroundColor="#f44336"
          color="#fff"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FinancialMetricBox
          icon={incomeIcon}
          label={incomeLabel}
          value={Math.abs(dayIncomeData)}
          currency="PHP"
          backgroundColor={incomeBackgroundColor}
          color="#fff"
        />
      </Grid>
    </Grid>
  );
};
FinancialSummary.propTypes = {
  selectedMonth: PropTypes.number.isRequired,
  selectedYear: PropTypes.number.isRequired,
  daySalesData: PropTypes.number.isRequired,
  dayExpensesData: PropTypes.number.isRequired,
  dayIncomeData: PropTypes.number.isRequired,
};
export default FinancialSummary;

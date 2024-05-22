import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import PropTypes from 'prop-types';

const DailyChartComponent = ({
  combinedChartData,
  selectedYear,
  selectedMonth,
}) => {
  const isNoData = !combinedChartData.some(
    (data) => data.sales > 0 || data.expenses > 0 || data.income > 0
  );
  const [visibility, setVisibility] = useState({
    Sales: true,
    Expenses: true,
    Income: true,
  });

  const toggleVisibility = (line) => {
    setVisibility((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  const nivoChartData = [
    {
      id: "Sales",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.sales),
      })),
      color: "#2196f3",
    },
    {
      id: "Expenses",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.expenses),
      })),
      color: "#f44336",
    },
    {
      id: "Income",
      data: combinedChartData.map((data) => ({
        x: data.x,
        y: Math.max(0, data.income),
      })),
      color: "#4caf50",
    },
  ].filter((series) => visibility[series.id]);

  return (
    <Box
      mt={4}
      height="300px"
      borderRadius={3}
      style={{ background: "linear-gradient(135deg, #f5f7fa, #99c199)" }}
    >
      {!isNoData ? (
        <ResponsiveLine
          data={nivoChartData}
          margin={{ top: 50, right: 160, bottom: 90, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Day",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ datum: "color" }}
          enableArea
          enableSlices={"x"}
          pointSize={2}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          enableGridX={false}
          enableGridY={false}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height:"100%"
        }}
        mx="auto"
      >
        <Typography
          variant="subtitle1"
          align="center"
          color="primary"
          style={{ fontSize: "20px"}}
        >
          No financial data available for {selectedMonth} - {selectedYear}.
        </Typography>
        </Box>
      )}
      {!isNoData && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {["Sales", "Expenses", "Income"].map((line) => (
            <FormControlLabel
              key={line}
              control={
                <Checkbox
                  checked={visibility[line]}
                  onChange={() => toggleVisibility(line)}
                  color="primary"
                />
              }
              label={line}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
DailyChartComponent.propTypes = {
  combinedChartData: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    sales: PropTypes.number.isRequired,
    expenses: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired,
  })).isRequired,
  selectedYear: PropTypes.number.isRequired,
  selectedMonth: PropTypes.number.isRequired,
};

export default DailyChartComponent;

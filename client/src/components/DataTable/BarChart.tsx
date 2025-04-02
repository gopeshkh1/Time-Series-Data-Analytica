import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  AggregationType,
  AggregationTimeWindow,
  aggregateData,
  AggregatedResult,
} from "../../utils/Aggregation";

interface BarChartComponentProps {
  headers: Record<string, string>[];
  rows: Record<string, string>[];
}

const BarChartComponent = ({ headers, rows }: BarChartComponentProps) => {
  if (!headers?.length || !rows?.length) return <></>;

  const [aggregationWindow, setAggregationWindow] = useState(
    String(AggregationTimeWindow.Daily)
  );
  const [aggregationType, setAggregationType] = useState(
    String(AggregationType.Mean)
  );

  const numericalColumns = headers
    .filter(
      (header) => header.data_type === "float" || header.data_type === "int"
    )
    .map((header) => header.header_name);

  if (!numericalColumns?.length) return <></>;
  const [selectedColumn, setSelectedColumn] = useState<string>(
    numericalColumns[0]
  );

  const timestampColumn = headers.find(
    (header) => header.data_type === "timestamp"
  )?.header_name;
  if (!timestampColumn) return <></>;

  const [barChartData, setBarChartData] = useState<AggregatedResult[]>([]);

  useEffect(() => {
    console.log("Changes;", aggregationType, aggregationWindow);
    const newData = aggregateData(
      rows,
      timestampColumn,
      selectedColumn,
      aggregationType as AggregationType,
      aggregationWindow as AggregationTimeWindow
    );
    console.log("aggregateddatat", newData);
    setBarChartData(newData);
  }, [selectedColumn, aggregationWindow, aggregationType]);

  const onSelectColumnForBarChart = (
    e: React.ChangeEvent<{ value: unknown }> | SelectChangeEvent<string>
  ) => {
    const selected = numericalColumns.find((col) => col === e.target.value);
    if (selected) {
      setSelectedColumn(selected);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Bar Chart</Typography>
      <Box display="flex" gap={2} mb={2}>
        <FormControl>
          <FormLabel>Select Column</FormLabel>
          <Select value={selectedColumn} onChange={onSelectColumnForBarChart}>
            {numericalColumns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Aggregation Window</FormLabel>
          <Select
            value={aggregationWindow}
            onChange={(e) => setAggregationWindow(e.target.value)}
          >
            {Object.values(AggregationTimeWindow).map((window) => (
              <MenuItem key={window} value={window}>
                {window}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Aggregation Type</FormLabel>
          <Select
            value={aggregationType}
            onChange={(e) => setAggregationType(e.target.value)}
          >
            {Object.values(AggregationType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <BarChart width={400} height={300} data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const { period, value } = payload[0].payload;
            return (
              <div
                style={{
                  background: "white",
                  padding: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  <strong>Period:</strong> {period}
                </p>
                <p>
                  <strong>Value:</strong> {value}
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="value" fill="#8884d8" barSize={40} />
      </BarChart>
    </Box>
  );
};

export default BarChartComponent;

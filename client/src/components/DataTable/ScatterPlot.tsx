import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useState } from "react";

interface ScatterPlotComponentProps {
  rows: Record<string, string>[];
  headers: Record<string, string>[];
}

const ScatterPlotComponent = ({ headers, rows }: ScatterPlotComponentProps) => {
  if (!headers?.length || !rows?.length) return <></>;
  const numericalColumns = headers
    .filter(
      (header) => header.data_type === "float" || header.data_type === "int"
    )
    .map((header) => header.header_name);
  console.log(rows, numericalColumns);

  if (!numericalColumns?.length) return <></>;

  if (numericalColumns.length < 2 || !rows.length) return <></>;
  const [selectedScatterColumns, setSelectedScatterColumns] = useState({
    x: numericalColumns[0],
    y: numericalColumns[1],
  });

  const handleColumnChange =
    (axis: "x" | "y") => (event: SelectChangeEvent<string>) => {
      const selected = numericalColumns.find(
        (col) => col === event.target.value
      );

      setSelectedScatterColumns((prev) => ({
        ...prev,
        [axis]: selected ? selected : prev[axis],
      }));
    };

  const scatterPlotData = rows
    .filter(
      (row) =>
        row[selectedScatterColumns.x] !== undefined &&
        row[selectedScatterColumns.y] !== undefined
    )
    .map((row) => ({
      x: row[selectedScatterColumns.x],
      y: row[selectedScatterColumns.y],
    }));

  return (
    <Box>
      <Typography variant="h6">Scatter Plot</Typography>
      <Box display="flex" gap={2} mb={2}>
        <FormControl>
          <FormLabel>Select X-Axis</FormLabel>
          <Select
            value={selectedScatterColumns.x}
            onChange={handleColumnChange("x")}
          >
            {numericalColumns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Select Y-Axis</FormLabel>
          <Select
            value={selectedScatterColumns.y}
            onChange={handleColumnChange("y")}
          >
            {numericalColumns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ScatterChart width={400} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" name={selectedScatterColumns.x} />
        <YAxis dataKey="y" name={selectedScatterColumns.y} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={scatterPlotData} fill="#82ca9d" />
      </ScatterChart>
    </Box>
  );
};

export default ScatterPlotComponent;

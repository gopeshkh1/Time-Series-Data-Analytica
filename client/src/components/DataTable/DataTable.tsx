import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { saveAs } from "file-saver";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  TablePagination,
  Button,
} from "@mui/material";
import BarChartComponent from "./BarChart";
import ScatterPlotComponent from "./ScatterPlot";
import { DataRecord } from "../../interfaces/CommonInterface";

interface DataTableProps {
  uploadId: string;
}

interface DataResponse {
  rows: DataRecord[];
  total_rows: number;
  headers: Record<string, string>[];
}

const DataTable = ({ uploadId }: DataTableProps) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetchData, setFetchData] = useState(true);
  const [cachedData, setCachedData] = useState<DataResponse | null>(null);

  const { isLoading, error } = useQuery<DataResponse>({
    queryKey: [uploadId, startDate, endDate],
    queryFn: async () => {
      const params: { [key: string]: string } = {};
      if (startDate) params.start_time = startDate;
      if (endDate) params.end_time = endDate;
      const response = await apiClient.get(`/data/${uploadId}`, { params });
      if (!response.data) {
        throw new Error("No data found");
      }
      setCachedData(response.data);
      return response.data;
    },
    enabled: !!uploadId && fetchData,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading data</Typography>;
  }

  const headers = cachedData?.headers || [];
  const rows = cachedData?.rows.map((row) => row.data) || [];

  const downloadCSV = () => {
    if (!cachedData || !cachedData.rows.length) {
      alert("No data available for download.");
      return;
    }
    const csvHeaders =
      headers.map((header) => header.header_name).join(",") + "\n";
    const csvRows = rows
      .map((row) =>
        headers.map((header) => String(row[header.header_name] || "")).join(",")
      )
      .join("\n");
    const blob = new Blob([csvHeaders + csvRows], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "data_export.csv");
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={4}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate || ""}
          onChange={(e) => {
            setStartDate(e.target.value);
            setFetchData(false);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate || ""}
          onChange={(e) => {
            setEndDate(e.target.value);
            setFetchData(false);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!startDate || !endDate || startDate > endDate}
          onClick={() => setFetchData(true)}
        >
          Submit
        </Button>
      </Box>
      {rows.length > 0 && (
        <>
          <Box display="flex" gap={2} mb={4}>
            <Typography variant="h6" gutterBottom>
              Data Preview
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadCSV}
              startIcon={<CloudDownloadIcon />}
            >
              Export
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell
                      key={header.header_name}
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      {header.header_name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: number) => (
                    <TableRow key={index}>
                      {headers.map((header) => (
                        <TableCell
                          key={header.header_name}
                          sx={{ textAlign: "center", padding: "8px" }}
                        >
                          {String(row[header.header_name] || "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />

          <Typography variant="h5" gutterBottom>
            Visualizations
          </Typography>
          <Box mt={4} gap={2} mb={4}>
            <BarChartComponent rows={rows} headers={headers} />
            <ScatterPlotComponent rows={rows} headers={headers} />
          </Box>
        </>
      )}

      {rows.length == 0 && (
        <Typography gutterBottom>No data for preview</Typography>
      )}
    </Box>
  );
};

export default DataTable;

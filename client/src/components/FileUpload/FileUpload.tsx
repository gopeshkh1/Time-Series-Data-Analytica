import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Button, CircularProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { getClientInfo } from "../../utils/ClientInfo";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload = ({ onSuccess }: { onSuccess: (data: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("client_ip", await getClientInfo());
      return apiClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data) => {
      onSuccess(data);
      setFile(null);
      setError(null);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to upload file");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Upload CSV File
      </Typography>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isPending}
      >
        Select File
        <VisuallyHiddenInput
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <div>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selected: {file.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isPending}
            sx={{ mt: 2 }}
          >
            {isPending ? <CircularProgress size={24} /> : "Upload File"}
          </Button>
        </div>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default FileUpload;

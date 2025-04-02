import { useState } from "react";
import FileUpload from "../components/FileUpload/FileUpload";
import DataTable from "../components/DataTable/DataTable";
import { Box, Container } from "@mui/material";

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const onFileUploadSuccess = (data: any) => {
    setUploadedFile(data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <FileUpload onSuccess={onFileUploadSuccess} />
        {uploadedFile && (
          <Box sx={{ mt: 4 }}>
            <DataTable uploadId={uploadedFile.upload_id} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UploadPage;

import React, { useState } from "react";
import { Button, Typography, Box, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const BulEnrollStudent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/bulkyy-enroll-students/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage(response.data.message);
      if (response.data.errors && response.data.errors.length > 0) {
        setErrorMessage("Some rows had errors. Check the API response.");
        console.error("Errors:", response.data.errors);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width:'100%',mx: "auto", textAlign: "center" }}>
      {/* <Typography variant="h4" gutterBottom>
        Bulk Enroll Students
      </Typography> */}

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ display: "none", width:'100%' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span" fullWidth>
            {file ? file.name : "Choose File"}
          </Button>
        </label>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} sx={{color:'white', '&:hover':{color:'white'}}} /> : <CloudUploadIcon />}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </Box>
  );
};

export default BulEnrollStudent;

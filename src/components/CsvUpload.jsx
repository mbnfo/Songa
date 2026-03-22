// CsvUpload.jsx
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../theme"; // adjust path if needed
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CsvUpload = ({ onUploadSuccess }) => {
  // ✅ Access theme colors
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ✅ Local state
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setSelectedFileName(selected.name);
    setUploaded(false); // reset upload state
  };

  // ✅ Handle upload to backend
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload success:", res.data);
      toast.success("CSV uploaded successfully!");

      // ✅ Reset states so file name disappears
      setUploaded(true);
      setSelectedFileName("");
      setFile(null);

      // ✅ Trigger dashboard refresh
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("CSV upload failed. Please try again.");
    }
  };

  return (
    <Box display="flex" gap="10px">
      {/* ✅ Select CSV button */}
      <Button
        variant="contained"
        component="label"
        sx={{
          backgroundColor: colors.greenAccent[700],
          color: colors.grey[100],
          fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
        }}
      >
        Select CSV
        <input type="file" accept=".csv" hidden onChange={handleFileChange} />
      </Button>

      {/* ✅ Show selected file name until upload */}
      {selectedFileName && !uploaded && (
        <Typography variant="body2" color={colors.grey[100]}>
          {selectedFileName}
        </Typography>
      )}

      {/* ✅ Upload button only visible until upload */}
      {!uploaded && file && (
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={handleUpload}
        >
          Upload CSV
        </Button>
      )}
    </Box>
  );
};

export default CsvUpload;
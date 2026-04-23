// CsvUpload.jsx
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../theme"; // ✅ adjust path if needed
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CsvUpload = ({ onUploadSuccess }) => {
  // ✅ Access theme colors for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ✅ Local state for file handling
  const [file, setFile] = useState(null);              // stores selected file
  const [selectedFileName, setSelectedFileName] = useState(""); // shows filename
  const [uploaded, setUploaded] = useState(false);     // tracks upload status

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0]; // get first selected file
    if (!selected) return;
    setFile(selected);                  // store file in state
    setSelectedFileName(selected.name); // show filename
    setUploaded(false);                 // reset upload state
  };

  // ✅ Handle upload to backend
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    // Create FormData object for multipart upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ API URL (ngrok or localhost fallback)
      const API_URL = process.env.REACT_APP_API_URL ||"https://biasedly-abjective-brenden.ngrok-free.dev";
      // ✅ Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // ✅ Send POST request with JWT + multipart/form-data
      const res = await axios.post(`${API_URL}/upload-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 🔒 send JWT for authentication
        },
      });

      console.log("Upload success:", res.data);
      toast.success("CSV uploaded successfully!");

      // ✅ Reset states so filename disappears
      setUploaded(true);
      setSelectedFileName("");
      setFile(null);

      // ✅ Trigger dashboard refresh if callback provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      // ✅ Log backend error if available
      console.error("Upload failed:", error.response?.data || error.message);
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
        {/* Hidden file input */}
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

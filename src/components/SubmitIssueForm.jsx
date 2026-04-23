import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const SubmitIssueForm = ({ userId }) => {
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://biasedly-abjective-brenden.ngrok-free.dev";

  const [description, setDescription] = useState("");

  // ✅ Submit issue to backend
  const handleSubmitIssue = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/support/issues`,
        { userId: userId, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Issue submitted to Support!");
      setDescription(""); // clear field
    } catch (err) {
      console.error("Failed to submit issue:", err);
      alert("Could not submit issue.");
    }
  };

  return (
    <Box mt="20px">
      <TextField
        fullWidth
        label="Describe your issue"
        color="secondary"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmitIssue}
        sx={{ mt: 2 }}
      >
        Submit Issue
      </Button>
    </Box>
  );
};

export default SubmitIssueForm;

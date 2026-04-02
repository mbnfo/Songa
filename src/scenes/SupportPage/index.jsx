import { Box, Typography } from "@mui/material";
import SubmitIssueForm from "../../components/SubmitIssueForm";

const SupportPage = () => {
  const userId = localStorage.getItem("user_id"); // or however you store IDs

  return (
    <Box m="20px">
      <Typography variant="h4">Support</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Submit an issue to Support staff
      </Typography>
      <SubmitIssueForm userId={userId} />
    </Box>
  );
};

export default SupportPage;

import { Box, Typography, useTheme  } from "@mui/material";
import SubmitIssueForm from "../../components/SubmitIssueForm";
import { tokens } from "../../theme";
import Header from "../../components/Header";



const SupportPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userId = localStorage.getItem("user_id"); // or however you store IDs

  return (
    <Box m="20px">

      <Header title="SUPPORT" 
      subtitle="Need help? Let us know your issue below." />

       {/* <Typography variant="h4"color={colors.blueAccent[200]}>Support</Typography>
      <Typography variant="body1" sx={{ mb: 2 }} color={colors.blueAccent[100]}>
        "Need help? Let us know your issue below."
      </Typography> */}
      

      <SubmitIssueForm userId={userId} />
    </Box>
  );
};

export default SupportPage;

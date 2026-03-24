import React from "react";
import { Box, Typography, Button } from "@mui/material";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // ✅ Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // ✅ Log error details (could send to monitoring service)
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    // ✅ Reset error state and reload app
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="#1f2a40"
          color="#fff"
        >
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            {this.state.error?.message || "An unexpected error occurred."}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            Reload App
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
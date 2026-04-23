import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = "0.75" }) => {
  var size = 40; // default size
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  const screenWidth = window.innerWidth;
  if (screenWidth < 330) {
    size = 20
  } else if (screenWidth < 420){
    size = 35
  } else{
    size = 40
  }


  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;

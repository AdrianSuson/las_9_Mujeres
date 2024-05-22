import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box sx={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      width:"100hv"
    }}
    mx="auto"

     >
      <CircularProgress color="primary" size={60} thickness={4} />
    </Box>
  );
};

export default LoadingSpinner;

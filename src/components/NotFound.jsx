import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Stack minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
      <Typography variant="h4" fontWeight={500}>
        Not Found
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        color="primary"
        size="large"
        sx={{
          mt: 2,
          borderRadius: 2,
          letterSpacing: 1.5,
        }}
      >
        {"Go back"}
      </Button>
    </Stack>
  );
};

export default NotFound;

import { Stack } from "@mui/material";
import ReviewerForm from "../components/ReviewerForm";

const Login = () => {
  return (
    <Stack
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor={"#f9fcff"}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        width={"90%"}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={2}
      >
        <ReviewerForm />
      </Stack>
    </Stack>
  );
};

export default Login;

import { Box, Stack } from "@mui/material";
import UserForm from "../components/UserForm";
import video from "../assets/remove.mp4";

const Home = () => {
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
        <UserForm />
        <Box
          component="video"
          src={video}
          autoPlay
          loop
          muted
          controls={false}
          sx={{
            width: "fit-content",
            minHeight: "500px",
            maxHeight: { xs: "80vh", xl: "650px"  },
            display: { xs: "none", md: "flex" },
            boxShadow: "0px 0px 56px rgba(69, 69, 69, 0.4)",
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Home;

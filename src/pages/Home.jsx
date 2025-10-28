import { Box, Stack } from "@mui/material";
import UserForm from "../components/UserForm";
import video from "../assets/remove.mp4";
import { HOME_STYLE } from "../style";

const Home = () => {
  const { mainStack, innerStack, videoBox } = HOME_STYLE || {};
  return (
    <Stack sx={mainStack}>
      <Stack direction={{ xs: "column", md: "row" }} sx={innerStack}>
        <UserForm />
        <Box
          component="video"
          src={video}
          autoPlay
          loop
          muted
          controls={false}
          sx={videoBox}
        />
      </Stack>
    </Stack>
  );
};

export default Home;

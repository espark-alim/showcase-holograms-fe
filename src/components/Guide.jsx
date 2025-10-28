import { Box, Stack, Typography } from "@mui/material";
import GuidImage from "../assets/images/user-guide.png";
import { GUIDE_DATA } from "../constant";

const Guide = () => {
  const { text } = GUIDE_DATA || {};
  return (
    <Stack
      minHeight={"fit-content"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack spacing={3} p={1} maxWidth={500} alignItems={"center"}>
        <Typography
          variant="body2"
          letterSpacing={1}
          textAlign={{ xs: "center", md: "start" }}
        >
          {text}
        </Typography>
        <Box
          src={GuidImage}
          component={"img"}
          sx={{
            mx: "auto",
            width: "90%",
            maxWidth: { xs: "300px", md: "370px" },
            height: "fit-content",
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Guide;

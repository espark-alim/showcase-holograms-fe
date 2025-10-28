import { Box, Stack, Typography } from "@mui/material";
import GuidImage from "../assets/images/user-guide.png";

const Guide = () => {
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
          Drag to resize your photo so the faces are large, centered and fully
          within the red circle (Bodies can extend outside the circle, faces
          must stay within the circle)
        </Typography>
        <Box
          component={"img"}
          src={GuidImage}
          sx={{
            mx: "auto",
            width: "90%",
            maxWidth: "370px",
            height: "fit-content",
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Guide;

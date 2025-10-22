import { Box, Stack, Typography } from "@mui/material";
import GuidImage from "../assets/images/user-guide.png";

const Guide = () => {
  return (
    <Stack
      minHeight={"fit-content"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack spacing={3} width={"85%"} maxWidth={500}>
        <Typography variant="body1" letterSpacing={1}>
          Drag to resize your photo so the faces are large, centered and fully
          within the red circle (Bodies can extend outside the circle, faces
          must stay within the circle)
        </Typography>
        <Box component={"img"} src={GuidImage} sx={{ width: "100%" }} />
      </Stack>
    </Stack>
  );
};

export default Guide;

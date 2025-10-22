import { Stack, Button, Typography, Box } from "@mui/material";
import adjust from "../assets/images/adjust.png";

const Toolbar = ({
  onCrop = () => {},
  onSave = () => {},
  onSaveLoading = false,
  addImageLoading = false,
}) => {
  const items = [
    {
      label: "Adjustment",
      type: "adjust",
    },
  ];

  return (
    <Stack
      direction={{ xs: "row", sm: "row" }}
      alignItems="center"
      spacing={{ xs: 1, sm: 1.5 }}
      sx={{
        borderRadius: "999px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        p: 0.4,
        bgcolor: "#fff",
      }}
    >
      {items.map((item, idx) => (
        <Stack
          key={idx}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={1}
          sx={{
            textTransform: "none",
            color: "black",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover span": {
              color: "primary.main",
            },
          }}
          onClick={() => onCrop(true)}
        >
          <Box component={"img"} src={adjust} width={38} />
          <Typography variant="body1">{item.label}</Typography>
        </Stack>
      ))}

      <Button
        variant="contained"
        color="primary"
        disabled={onSaveLoading && addImageLoading}
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          boxShadow: "none",
          fontWeight: 600,
          px: 2.5,
        }}
        onClick={() => onSave()}
      >
        Save Photo
      </Button>
    </Stack>
  );
};

export default Toolbar;

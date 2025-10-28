import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import { Fade, Stack } from "@mui/material";

export default function ConfirmationModal({
  open = false,
  onClose = () => {},
  content = "This action cannot be undone. Please confirm to continue.",
  onConfirm = () => {},
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade direction="uo" in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              width: "75%",
              maxWidth: "400px",
              textAlign: "center",
              p: { xs: 3, sm: 4 },
              boxShadow: "hsla(220, 30%, 5%, 0.05)  0px 15px 35px -5px",
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              <Typography id="modal-title" variant="h6" component="h2">
                Are you sure you want to continue?
              </Typography>
              <Typography
                id="modal-description"
                textAlign={{ xs: "center", sm: "start" }}
                letterSpacing={1}
                variant="body2"
              >
                {content}
              </Typography>
            </Stack>

            <Stack direction={"row"} width={"100%"} spacing={1.6} mt={2.5}>
              <Button
                variant="contained"
                color="accent"
                fullWidth
                sx={{ boxShadow: "none" }}
                onClick={onClose}
              >
                {"Cancel"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ boxShadow: "none" }}
                onClick={onConfirm}
              >
                {"Confirm"}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

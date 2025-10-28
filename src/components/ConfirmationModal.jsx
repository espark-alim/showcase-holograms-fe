import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import { Fade, Stack } from "@mui/material";
import { CONFIRM_MODAL_STYLE } from "../style";

export default function ConfirmationModal({
  open = false,
  onClose = () => {},
  heading = "Are you sure you want to continue?",
  content = "This action cannot be undone. Please confirm to continue.",
  onConfirm = () => {},
}) {
  const { modalBox, cancelButton, confirmButton } = CONFIRM_MODAL_STYLE || {};
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
          <Box sx={modalBox}>
            <Stack spacing={2}>
              <Typography id="modal-title" variant="h6" component="h2">
                {heading}
              </Typography>
              <Typography
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
                sx={cancelButton}
                onClick={onClose}
              >
                {"Cancel"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={confirmButton}
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

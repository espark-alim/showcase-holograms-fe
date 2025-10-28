import {
  Box,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Button,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import DefUser from "../assets/images/def-user.png";
import FolderIcon from "../assets/images/folder-primary.png";
import Logout from "../assets/images/logout.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/image/imageSlice";
import { persistor } from "../store";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import TruncatedTooltipText from "./TruncatedTooltipText";

const menuItems = [{ icon: FolderIcon, label: "Users", path: "/dashboard" }];

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { name, email } = useSelector((state) => state.reviewer.current) || {};

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 3,
        color: theme.palette.text.primary,
        backgroundColor: "transparent",
      }}
    >
      <Box>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src={DefUser}
            sx={{
              width: 75,
              height: 75,
              mx: "auto",
              mb: 1,
              bgcolor: theme.palette.primary.main,
            }}
          />
          <TruncatedTooltipText
            text={name}
            maxWidth={140}
            variant="subtitle1"
            fontWeight={600}
            letterSpacing={1}
            color="black"
          />
          <TruncatedTooltipText
            text={email}
            maxWidth={160}
            variant="body2"
            color="text.secondary"
            letterSpacing={1}
          />
        </Box>

        <List disablePadding>
          {menuItems.map(({ icon, label, path }) => {
            const isActive = location.pathname.startsWith(path);

            return (
              <ListItemButton
                key={label}
                component={NavLink}
                to={path}
                disableRipple
                sx={{
                  borderRadius: 2,
                  my: 1,
                  mx: 2,
                  px: 2,
                  color: "black",
                  boxShadow: "hsla(220, 50%, 10%, 0.09)  0px 15px 35px -5px",
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                  }}
                >
                  <Box component={"img"} src={icon} width={24} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: 1,
                    fontSize: 15,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <ConfirmationModal
          open={open}
          onClose={handleClose}
          onConfirm={handleLogout}
          content={
            "You will be logged out of your account and need to sign in again to continue."
          }
        />
      </Box>
      <Button
        variant="caption"
        disableRipple
        startIcon={<Box component={"img"} src={Logout} width={24} />}
        onClick={handleOpen}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;

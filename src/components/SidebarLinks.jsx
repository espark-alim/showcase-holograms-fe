import {
  Box,
  Avatar,
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
import { SIDEBAR_LINKS_STYLE } from "../style";

const menuItems = [{ icon: FolderIcon, label: "Users", path: "/dashboard" }];

const Sidebar = () => {
  const { root, avatarContainer, avatar, listItemButton, listItemIcon } =
    SIDEBAR_LINKS_STYLE || {};
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
    <Box sx={root(theme)}>
      <Box>
        <Box sx={avatarContainer}>
          <Avatar src={DefUser} sx={avatar(theme)} />
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
                sx={listItemButton}
              >
                <ListItemIcon sx={listItemIcon}>
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

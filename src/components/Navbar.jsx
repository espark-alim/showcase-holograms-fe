import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { memo } from "react";

const Navbar = ({ openMobileSidebar }) => {
  const { user } = useSelector((state) => state?.auth) || {};

  const profileImg = user?.profile?.profile_image || user?.school?.image || "";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{ justifyContent: { xs: "space-between", md: "flex-end" } }}
      >
        <IconButton
          disableRipple
          onClick={() => openMobileSidebar?.(true)}
          edge="start"
          sx={{
            display: { xs: "flex", md: "none" },
            color: "#000",
            mr: 2,
          }}
        >
          <MenuOpenIcon style={{ fontSize: "35px" }} />
        </IconButton>
        <Box display="flex" alignItems="center" gap={2}>
          <Link to="/dashboard/profile" style={{ textDecoration: "none" }}>
            <Box display="flex" alignItems="center" gap={{ xs: 1, md: 2 }}>
              <Avatar
                src={profileImg}
                alt={user?.profile?.first_name}
                sx={{
                  width: { sm: 37, md: 40 },
                  height: { sm: 37, md: 40 },
                  textTransform: "capitalize",
                }}
              >
                {user?.profile?.first_name?.[0] || ""}
              </Avatar>
              <Box
                textAlign="left"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    color: "#404040",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100px",
                  }}
                >
                  {user?.role !== "school"
                    ? user?.profile?.first_name?.split(" ")[0] || "User"
                    : user?.school?.name?.split(" ")[0] || "User"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    color: "#404040",
                  }}
                >
                  {user?.role || "role"}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Navbar);

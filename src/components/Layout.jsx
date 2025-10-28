import { Box, IconButton } from "@mui/material";
import { DASHBOARD_LAYOUT_STYLE } from "../style";
import { useState } from "react";
import SidebarLayout from "./Sidebar";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { mainWrapper, pageWrapper, childrenStyle } =
    DASHBOARD_LAYOUT_STYLE || {};

  return (
    <Box sx={mainWrapper}>
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <SidebarLayout
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <IconButton
        onClick={() => setMobileSidebarOpen((prev) => !prev)}
        sx={{
          display: { xs: "flex", md: "none" },
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1300,
          backgroundColor: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "primary.main",
            color: "#fff",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <Box sx={pageWrapper}>
        {/* ------------------------------------------- */}
        {/* Page Route */}
        {/* ------------------------------------------- */}
        <Box
          sx={childrenStyle()}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

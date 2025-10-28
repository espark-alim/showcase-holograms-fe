import { Box, IconButton } from "@mui/material";
import { DASHBOARD_LAYOUT_STYLE } from "../style";
import { useState } from "react";
import SidebarLayout from "./Sidebar";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { mainWrapper, pageWrapper, iconButton, childrenStyle } =
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
        sx={iconButton}
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
        <Box sx={childrenStyle()}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

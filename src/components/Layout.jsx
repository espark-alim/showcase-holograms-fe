import { Box } from "@mui/material";
import { DASHBOARD_LAYOUT_STYLE } from "../style";
import { motion } from "framer-motion";
import { useState } from "react";
import SidebarLayout from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { mainWrapper, pageWrapper, childrenStyle } =
    DASHBOARD_LAYOUT_STYLE || {};
  const MotionBox = motion(Box);

  return (
    <Box sx={mainWrapper}>
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <SidebarLayout
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <Box sx={pageWrapper}>
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* <Navbar openMobileSidebar={setMobileSidebarOpen} /> */}
        {/* ------------------------------------------- */}
        {/* Page Route */}
        {/* ------------------------------------------- */}
        <MotionBox
          sx={childrenStyle()}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </MotionBox>
      </Box>
    </Box>
  );
};

export default Layout;

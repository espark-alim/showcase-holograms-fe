import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarLinks from "./SidebarLinks";

const Sidebar = ({ isMobileSidebarOpen, onSidebarClose }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const sidebarWidth = 240;
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: "border-box",
              ...scrollbarStyles,
              border: "0",
              boxShadow: "hsla(220, 50%, 10%, 0.09)  0px 15px 35px -5px",
              backgroundColor: "transparent",
            },
          }}
        >
          <SidebarLinks />
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <SidebarLinks />
    </Drawer>
  );
};

export default Sidebar;

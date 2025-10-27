// import { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";
// import { SIDEBAR_LINKS } from "../constant";

// const SidebarLinks = () => {
//   const [openLogoutModal, setOpenLogoutModal] = useState(false);
//   const { sidebarLink, profileLink, LogoutButton } = SIDEBAR_LINKS || {};
//   const { pathname } = useLocation();

//   const isActiveProfile =
//     pathname === profileLink?.link ||
//     pathname === `${profileLink?.link}/` ||
//     pathname.startsWith(profileLink?.link);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//       }}
//     >
//       {/* Top Section */}
//       <Box>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             minHeight: "70px",
//             px: 4,
//           }}
//         >
//           <Box component={"img"} src={""} sx={{ width: "auto" }} />
//         </Box>

//         {/* Sidebar Links */}
//         <Box
//           sx={{
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           {sidebarLink?.map(({ text, link, icon }, index) => {
//             const isActive =
//               pathname === link ||
//               pathname === `${link}/` ||
//               (link !== "/dashboard" && pathname.startsWith(link));

//             return (
//               <Link to={link} key={index} style={{ textDecoration: "none" }}>
//                 <Box
//                   sx={{
//                     width: "100%",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       mx: "auto",
//                       width: "100%",
//                       maxWidth: "192px",
//                       height: "50px",
//                       backgroundColor: isActive
//                         ? "primary.main"
//                         : "transparent",
//                       borderRadius: "6px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       px: 2.5,
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src={icon}
//                       sx={{
//                         width: "fit-content",
//                         height: 25,
//                       }}
//                     />
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 500,
//                         fontFamily: "Poppins",
//                         color: isActive ? "#fff" : "#000000",
//                       }}
//                     >
//                       {text}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Link>
//             );
//           })}
//         </Box>
//       </Box>

//       {/* Bottom Section */}
//       <Box
//         sx={{
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           borderTop: "1px solid #E0E0E0",
//           gap: 2,
//           py: 2,
//         }}
//       >
//         {/* Logout Button */}
//         <Box
//           sx={{
//             width: "100%",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <Box
//             onClick={() => setOpenLogoutModal(true)}
//             sx={{
//               mx: "auto",
//               maxWidth: "192px",
//               display: "flex",
//               alignItems: "center",
//               cursor: "pointer",
//               gap: 2,
//               px: 2.5,
//               mt: 1,
//             }}
//           >
//             <Box
//               src={LogoutButton?.icon}
//               component={"img"}
//               sx={{
//                 width: "fit-content",
//                 height: 25,
//               }}
//             />
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 500,
//                 color: "#000000",
//                 fontFamily: "Poppins",
//               }}
//             >
//               {LogoutButton?.text}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default SidebarLinks;

import {
  Box,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

// Icons
import FolderIcon from "@mui/icons-material/Folder";

// Sidebar Menu Items
const menuItems = [
  { icon: <FolderIcon />, label: "Users", path: "/dashboard" },
];

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();

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
      {/* --- Profile Section --- */}
      <Box>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 75,
              height: 75,
              mx: "auto",
              mb: 1,
              bgcolor: theme.palette.primary.main,
            }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            JOHN DON
          </Typography>
          <Typography variant="body2" color="text.secondary">
            johndon@company.com
          </Typography>
        </Box>

        {/* --- Navigation List --- */}
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
                    minWidth: 36,
                    color: theme.palette.primary.light,
                    transition: "color 0.3s ease",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: 1,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* --- Footer --- */}
      <Typography
        variant="caption"
        textAlign="center"
        sx={{ opacity: 0.7, mt: 2 }}
      >
        © {new Date().getFullYear()} Company
      </Typography>
    </Box>
  );
};

export default Sidebar;

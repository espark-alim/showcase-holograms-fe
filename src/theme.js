import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// default theme create
let theme = createTheme({
  palette: {
    primary: {
      light: "#66d9e6",
      main: "#0cc5db",
      dark: "#0892a3",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#ffffff",
      main: "#f0f3fc",
      dark: "#c2c8e0",
      contrastText: "#0cc5db",
    },
    accent: {
      main: "#EDAE91",
      light: "#EDAE91",
      dark: "#D59476",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "48px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "40",
      fontWeight: 600,
    },
    h3: {
      fontSize: "32px",
      fontWeight: 600,
    },
    h4: {
      fontSize: "28px",
      fontWeight: 500,
    },
    h5: {
      fontSize: "24px",
      fontWeight: 500,
    },
    h6: {
      fontSize: "20px",
      fontWeight: 500,
    },
    body1: {
      fontSize: "16px",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "14px",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "15px",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "13px",
      fontWeight: 400,
    },
    button: {
      textWrap: "nowrap",
      textTransform: "none",
      fontWeight: 600,
      boxShadow: 0,
    },
  },
  breakpoints: {
    values: {
      xs: 0, // Phones
      sm: 425, // Small phones
      md: 768, // Tablets
      lg: 1440, // Laptops
      xl: 1920, // Large desktops / Full HD
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

const USER_FORM_STYLE = {
  paperStyle: {
    width: "90%",
    maxWidth: 400,
    textAlign: "center",
    p: { xs: 3, sm: 4 },
    boxShadow: "hsla(220, 30%, 5%, 0.05)  0px 15px 35px -5px",
    backgroundColor: "transparent",
  },

  subTitleStyle: {
    variant: "h6",
    color: "#EDAE91",
    fontWeight: 700,
    mb: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: { xs: "center", md: "flex-start" },
    justifyContent: "center",
  },

  titleStyle: {
    width: "fit-content",
    component: "span",
    variant: "h5",
    fontWeight: 700,
    color: "primary.main",
    mt: -0.5,
  },

  formStyle: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  textFieldStyle: {
    "& .MuiInputBase-root": {
      backgroundColor: "transparent",
    },
    "& .MuiInputBase-input": {
      fontSize: "14px",
      letterSpacing: 1,
      backgroundColor: "transparent !important",
      // color: "#6f6f6f",
      WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
      transition: "background-color 9999s ease-in-out 0s",
      p: 1.2,
      "&::placeholder": {
        fontSize: "14px",
        color: "#9e9e9e",
        opacity: 1,
        letterSpacing: 1,
      },
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
      // WebkitTextFillColor: "#6f6f6f",
      transition: "background-color 9999s ease-in-out 0s !important",
    },

    "& .MuiInput-underline:before": {
      borderBottom: "1px solid #e2e2e2 !important",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "1px solid #e2e2e2 !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "1px solid #e2e2e2 !important",
      transform: "none !important",
    },
    "& .MuiInput-underline.Mui-focused:after": {
      borderBottom: "1px solid #e2e2e2 !important",
      transform: "none !important",
    },
    "& .Mui-focused": {
      outline: "none !important",
      border: "none !important",
      boxShadow: "none !important",
    },

    "& .MuiInputLabel-root": {
      color: "#9e9e9e",
      fontSize: "16px",
      letterSpacing: 1,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#9e9e9e",
      opacity: 1,
    },
  },

  buttonStyle: {
    mt: 2,
    letterSpacing: 1.5,
    borderRadius: "999px",
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "none",
  },
};

const DASHBOARD_LAYOUT_STYLE = {
  mainWrapper: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    // backgroundColor: "rgba(245, 246, 250, 1)",
  },
  pageWrapper: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    zIndex: 1,
    overflow: "hidden",
    height: "100vh",
  },
  childrenStyle: () => ({
    flexGrow: 1,
    // overflowY: "hidden",
    overflowX: "hidden",
    backgroundColor: "#fff",
    px: 3,
    py: 5,
  }),
};

export { USER_FORM_STYLE, DASHBOARD_LAYOUT_STYLE };

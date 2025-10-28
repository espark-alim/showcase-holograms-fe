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
  },
  pageWrapper: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    zIndex: 1,
    overflow: "hidden",
    height: "100vh",
  },
  iconButton: {
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
  },
  childrenStyle: () => ({
    flexGrow: 1,
    overflowX: "hidden",
    backgroundColor: "#fff",
    px: 3,
    py: 5,
  }),
};

const UPLOAD_STYLE = {
  rootBox: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
  },

  containerGrid: {
    mx: "auto",
    maxWidth: "775px",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 3,
    py: 2.5,
  },

  toolbarGrid: {
    display: "flex",
    justifyContent: "center",
  },

  imageGrid: {
    display: "flex",
    justifyContent: "center",
    px: 2,
  },

  cropBox: {
    position: "relative",
    mx: "auto",
    width: "80vw",
    height: "35vh",
    minHeight: 250,
    overflow: "hidden",
  },

  cropperStyle: {
    cropAreaStyle: {
      border: "4px solid red",
      borderRadius: "50%",
    },
  },

  imagePreview: {
    mx: "auto",
    maxWidth: "90vw",
    minHeight: "380px",
    maxHeight: "60vh",
    objectFit: "contain",
    display: "block",
  },

  sliderStack: {
    spacing: 2,
    alignItems: "center",
    my: 3,
  },

  sliderStyle: {
    width: 200,
  },

  actionButton: {
    borderRadius: "999px",
    textTransform: "none",
    boxShadow: "none",
    fontWeight: 600,
    px: 2.5,
  },
};

const IMAGES_STYLE = {
  container: {
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  innerStack: {
    py: 3.5,
    width: "85%",
    maxWidth: 1080,
    alignItems: "center",
  },

  uploadButton: {
    borderRadius: "999px",
    textTransform: "none",
    boxShadow: "none",
    fontWeight: 600,
    fontSize: { xs: "12px", md: "16px" },
    px: { xs: 1.5, sm: 2.5 },
  },

  submitButton: {
    borderRadius: "999px",
    textTransform: "none",
    boxShadow: "none",
    fontWeight: 600,
    fontSize: { xs: "12px", md: "16px" },
    px: { xs: 1.5, sm: 2.5 },
  },

  scrollBox: {
    mt: 1.5,
    p: 1,
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#0cc5db",
      borderRadius: "8px",
      transition: "background-color 0.3s",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#099fb3",
    },
    scrollbarWidth: "thin",
    scrollbarColor: "#0cc5db #f1f1f1",
  },

  // ===== StandardImageList =====

  imageListContainer: (imagesLength) => ({
    px: 1.5,
    py: 1.5,
    rowGap: 0.5,
    columnGap: 1.2,
    display: "grid",
    maxWidth: "1080px",
    justifyContent: "center",
    gridTemplateColumns: {
      xs: `repeat(1, ${imagesLength < 5 ? "auto" : "1fr"})`,
      sm: `repeat(${Math.min(imagesLength, 2)}, ${
        imagesLength < 5 ? "auto" : "1fr"
      })`,
      md: `repeat(${Math.min(imagesLength, 3)}, ${
        imagesLength < 5 ? "auto" : "1fr"
      })`,
      lg: `repeat(${Math.min(imagesLength, 4)}, ${
        imagesLength < 5 ? "auto" : "1fr"
      })`,
      xl: `repeat(${Math.min(imagesLength, 5)}, ${
        imagesLength < 5 ? "auto" : "1fr"
      })`,
    },
  }),

  imageBox: {
    position: "relative",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.08)",
      boxShadow: "0 6px 12px rgba(12, 197, 219, 0.4)",
    },
  },

  image: {
    width: "243px",
    height: "228px",
    cursor: "pointer",
    objectFit: "contain",
    objectPosition: "center",
  },

  deleteIconStack: {
    position: "absolute",
    zIndex: 1,
    top: -2.5,
    right: -2.5,
    cursor: "pointer",
  },

  deleteIcon: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    color: "primary.main",
    "&:hover": {
      color: "red",
    },
  },
};

const DETAILED_STYLE = {
  container: {
    "@media(max-width: 374px)": {
      justifyContent: "center",
    },
  },

  imageBox: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 2,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px rgba(12, 197, 219, 0.4)",
    },
  },

  image: {
    width: "100%",
    height: { xs: 105, sm: 140, md: 160, lg: 200 },
    objectFit: "contain",
    objectPosition: "center",
    cursor: "pointer",
    display: "block",
    "@media(max-width: 374px)": {
      width: "100%",
      height: "130px",
    },
  },

  iconStack: {
    position: "absolute",
    zIndex: 1,
    top: -2,
    right: -2,
    cursor: "pointer",
  },

  deleteIcon: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    color: "primary.main",
    "&:hover": {
      color: "red",
    },
  },
};

const HOME_STYLE = {
  mainStack: {
    minHeight: "100vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fcff",
  },

  innerStack: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },

  videoBox: {
    width: "fit-content",
    minHeight: "500px",
    maxHeight: { xs: "65vh", lg: "650px" },
    display: { xs: "none", md: "flex" },
    boxShadow: "0px 0px 56px rgba(69, 69, 69, 0.4)",
  },
};

const CONFIRM_MODAL_STYLE = {
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    width: "75%",
    maxWidth: "400px",
    textAlign: "center",
    p: { xs: 3, sm: 4 },
    boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 15px 35px -5px",
    borderRadius: 2,
  },

  cancelButton: {
    boxShadow: "none",
  },

  confirmButton: {
    boxShadow: "none",
  },
};

const DYNAMIC_TABLE_STYLE = {
  gridBox: {
    maxheight: "80vh",
    width: "100%",
    "& .MuiDataGrid-root": {
      border: "none", // Grid ka border remove
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      justifyContent: "center !important",
      fontWeight: 600,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      textAlign: "center !important",
      width: "100%",
    },
    "& .MuiDataGrid-cell": {
      textAlign: "center !important",
    },
    "& .MuiDataGrid-row": {
      borderBottom: "none !important",
      borderRadius: "6px",
      backgroundColor: "#fff",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "scale(1.01)",
        backgroundColor: "#fff !important",
        boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
      },
    },
    "& .MuiDataGrid-main": {
      backgroundColor: "#fff",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      backgroundColor: "transparent !important",
      boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
    },
    "& .MuiDataGrid-row.Mui-selected:hover": {
      backgroundColor: "transparent !important",
      boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
    },
  },
  grid: {
    "& .MuiTablePagination-displayedRows": {
      display: "none",
    },
    "& .MuiTablePagination-root .MuiButtonBase-root": {
      color: "primary.main",
    },
    "& .MuiTablePagination-root .MuiButtonBase-root.Mui-disabled": {
      color: "accent.main",
    },
    "& .MuiTablePagination-root .MuiButtonBase-root:hover": {
      backgroundColor: "rgba(25, 118, 210, 0.08)",
    },
  },
};

const EDIT_IMAGE_STYLE = {
  mainBox: {
    width: "100%",
    minHeight: "100%",
    display: "flex",
    alignItems: "center",
  },
  gridContainer: {
    mx: "auto",
    maxWidth: "775px",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 3,
    py: 2.5,
  },
  toolbarGrid: {
    display: "flex",
    justifyContent: "center",
  },
  imageGrid: {
    display: "flex",
    justifyContent: "center",
    px: 2,
  },
  cropBox: {
    position: "relative",
    mx: "auto",
    width: "80vw",
    height: "35vh",
    minHeight: 250,
    overflow: "hidden",
  },
  croppedImage: {
    mx: "auto",
    maxWidth: "90vw",
    minHeight: "380px",
    maxHeight: "60vh",
    objectFit: "contain",
    display: "block",
  },

  slider: {
    width: 200,
  },
  button: {
    borderRadius: "999px",
    textTransform: "none",
    boxShadow: "none",
    fontWeight: 600,
    px: 2.5,
  },
};

const SIDEBAR_LINKS_STYLE = {
  root: (theme) => ({
    width: 240,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    py: 3,
    color: theme.palette.text.primary,
    backgroundColor: "transparent",
  }),
  avatarContainer: {
    textAlign: "center",
    mb: 3,
  },
  avatar: (theme) => ({
    width: 75,
    height: 75,
    mx: "auto",
    mb: 1,
    bgcolor: theme.palette.primary.main,
  }),
  listItemButton: {
    borderRadius: 2,
    my: 1,
    mx: 2,
    px: 2,
    color: "black",
    boxShadow: "hsla(220, 50%, 10%, 0.09)  0px 15px 35px -5px",
    transition: "all 0.3s ease",
  },
  listItemIcon: {
    minWidth: 38,
  },
};

export {
  USER_FORM_STYLE,
  DASHBOARD_LAYOUT_STYLE,
  UPLOAD_STYLE,
  IMAGES_STYLE,
  DETAILED_STYLE,
  HOME_STYLE,
  CONFIRM_MODAL_STYLE,
  DYNAMIC_TABLE_STYLE,
  EDIT_IMAGE_STYLE,
  SIDEBAR_LINKS_STYLE,
};

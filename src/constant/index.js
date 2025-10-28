const PATHS = {
  home: "/",
  notFound: "*",
  login: "/login",

  // ------ user -----
  uploads: "/uploads",
  uploadImage: "/uploads/:id",

  // ------ reviewer ----------
  users: "/dashboard",
  userDetail: "/user/:id",
  editImageForReviewer: "/user/:id/:imageId",
  setting: "/setting",
};

const USER_FORM = {
  title: "HOLOGRAMS",
  subTitle: "SHOWCASE",
  buttonText: "Next",
  fields: [
    {
      name: "first_name",
      label: "First name",
      placeholder: "Enter First Name",
      type: "text",
    },
    {
      name: "last_name",
      label: "Last name",
      placeholder: "Enter Last Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone number",
      placeholder: "Enter Phone Number",
      type: "text",
    },
  ],
};

const REVIEWER_FORM = {
  title: "HOLOGRAMS",
  subTitle: "SHOWCASE",
  buttonText: "Login",
  fields: [
    {
      name: "username",
      label: "Email",
      placeholder: "Enter Email",
      type: "email",
    },
    {
      name: "password",
      label: "password",
      placeholder: "Enter Password",
      type: "password",
    },
  ],
};

const SIDEBAR_LINKS = {
  sidebarLink: [
    {
      text: "Dashboard",
      link: "/dashboard",
      // icon: dashboard,
    },
    {
      text: "Users",
      link: "/users",
      // icon: dashboard,
    },
    {
      text: "Setting",
      link: "/setting",
      // icon: dashboard,
    },
  ],
  LogoutButton: {
    text: "Logout",
    // icon: logout,
  },
};

const GUIDE_DATA = {
  text: `  Drag to resize your photo so the faces are large, centered and fully
            within the red circle (Bodies can extend outside the circle, faces
            must stay within the circle)`,
};

export { PATHS, USER_FORM, REVIEWER_FORM, SIDEBAR_LINKS, GUIDE_DATA };

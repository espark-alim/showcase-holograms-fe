const PATHS = {
  home: "/",
  notFound: "*",
  login: "/login",

  // ------ user -----
  uploads: "/uploads",
  uploadImage: "/uploads/:id",

  // ------ reviewer ----------
  dashboard: "/dashboard",
  users: "/users",
  userDetail: "/user/:mode",
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
      type: "number",
    },
  ],
};

const REVIEWER_FORM = {
  title: "HOLOGRAMS",
  subTitle: "SHOWCASE",
  buttonText: "Login",
  fields: [
    {
      name: "email",
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

export { PATHS, USER_FORM, REVIEWER_FORM, SIDEBAR_LINKS };

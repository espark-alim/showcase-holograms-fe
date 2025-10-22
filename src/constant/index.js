const PATHS = {
  home: "/",
  notFound: "*",
  uploads: "/uploads",
  uploadImage: "/uploads/:image",
};

const USER_FORM = {
  title: "HOLOGRAMS",
  subTitle: "SHOWCASE",
  buttonText: " Next",
  feilds: [
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
      name: "phone_number",
      label: "Phone number",
      placeholder: "Enter Phone Number",
      type: "tel",
    },
  ],
};

export { PATHS, USER_FORM };

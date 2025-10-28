import * as Yup from "yup";

export const userValidationSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^\+?[0-9]{10,15}$/,
      "Phone must be 10–15 digits (optional + allowed)"
    )
    .required("Phone number is required"),
});

import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { USER_FORM } from "../constant";
import { USER_FORM_STYLE } from "../style";
import { useAddUserMutation } from "../services/user";
import { userValidationSchema } from "../schema/userValidationSchema";

const UserForm = () => {
  const {
    paperStyle,
    subTitleStyle,
    titleStyle,
    formStyle,
    textFieldStyle,
    buttonStyle,
  } = USER_FORM_STYLE || {};

  const { title, subTitle, fields, buttonText } = USER_FORM || {};
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddUserMutation();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      const objToSend = { ...values, phone: values.phone.toString() };

      try {
        const response = await addUser(objToSend).unwrap();
        const { data } = response;
        toast.success("User registered successfully!");
        localStorage.setItem("accessToken", `${data?.user_id}`);
        navigate("/uploads");
      } catch (error) {
        console.error("Error adding user:", error);
        toast.error("Failed to register user. Please try again.");
      }
    },
  });

  return (
    <Paper elevation={0} sx={paperStyle}>
      <Typography {...subTitleStyle}>
        {subTitle}
        <Typography {...titleStyle}>{title}</Typography>
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} sx={formStyle}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type}
            fullWidth
            label={field.label}
            variant="standard"
            sx={textFieldStyle}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched[field.name] && Boolean(formik.errors[field.name])
            }
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            InputLabelProps={{
              required: false,
              sx: {
                color: "#9e9e9e",
                "&.Mui-error": {
                  color: "#9e9e9e",
                },
                "& .MuiFormLabel-asterisk": { display: "none" },
              },
            }}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={buttonStyle}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default UserForm;

import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { REVIEWER_FORM } from "../constant";
import { USER_FORM_STYLE } from "../style";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useReviewerLoginMutation } from "../services/reviewer";
import { useDispatch } from "react-redux";
import { addReviewer } from "../store/slices/image/imageSlice";
import { useFormik } from "formik";
import { reviewerValidationSchema } from "../schema/reviewerValidationSchema";

const ReviewerForm = () => {
  const {
    paperStyle,
    subTitleStyle,
    titleStyle,
    formStyle,
    textFieldStyle,
    buttonStyle,
  } = USER_FORM_STYLE || {};
  const { title, subTitle, fields, buttonText } = REVIEWER_FORM || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [reviewerLogin, { isLoading }] = useReviewerLoginMutation();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: reviewerValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const response = await reviewerLogin(formData).unwrap();
        toast.success("Successfully Logged In");
        localStorage.setItem("token", response?.access_token);
        dispatch(addReviewer(response));
        navigate("/dashboard");
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("Failed to login, please try again");
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
        {fields.map((field) => {
          const isPassword = field.type === "password";
          return (
            <TextField
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              type={isPassword && showPassword ? "text" : field.type}
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
              helperText={
                formik.touched[field.name] && formik.errors[field.name]
              }
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
              InputProps={
                isPassword
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            disableRipple
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
            />
          );
        })}

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

export default ReviewerForm;

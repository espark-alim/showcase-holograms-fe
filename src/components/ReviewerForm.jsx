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
import { REVIEWER_FORM, USER_FORM } from "../constant";
import { USER_FORM_STYLE } from "../style";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useReviewerLoginMutation } from "../services/reviewer";

const ReviewerForm = () => {
  const [reviewer, setReviewer] = useState({
    email: "",
    password: "",
  });

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
  const [showPassword, setShowPassword] = useState(false);
  const [reviewerLogin, { isLoading }] = useReviewerLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await reviewerLogin(reviewer).unwrap();
      console.log("User Data:", response);
      toast.success("Successfully Logged In");
      localStorage.setItem("token", "xyz");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to login please try again");
      localStorage.setItem("token", "xyz");
      navigate("/dashboard");
    }
  };

  return (
    <Paper elevation={0} sx={paperStyle}>
      <Typography {...subTitleStyle}>
        {subTitle}
        <Typography {...titleStyle}>{title}</Typography>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
        {fields.map((field) => {
          const isPassword = field.type === "password";

          return (
            <TextField
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              type={isPassword && showPassword ? "text" : field.type}
              fullWidth
              required={true}
              value={reviewer[field.name]}
              onChange={handleChange}
              label={field.label}
              variant="standard"
              sx={textFieldStyle}
              InputLabelProps={{
                required: false,
                sx: {
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
          loading={isLoading}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewerForm;

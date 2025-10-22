import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_FORM } from "../constant";
import { USER_FORM_STYLE } from "../style";
import { useAddUserMutation } from "../services/user";

const UserForm = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const {
    paperStyle,
    subTitleStyle,
    titleStyle,
    formStyle,
    textFieldStyle,
    buttonStyle,
  } = USER_FORM_STYLE || {};
  const { title, subTitle, feilds, buttonText } = USER_FORM || {};
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addUser(user).unwrap();
      console.log("User Data:", response);
      toast.success("User registered successfully!");
      localStorage.setItem("accessToken", "xyz");
      navigate("/uploads");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to register user. Please try again.");
      localStorage.setItem("accessToken", "xyz");
      navigate("/uploads");
    }
  };

  return (
    <Paper elevation={0} sx={paperStyle}>
      <Typography {...subTitleStyle}>
        {subTitle}
        <Typography {...titleStyle}>{title}</Typography>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
        {feilds.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type}
            fullWidth
            required={true}
            value={user[field.name]}
            onChange={handleChange}
            label={field.label}
            variant="standard"
            sx={textFieldStyle}
            InputLabelProps={{
              required: false,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
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
          loading={isLoading}
        >
          {isLoading ? "Submitting..." : buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default UserForm;

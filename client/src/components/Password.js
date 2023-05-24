import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [storedPassword, setStoredPassword] = useState(""); // Stores the user's password retrieved from the backend

  useEffect(() => {
    // Fetch the user's password from the backend
    axios
      .get("/api/user/password") // Replace with your actual API endpoint
      .then((response) => {
        setStoredPassword(response.data.password);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    // Perform necessary actions to update the password
    // You can make an API call or update the password in your state management

    // Reset the input fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMatch(true);
  };

  return (
    <>
      <TextField
        type="password"
        label="Current Password"
        value={currentPassword}
        onChange={handleCurrentPasswordChange}
        fullWidth
        margin="normal"
      />
      {currentPassword && (
        <>
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            margin="normal"
            error={!passwordMatch}
            helperText={!passwordMatch && "Passwords do not match"}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Change Password
          </Button>
        </>
      )}
    </>
  );
};

export default Password;

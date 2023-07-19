import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userInfoState } from "./Atom";

const AccountInfo = () => {
  const userInfo = useRecoilValue(userInfoState);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    grade: "",
  });

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
      setFormData(userInfo);
      setLoading(false);
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(user);
  };

  const handleSubmit = () => {
    // Perform API call to update user info
    axios
      .patch(`/api/users/${user.id}`, formData)
      .then((response) => {
        const updatedUser = response.data;
        setUser(updatedUser);
        setFormData(updatedUser);
        setEditing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && user !== undefined) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Account Information
      </Typography>
      {editing ? (
        <>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <br />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            margin="normal"
          />
          <br />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
          />
          <br />
          <TextField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            margin="normal"
          />
          <br />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1">Name: {user.name}</Typography>
          <Typography variant="body1">Username: {user.username}</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Typography variant="body1">Grade: {user.grade}</Typography>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </>
      )}
    </>
  );
};

export default AccountInfo;


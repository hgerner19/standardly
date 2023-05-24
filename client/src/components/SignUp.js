import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { NavLink,useHistory } from "react-router-dom";

const SignUp = () => {

    const [newUser, setNewUser] = useState({
        "name": "",
        "username": "",
        "email": "",
        "password": "",
        "grade": ""
        
    })

    const handleNewUserChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }
    const history = useHistory()
    const handleSubmitSignUp = (event) => {
        console.log(event)
        event.preventDefault()
        handleSignUp()
        
    }

    const handleSignUp = () => {
        fetch("/api/signup", {  
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          })
        .then((response) => response.json())
        .then((newUserData) => console.log(newUserData))
        .then(() => {history.push("/login");});
    }
    return(
        <>
            <div>
                <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
                sx={{ border: 'none' }}
                >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography variant="h5" align="left" style={{fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif']}} gutterBottom>
                            Welcome to Standardly!
                        </Typography>
                        <Typography variant="subtitle2" style={{fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif']}}>
                            Create an account or <NavLink to='/login' style={{ textDecoration: 'none', color:'#000EE'}}> log in </NavLink>
                        </Typography>
                        <form onSubmit={(event) => handleSubmitSignUp(event)}>

                            <TextField label="Name" id="standard-basic"  
                            variant="standard" type="text" 
                            fullWidth margin="normal" sx={{ mb: 2 }} name="name"
                            value={newUser.name} onChange={handleNewUserChange}/>

                            <TextField label="Username" id="standard-basic"  
                            variant="standard" type="text" 
                            fullWidth margin="normal" sx={{ mb: 2 }} name="username"
                            value={newUser.username} onChange={handleNewUserChange}/>

                            <TextField label="Email" id="standard-basic"  
                            variant="standard" type="email" 
                            fullWidth margin="normal" sx={{ mb: 2 }} name="email"
                            value={newUser.email} onChange={handleNewUserChange}/>

                            <TextField label="Password" id="standard-basic" 
                            variant="standard" type="password" 
                            fullWidth margin="normal" sx={{ mb: 2 }}  name="password"
                            value={newUser._password_hash} onChange={handleNewUserChange} />

                            <FormControl fullWidth margin="normal" 
                            style={{border: 'none'}} 
                            sx={{ mb: 2 }}
                            >
                                <InputLabel id="grade-label" sx={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}>
                                    Grade
                                </InputLabel>
                                <Select
                                labelId="grade-label"
                                id="grade"
                                value={newUser.grade}
                                name="grade"
                                onChange={handleNewUserChange}
                                sx={{ '& .MuiSelect-root': { border: 'none', 
                                                            fontFamily: 
                                                            ['-apple-system', 'BlinkMacSystemFont', 'sans-serif']} }}
                                >
                                    <MenuItem value="kindergarten">Kindergarten</MenuItem>
                                    <MenuItem value="1st">1st Grade</MenuItem>
                                    <MenuItem value="2nd">2nd Grade</MenuItem>
                                    <MenuItem value="3rd">3rd Grade</MenuItem>
                                    <MenuItem value="4th">4th Grade</MenuItem>
                                    <MenuItem value="5th">5th Grade</MenuItem>
                                    <MenuItem value="6th">6th Grade</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" 
                            style={{backgroundColor: "#FFBD80" , color: "black"}} fullWidth type="submit">
                                Sign Up
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default SignUp
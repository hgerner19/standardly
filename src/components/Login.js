import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button} from '@mui/material';
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userInfoState } from "./Atom";

const Login = () => {
    const [userLogin, setUserLogin] = useState({
        "username": "",
        "password": ""
    })
    const setLoginStatus = useSetRecoilState(isLoggedInState);
    const setUserInfo = useSetRecoilState(userInfoState);
  

    const history = useHistory();


    const handleUserLoginChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setUserLogin((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleLogin = (event) =>{
        event.preventDefault()
        if(userLogin.username && userLogin.password) {
            fetchUserLogin()
            console.log(userLogin)
            
            
        } 
        else{
            window.alert("Password invalid. Try again.")
        }
    }

    const fetchUserLogin = () => {
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userLogin),
        })
        .then((response) => response.json())
        .then((userData) => {
            setUserInfo(userData); // Update the userInfoState with the retrieved user information
            setLoginStatus(true);
            history.push("/");
          })
          .catch((error) => {
            console.error("Login error:", error);
          });
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
                    <Grid item xs={14} sm={8} md={6} lg={4}>
                        <Grid>
                        <Typography variant="h4" align="center" style={{fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif']}} gutterBottom>
                            Hello again!
                        </Typography>
                        <Typography variant="h6" align="center" style={{fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif']}} gutterBottom>
                            Welcome back to Standardly
                        </Typography>
                        </Grid>
                        <form onSubmit={(event) => handleLogin(event)}>
                        <TextField label="Username" id="standard-basic"  
                            variant="standard" type="text" 
                            fullWidth margin="normal" sx={{ mb: 2 }} name="username"
                            value={userLogin.username}
                            onChange={handleUserLoginChange}
                        />
                        <TextField label="Password" id="standard-basic" 
                            variant="standard" type="password"
                            value={userLogin.password} 
                            fullWidth margin="normal" sx={{ mb: 2 }}  name="password"
                            onChange={handleUserLoginChange}
                        />
                        <Button variant="contained" color="primary" 
                         style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                         backgroundColor: "#FFBD80" ,color: "black" }}  
                         fullWidth type="submit">
                            Login
                        </Button>
                        </form>
                        
                    </Grid>
                </Grid>
            </div>
        </>
    )
}
export default Login
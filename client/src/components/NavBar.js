import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import logoImage from "../images/standardly.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import axios from "axios";
import { useSetRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import { isLoggedInState, userInfoState } from "./Atom";

function NavBar({isLoggedIn}) {
  const setLoginStatus = useSetRecoilState(isLoggedInState);
  const userInfo = useRecoilValue(userInfoState);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.delete('/api/logout'); // Make a DELETE request to the server's logout endpoint
      setLoginStatus(false);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
      // Handle error if logout request fails
    }
  };

  return (
    <AppBar style={{ background: "#FFFFFF" }}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box>
          <Box display="flex" alignItems="center">
          <img src={logoImage} alt="Logo" style={{ width: "125px", height: "30px" }} />
            <Button>
              <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
                <HomeIcon
                  style={{
                    width: "35px",
                    height: "35px",
                    paddingLeft: "1.5em",
                    paddingRight: "1.5em",
                    color: "#FFBD80",
                  }}
                />
              </NavLink>
            </Button>
            </Box>
          </Box>

          <Box
            flexGrow={1}
            display="flex"
            justifyContent="right"
            alignItems="center"
          >
            <Button>
              <Typography
                variant="overline"
                noWrap
                paddingRight="1.5em"
                paddingLeft="1.5em"
              >
                <NavLink
                  to="/about"
                  style={{
                    color: "black",
                    fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                    textDecoration: "none",
                  }}
                  sx={{ mr: 8 }}
                >
                  Why Standardly?
                </NavLink>
              </Typography>
            </Button>

            <Button>
              <Typography
                variant="overline"
                noWrap
                paddingRight="1.5em"
                paddingLeft="1.5em"
              >
                <NavLink
                  to="/search"
                  style={{
                    color: "black",
                    fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                    textDecoration: "none",
                  }}
                  sx={{ mr: 10 }}
                >
                  Search
                </NavLink>
              </Typography>
            </Button>

            {isLoggedIn ? (
              <>
                <Button>
                  <Typography
                    variant="overline"
                    noWrap
                    paddingRight="1.5em"
                    paddingLeft="1.5em"
                  >
                    <NavLink
                      to="/myplans"
                      style={{
                        color: "black",
                        fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                        textDecoration: "none",
                      }}
                      sx={{ mr: 10 }}
                    >
                      My Plans
                    </NavLink>
                  </Typography>
                </Button>


                <Button onClick={handleMenuOpen}>
                    <AccountCircleIcon 
                    style={{width: "35px",
                            height: "35px",
                            color:"#FFBD80"}} 
                    />
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Hello, {userInfo?.name} </MenuItem>

                  <MenuItem>
                      <NavLink
                        to="/account"
                        style={{
                          color: "black",
                          fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                          textDecoration: "none",
                        }}
                      >
                        Account Settings
                      </NavLink>
                  </MenuItem>
                  <MenuItem>
                      <NavLink
                        to="/tracker"
                        style={{
                          color: "black",
                          fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                          textDecoration: "none",
                        }}
                      >
                        Tracker
                      </NavLink>
                  </MenuItem>

                  <MenuItem onClick={handleLogout}> Logout </MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" style={{ backgroundColor: "#FFBD80" }}>
                <NavLink
                  to="/signup"
                  style={{
                    color: "black",
                    fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                    textDecoration: "none",
                  }}
                  sx={{ mr: 10 }}
                >
                  Get Started
                </NavLink>
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;


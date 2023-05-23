import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

function NavBar({ isLoggedIn }) {
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
                <Button>
                  <Typography
                    variant="overline"
                    noWrap
                    paddingRight="1.5em"
                    paddingLeft="1.5em"
                  >
                    <NavLink
                      to="/lessonchecker"
                      style={{
                        color: "black",
                        fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                        textDecoration: "none",
                      }}
                      sx={{ mr: 10 }}
                    >
                      Lesson Checker
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
                      to="/myprofile"
                      style={{
                        color: "black",
                        fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                        textDecoration: "none",
                      }}
                      sx={{ mr: 10 }}
                    >
                      My Profile
                    </NavLink>
                  </Typography>
                </Button>
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


import {useEffect, useState} from "react"
import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NavLink } from "react-router-dom";
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
function NavBar(){
    return (
        <>
            <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar
                    style={{ background: '#FFBD80' }}
                    >
                        <Toolbar>
                            <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                            >
                            <Box>
                                <Button>
                                    <NavLink to="/" style={{ textDecoration: 'none', color: 'black' }}>
                                    <HomeIcon
                                    style={{
                                    width: '35px',
                                    height: '35px',
                                    paddingLeft: '1.5em',
                                    paddingRight: '1.5em',
                                    color: '#000000',
                                    }}
                                    />
                                    </NavLink>
                                </Button>
                                </Box>
                                <Box 
                                flexGrow={1}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                >
                                    <Button>
                                        <Typography variant="" noWrap paddingRight="1.5em" paddingLeft="1.5em">
                                        <NavLink
                                        to="/about"
                                        style={{
                                        color: 'black',
                                        fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                                        textDecoration: 'none',
                                        }}
                                        sx={{ mr: 10 }}
                                        >
                                            Why Standardly?
                                        </NavLink>
                                        </Typography>
                                    </Button>
                                <Button>
                                    <Typography variant="" noWrap paddingRight="1.5em" paddingLeft="1.5em">
                                    <NavLink
                                    to="/search"
                                    style={{
                                    color: 'black',
                                    fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                                    textDecoration: 'none',
                                    }}
                                    sx={{ mr: 10 }}
                                    >
                                        Search
                                    </NavLink>
                                    </Typography>
                                </Button>
                                <Button>
                                    <Typography variant="" noWrap paddingRight="1.5em" paddingLeft="1.5em">
                                    <NavLink
                                    to="/signup"
                                    style={{
                                    color: 'black',
                                    fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                                    textDecoration: 'none',
                                    }}
                                    sx={{ mr: 10 }}
                                    >
                                        Check plans
                                    </NavLink>
                                    </Typography>
                                </Button>
                            </Box>
                                <Button>
                                    <NavLink
                                    to="/search"
                                    
                                    style={{ textDecoration: 'none', color: 'black',}}
                                    sx={{ mr: 10 }}
                                    >
                                        <AccountCircleOutlinedIcon style={{ color: 'black',width: '35px',
                                    height: '35px', }} />
                                    </NavLink>
                                </Button>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
        </>
    )
}
export default NavBar
import {useEffect, useState} from "react"
import {
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
  } from "@mui/material";
import logoImage from "../images/standardly.png";

const Home = () => {
    return (
        <>
            <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "70vh" }}
            >
            <img
                src={logoImage}
                alt="Logo"
                style={{
                width: "700px",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "150px",
                }}
            />
            <Typography
                color="#FFBD80"
                variant="h3"
                style={{ fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"] }}
                gutterBottom
            >
                Teaching Made Easier
            </Typography>
            </Grid>
            
        </>

    )
}
export default Home
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
            display={"flex"}
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
            >
                <img
                    src={logoImage}
                    alt="Logo"
                    style={{
                    width: "600px",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "100px",
                    }}
                />
            </Grid>
        </>

    )
}
export default Home
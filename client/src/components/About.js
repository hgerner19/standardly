import {useEffect, useState} from "react"
import { Grid, Typography, TextField,Box} from '@mui/material';
const About = () => {
    return(
        <>
            <div>
                <Grid
                container
                justifyContent="left"
                alignItems="center"
                paddingLeft="10vh"
                style={{ minHeight: '100vh' }}
                sx={{ border: 'none' }}
                spacing={2}
                >
                    <Grid item xs={12} sm={6}>
                        <Typography
                        color="#FFBD80"
                        variant="h2"
                        align="left"
                        style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}
                        gutterBottom
                        >
                            Why Standardly?
                        </Typography>
                        <Box sx={{ width: '100%', height: 190, border: 'none' }}>
                            <Typography variant="body2" style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}>
                                With Standardly, education standards are just a click away, empowering educators to devote their energy to teaching
                                the curriculum instead of grappling with its complexities. By providing instant access to comprehensive education
                                standards, Standardly streamlines the instructional process, allowing teachers to focus on what truly matters:
                                delivering a high-quality education experience.
                            </Typography>
                        </Box>
                        <Typography
                        color="#FFBD80"
                        variant="h2"
                        align="left"
                        style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}
                        gutterBottom
                        >
                            Why Signup?
                        </Typography>
                        <Box sx={{ width: '100%', height: 200, border: 'none' }}>
                            <Typography variant="body2" style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}>
                                As a user, Standardly empowers you with comprehensive tools to enhance your teaching experience. Not only can you
                                effortlessly track your standards throughout the year, but you also have the flexibility to link your own resources
                                directly to specific standards. Whether it's a meticulously crafted lesson plan or a valuable YouTube video,
                                Standardly allows you to seamlessly integrate them into your curriculum.
                            </Typography>
                            
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                        component="img"
                        sx={{
                        height: '75%',
                        width: '75%',
                        objectFit:'',
                        }}
                        alt="The house from the offer."
                        src="https://www.cde.state.co.us/sites/default/files/pics/standardsandinstruction/Standards%20image.png"
                        />
                    </Grid>
                </Grid>
            </div>;
        </>
    )
}

export default About
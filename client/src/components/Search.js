import React, { useState } from "react";
import axios from "axios";
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

const Search = () => {
    const [searchField, setSearchField] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchFieldChange = (event) => {
      setSearchField(event.target.value);
    };

    const handleGradeChange = (event) => {
      setSelectedGrade(event.target.value);
    };

    const handleSubjectChange = (event) => {
      setSelectedSubject(event.target.value);
    };

    
    const handleReset = (event) => {
      event.preventDefault()
      setSearchField("");
      setSelectedGrade("");
      setSelectedSubject("");
      setIsSubmitted(false);
      setSearchResults([]);
    };

    const handleSearchSubmit = (event) => {
      event.preventDefault();
    
      axios
        .post("/api/search", {
          params: {
            search_field: searchField,
            grade: selectedGrade,
            subject: selectedSubject,
          },
        })
        .then((response) => {
          const { curriculum_matches, subcurriculum_matches } = response.data;
    
          const formattedCurriculumMatches = curriculum_matches.map((item) => ({
            subtopic_name: item.subtopic_description,
            curriculum_description: item.curriculum_description,
          }));
    
          const formattedSubcurriculumMatches = subcurriculum_matches.map((item) => ({
            subtopic_name: item.subtopic_name,
            curriculum_description: item.curriculum_description,
            subcurriculum_description: item.subcurriculum_description,
          }));
    
          setSearchResults([
            ...formattedCurriculumMatches,
            ...formattedSubcurriculumMatches,
          ]);
    
          setIsSubmitted(true);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    return (
      <>
        <Grid
          container
          display={"flex"}
          justifyContent="left"
          alignItems="center"
          marginTop={4.5}
          style={{ minHeight: "30vh" }}
          sx={{flexWrap: "nowrap"}}
        >
          <Typography
            color="#FFBD80"
            variant="h2"
            align="left"
            style={{ fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"] }}
            gutterBottom
          >
            Search
          </Typography>

          <Grid item display="flex" paddingLeft={15}>
            <form onSubmit={isSubmitted ? handleReset : handleSearchSubmit}>
              <TextField
                label="Search field"
                type="search"
                value={searchField}
                onChange={handleSearchFieldChange}
                sx={{ flexGrow: 3, marginRight: "10px" }}
              />

              <FormControl sx={{ minWidth: "200px", marginRight: "10px" }}>
                <InputLabel>Grade</InputLabel>

                <Select value={selectedGrade} onChange={handleGradeChange}>
                  <MenuItem value={"kindergarten"}>Kindergarten</MenuItem>
                  <MenuItem value={"firstgrade"}>1st Grade</MenuItem>
                  <MenuItem value={"secondgrade"}>2nd Grade</MenuItem>
                  <MenuItem value={"thirdgrade"}>3rd Grade</MenuItem>
                  <MenuItem value={"fourthgrade"}>4th Grade</MenuItem>
                  <MenuItem value={"fifthgrade"}>5th Grade</MenuItem>
                  <MenuItem value={"sixthgrade"}>6th Grade</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: "200px", marginRight: "10px" }}>
                <InputLabel>Subject</InputLabel>

                <Select value={selectedSubject} onChange={handleSubjectChange}>
                  <MenuItem value={"math"}>Math</MenuItem>
                  <MenuItem value={"literacy"}>Literacy</MenuItem>
                  <MenuItem value={"science"}>Science</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                style={{
                  fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                  backgroundColor: "#FFBD80",
                  color: "black",
                  width: "100px",
                  height: "50px"
                }}
              >
                {isSubmitted ? "Reset" : "Submit"}
              </Button>
            </form>
            
          </Grid>
        </Grid>
        {searchResults.length > 0 && (
          <Box mt={4} style={{ minHeight: "100vh" }} >
            <Typography color="black" variant="h4"
            style={{
              fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
              
              color: "#FFBD80",
            }}>
              Search Results:
            </Typography>
            {searchResults.map((result, index) => (
              <div key={index}>
                <Typography variant="subtitle1"
                style={{
                  fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                  color: "black",
                }}>
                  Subtopic Name: {result.subtopic_name}
                </Typography>
                <Typography variant="body1"style={{
                  fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                  color: "black",
                }}
                >
                  Curriculum Description: {result.curriculum_description}
                </Typography>
                <Typography variant="body1"
                style={{
                  fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
                  color: "black",
                }}>
                  Subcurriculum Description: {result.subcurriculum_description}
                </Typography>
              </div>
            ))}
          </Box>
        )}
      </>
    );
  };

export default Search;

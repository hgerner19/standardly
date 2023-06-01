import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
} from '@mui/material';

const Tracker = ({ userInfo }) => {
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const response = await axios.post('/api/tracker', { params: { grade: userInfo.grade } });

      if (response.status === 200) {
        const data = response.data;
        // Update subjects state with the received data
        setSubjects(data);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={12}
      style={{ minHeight: 'calc(100vh - 200px)', paddingBottom: '200px' }}
    >
      <Typography
        color="#FFBD80"
        variant="h2"
        alignItems={"left"}
        style={{ fontFamily: ["-apple-system", "BlinkMacSystemFont", "sans-serif"] }}
        gutterBottom
      >
        Teaching Made Easier
      </Typography>
      {Object.keys(subjects).map((subjectName) => (
        <Accordion key={subjectName} >
          <AccordionSummary  style={{ textAlign: 'center',backgroundColor:"#FFBD80" }}>
            <Typography style={{ textAlign: 'center' }}>{subjectName}</Typography>
          </AccordionSummary>
          <AccordionDetails  style={{ justifyContent: 'center' }}>
            {Object.keys(subjects[subjectName].topics).map((topicId) => (
              <Accordion key={topicId}>
                <AccordionSummary  style={{ justifyContent: 'center' }}>
                  <Typography>{subjects[subjectName].topics[topicId].description}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(subjects[subjectName].topics[topicId].subtopics).map((subtopicId) => (
                    <Accordion key={subtopicId}>
                      <AccordionSummary>
                        <Typography>{subjects[subjectName].topics[topicId].subtopics[subtopicId].description}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {Object.keys(subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems).map((curriculumItemId) => (
                            <ListItem key={curriculumItemId}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label={subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems[curriculumItemId].description}
                              />
                              {Object.keys(subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems[curriculumItemId].subcurriculumitems).length > 0 && (
                                <List>
                                  {Object.keys(subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems[curriculumItemId].subcurriculumitems).map((subcurriculumItemId) => (
                                    <ListItem key={subcurriculumItemId}>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label={subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems[curriculumItemId].subcurriculumitems[subcurriculumItemId].description}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Grid>
  );
}

export default Tracker;


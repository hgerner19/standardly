import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  FormControlLabel,
  Typography,
} from '@mui/material';

const MyPlans = ({ userInfo }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploadedResources, setUploadedResources] = useState([]);

  useEffect(() => {
    fetchStandards();
  }, []);

  useEffect(() => {
    console.log('Selected Items:', selectedItems);
  }, [selectedItems]);
  const fetchStandards = async () => {
    try {
      const response = await axios.post('/api/plans', { params: { grade: userInfo.grade } });

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

  const handleItemClick = (item) => {
    const itemId = item.id; // Access the ID property of the item object
    // Check if the item is already selected
    const isSelected = selectedItems.includes(itemId);
  
    if (isSelected) {
      // Item is already selected, remove it from the selected items
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((id) => id !== itemId));
    } else {
      // Item is not selected, add it to the selected items
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
    }
  };

  const openCloudinaryWidget = () => {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dfszptjw6',
          uploadPreset: 'standardly',
          sources: ['local', 'url', 'camera', 'image_search'],
          showAdvancedOptions: true,
          cropping: false,
          multiple: true,
          maxFiles: 10,
          resourceType: 'auto',
          maxFileSize: 10485760, // 10MB
          maxChunkSize: 1048576, // 1MB
          clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif', 'pdf']
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info:', result.info);
            handleResourceUpload(result.info.url);
          }
        }
      );
      widget.open();
  };

  const handleResourceUpload = async (resourceUrl) => {
    try {
      const formData = new FormData();
      formData.append('user_id', userInfo.id);
      formData.append('resource_url', resourceUrl);
      selectedItems.forEach((itemId) => {
        formData.append('curriculum_item_ids', itemId);
      });
  
      const response = await axios.post('/api/add_storage', formData);
  
      console.log('Uploaded resource:', resourceUrl);
      setUploadedResources((prevResources) => [...prevResources, resourceUrl]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="left"
      alignItems="center"
      marginTop={12}
      style={{ minHeight: 'calc(100vh - 200px)', paddingBottom: '200px' }}
    >
      <Typography
        color="#FFBD80"
        variant="h2"
        align="left"
        style={{ fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'] }}
        gutterBottom
      >
        My Plans
      </Typography>
      <Grid >
        <form>
          <FormControl sx={{ minWidth: '200px', marginRight: '10px' }}>
            {Object.keys(subjects).map((subjectName) => (
              <Accordion key={subjectName}>
                <AccordionSummary style={{ textAlign: 'center', backgroundColor: '#FFBD80' }}>
                  <Typography style={{ textAlign: 'center' }}>{subjectName}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ justifyContent: 'center' }}>
                  {Object.keys(subjects[subjectName].topics).map((topicId) => (
                    <Accordion key={topicId}>
                      <AccordionSummary style={{ justifyContent: 'center' }}>
                        <Typography>{subjects[subjectName].topics[topicId].description}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {Object.keys(subjects[subjectName].topics[topicId].subtopics).map((subtopicId) => (
                          <Accordion key={subtopicId}>
                            <AccordionSummary>
                              <Typography>
                                {subjects[subjectName].topics[topicId].subtopics[subtopicId].description}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List>
                                {Object.keys(
                                  subjects[subjectName].topics[topicId].subtopics[subtopicId].curriculumitems
                                ).map((curriculumItemId) => {
                                  const item = subjects[subjectName].topics[topicId].subtopics[subtopicId]
                                    .curriculumitems[curriculumItemId];
                                  return (
                                    <ListItem key={curriculumItemId}>
                                      <Button
                                        variant={
                                          selectedItems.includes(curriculumItemId) ? 'contained' : 'outlined'
                                        }
                                        onClick={() => handleItemClick(item)}
                                        style={{borderBlockColor:"#FFBD80"}}
                                      >
                                        {item.description}
                                      </Button>
                                      {Object.keys(item.subcurriculumitems).length > 0 && (
                                        <List>
                                          {Object.keys(item.subcurriculumitems).map((subcurriculumItemId) => {
                                            const subItem = item.subcurriculumitems[subcurriculumItemId];
                                            return (
                                              <ListItem key={subcurriculumItemId}>
                                                <Button
                                                  variant={
                                                    selectedItems.includes(subcurriculumItemId)
                                                      ? 'contained'
                                                      : 'outlined'
                                                  }
                                                  onClick={() => handleItemClick(subItem)}
                                                >
                                                  {subItem.description}
                                                </Button>
                                              </ListItem>
                                            );
                                          })}
                                        </List>
                                      )}
                                    </ListItem>
                                  );
                                })}
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
            <Button onClick={openCloudinaryWidget}>Upload Files</Button>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};

export default MyPlans;




  // const renderResource = (resourceUrl) => {
  //   if (resourceUrl.endsWith('.pdf')) {
  //     return (
  //       <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
  //         Download PDF
  //       </a>
  //     );
  //   } else if (resourceUrl.includes('youtube.com')) {
  //     return (
  //       <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
  //         Watch YouTube Video
  //       </a>
  //     );
  //   } else {
  //     return <span>Unsupported resource format</span>;
  //   }
  // };

 

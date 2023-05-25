import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  FormControl,
  Select
} from "@mui/material";
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userInfoState } from './Atom';

const MyPlans = () => {
  const userInfo = useRecoilValue(userInfoState);
  const [standards, setStandards] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [uploadedResources, setUploadedResources] = useState([]);

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const response = await axios.get('/api/standards', {
        params: { grade: userInfo.grade }
      });

      setStandards(response.data.standards);
    } catch (error) {
      console.error(error);
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

  const handleStandardClick = (standard) => {
    if (standard === selectedStandard) {
      setSelectedStandard(null);
    } else {
      setSelectedStandard(standard);
    }
  };

  const renderResource = (resourceUrl) => {
    if (resourceUrl.endsWith('.pdf')) {
      return (
        <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      );
    } else if (resourceUrl.includes('youtube.com')) {
      return (
        <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
          Watch YouTube Video
        </a>
      );
    } else {
      return <span>Unsupported resource format</span>;
    }
  };

  const handleResourceUpload = (resourceUrl) => {
    const saveResource = async () => {
      try {
        const response = await axios.post('/api/add_storage', {
          user_id: userInfo.id, // Modify this based on your data structure
          resource_url: resourceUrl,
          curriculum_item_ids: selectedStandard.curriculum_item_ids, // Modify this based on your data structure
          subcurriculum_item_ids: selectedStandard.subcurriculum_item_ids, // Modify this based on your data structure
        });
        console.log('Uploaded resource:', resourceUrl);
        setUploadedResources((prevResources) => [...prevResources, resourceUrl]);
      } catch (error) {
        console.error(error);
      }
    };
  
    saveResource();
  };

  return (
    <>
      <Grid
        container
        display="flex"
        justifyContent="left"
        alignItems="center"
        marginTop={4.5}
        style={{ minHeight: '30vh' }}
        sx={{ flexWrap: 'nowrap' }}
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
      </Grid>
      <Grid
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '10vh' }}
        sx={{ flexWrap: 'nowrap' }}
      >
        <Button onClick={openCloudinaryWidget}>Upload Files</Button>
      </Grid>
      <Grid container justifyContent="center" alignItems="center" marginTop={4}>
        <FormControl variant="standard" sx={{ minWidth: 200 }}>
          <Select
            value={selectedStandard}
            onChange={(event) => handleStandardClick(event.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Select Standard' }}
          >
            <MenuItem value="" disabled>
              Select Standard
            </MenuItem>
            {standards.map((standard) => (
              <MenuItem key={standard.curriculum_id} value={standard}>
                {standard.curriculum_description} - {standard.subtopic_description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {selectedStandard && (
        <Grid container justifyContent="center" marginTop={4}>
          <Accordion sx={{ width: '50%' }}>
            <AccordionSummary>Resources</AccordionSummary>
            <AccordionDetails>
              <ul>
                {uploadedResources.map((resourceUrl, index) => (
                  <li key={index}>{renderResource(resourceUrl)}</li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}
    </>
  );
};

export default MyPlans;

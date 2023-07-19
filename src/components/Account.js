import React from "react";
import { useHistory } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import { isLoggedInState, userInfoState } from "./Atom";

import AccountInfo from "./AccountInfo";
import Password from "./Password";

const Account = ({ userInfo }) => {
  const history = useHistory();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  
  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      // Perform API call to delete the user account
      axios.delete(`/api/users/${userInfo.id}`)
        .then(() => {
          // Clear user info and log out the user
          setIsLoggedIn(false);
          history.push("/"); // Redirect to the home page
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const [activeComponent, setActiveComponent] = React.useState('Account Info');

  const handleButtonClick = (componentName) => {
    if (componentName === 'Delete Account') {
      handleDeleteAccount();
    } else {
      setActiveComponent(componentName);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Account Info':
        return <AccountInfo userInfo={userInfo} />;
      case 'Password':
        return <Password userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          style={{ minHeight: '80vh' }}
          sx={{ border: 'none' }}
        >
          <Grid item xs={3}>
            <List>
              {['Account Info', 'Password', 'Delete Account'].map((text, index) => (
                <ListItem key={text}>
                  <ListItemButton onClick={() => handleButtonClick(text)}>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={9}>
            {renderComponent()}
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Account;

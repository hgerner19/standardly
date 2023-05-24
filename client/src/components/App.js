import React, { useState } from "react";
import { Switch, Route, NavLink, BrowserRouter as Router } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState,userInfoState  } from "./Atom";

import Home from "./Home.js";
import About from "./About.js";
import Search from "./Search.js";
import Account from "./Account.js";
import SignUp from "./SignUp.js";
import NavBar from "./NavBar.js";
import Login from "./Login.js";
import AccountInfo from "./AccountInfo";

function App() {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const userInfo = useRecoilValue(userInfoState);

  // Update the login status

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/account">
          <Account userInfo={userInfo}/>
        </Route>
        <Route exact path="/login">
          {!isLoggedIn && <Login />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

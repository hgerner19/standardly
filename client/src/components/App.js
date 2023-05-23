import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home.js";
import About from "./About.js";
import Search from "./Search.js";
import Account from "./Account.js";
import SignUp from "./SignUp.js";
import NavBar from "./NavBar.js";
import Login from "./Login.js";

function App() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    grade: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update the login status
  const handleLoginStatus = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />
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
          <Account />
        </Route>
        <Route exact path="/login">
          {!isLoggedIn && <Login handleLoginStatus={handleLoginStatus} />}
        </Route>
      </Switch>
    </>
  );
}

export default App;
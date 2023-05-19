import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home.js"
import About from "./About.js"
import Search from "./Search.js"
import Account from "./Account.js"
import SignUp from "./SignUp.js"
import NavBar from "./NavBar.js";

function App() {
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "username": "",
        "email": "",
        "grade": "",
    })
    return (
        <>
            <NavBar />
            <Switch>

                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="about">
                    <About/>
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
                
            </Switch>
        </>
    ) 
}

export default App;

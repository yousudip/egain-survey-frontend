import React from "react"
import {Route, Switch} from "react-router-dom"

import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Confirm from "./components/Confirm"
import Home from './Home'
import List from './List'

const Root = () => {
    //Defining routs to all react components
    return(
        <div>
            <Switch>
                <Route component={Home} exact path="/"/>
                <Route component={List} path="/list"/>
                <Route component={Login} path="/login"/>
                <Route component={SignUp} path="/register"/>
                <Route component={Confirm} path="/confirm"/>
            </Switch>
        </div>
    )
}

export default Root;
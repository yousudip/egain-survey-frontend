import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'
import Cookie from "js-cookie"

import UserPool from '../UserPool'


function Login() {

    const history = useHistory();

    //Go to Survey form component
    const gotoHome = () =>{
        history.push("/")
    }

    //Go to register component
    const gotoRegister = () =>{
        history.push("/register")
    }

    //Below states are used to indivisualy track every input fields 
    //while they are being modified
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //This state is used to show any error message on screen
    const [message, setMessage] = useState('');

    //All logic to authenticate user in cognito user pool and generate tokens
    //Using user provided credentials
    const onSubmit = event => {
        event.preventDefault();
        
        //Creating CognitoUser object
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails,{
            onSuccess: data => {
                console.log('onSuccess:', data.idToken.jwtToken);
                //Storing idtoken into local storage
                //TODO: Need to add encryption logic here
                Cookie.set("token", data.idToken.jwtToken);
                gotoHome();
            },
            onFailure: err => {
                console.log('onFailure:', err);
                setMessage(err.message);
            },
            newPasswordRequired: data =>{
                console.log('newPasswordRequired:', data);
            }
        })

    };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#"  onClick={gotoHome}>eGain Survey Administration</a>
        <ul className="navbar-nav ml-auto">
            <li>
            <a className="nav-link" href='#' onClick={gotoRegister}>Register</a>
            </li>
        </ul> 
    </nav>
    
        <form onSubmit={onSubmit}>
            <div style={{height:'200px', width:'230px', marginTop:'100px', marginBottom:'0px', marginLeft:'auto', marginRight:'auto'}}>
                <div className="form-group" style={{textAlign:'left'}}>
                    <label for="inputEmail">Email</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Email"value={email}
                    onChange={event => setEmail(event.target.value)}/>
                </div>

                <div className="form-group" style={{textAlign:'left'}}>
                    <label for="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Password"
                    value={password} onChange={event => setPassword(event.target.value)}/> 
                </div>

                <div className="form-group" style={{textAlign:'left'}}>
  <                 small style={{color:'red'}}>{message}</small>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" type='submit'>Login</button>
                </div>
                <div className="form-group">
                    Don't have an account? <a href='#' onClick={gotoRegister}>Register</a>
                </div>
            </div>
        </form>
    
    </div>
  );
}

export default Login;

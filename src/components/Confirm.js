import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'
import UserPool from '../UserPool'


function Confirm() {
    const history = useHistory();

    //Go to login screen
    const gotoLogin = () =>{
        history.push("/login")
    }

    //Below states are used to indivisualy track every input fields 
    //while they are being modified
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
  
    //All logic to confirm the user in cognito user pool using user provided credentials
    const onConfirm = event =>{
        event.preventDefault();
        //Creating CognitoUser object
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        //Confirming email id in cognito
        user.confirmRegistration(code, true, function(err, data){
            if(err){
                console.log("Confirmation error: ",err)
            }
            else{
                console.log("Confirmation success: ",data)
                //User varified. Now go to login screen
                gotoLogin();
            }
        });

    };

  return (
    <div className="App">

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">eGain Survey Administration</a>
            <ul class="navbar-nav ml-auto">
                <li>
                <a className="nav-link" href='#' onClick={gotoLogin}>Login</a>
                </li>
            </ul> 
        </nav>

        <form onSubmit={onConfirm}>
            <div style={{height:'200px', width:'200px', marginTop:'100px', marginBottom:'0px', marginLeft:'auto', marginRight:'auto'}}>
                <div className="form-group" style={{textAlign:'left'}}>
                    <label for="inputEmail">Email</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Email"value={email}
                    onChange={event => setEmail(event.target.value)}/>
                </div>

                <div className="form-group" style={{textAlign:'left'}}>
                    <label for="inputCode">Code</label>
                    <input type="text" className="form-control" id="inputCode" placeholder="Code"
                    value={code} onChange={event => setCode(event.target.value)}/> 
                </div>

                <div className="form-group" style={{textAlign:'left'}}>
                   <small style={{color:'green'}}>Enter the varification code sent to your emil.</small>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" type='submit'>Confirm</button>
                </div>
            </div>
        </form>
    </div>
  );
}

export default Confirm;

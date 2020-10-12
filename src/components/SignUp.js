import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserPool from '../UserPool'


function SignUp() {

    const history = useHistory();

    //Go to confirm screen to confirm code sent to email
    const gotoConfirm = () =>{
        history.push("/confirm")
    }

    //Go to Login screen
    const gotoLogin = () =>{
        history.push("/login")
    }

    //Below states are used to indivisualy track every input fields 
    //while they are being modified
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //This state is used to show any error message on screen
    const [message, setMessage] = useState('');

  
    //All logic to create an user in cognito user pool using user provided credentials
    const onSubmit = event => {
        event.preventDefault();

        UserPool.signUp(email, password, [], null, (err,data)=>{
        if(err){
            console.log("Error: ", err)
            setMessage(err.message);
        }
        else{
            console.log("Data: ", data)
            //User created. Now for to confirm user screen
            gotoConfirm();
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
                   <small style={{color:'green'}}>Password must contain lowercase, uppercase, special charecter, number and minimum 8 charecter !</small>
                </div>

                <div className="form-group" style={{textAlign:'left'}}>
  <                 small style={{color:'red'}}>{message}</small>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" type='submit'>Signup</button>
                </div>
                <div className="form-group">
                Already have an account? <a href='#' onClick={gotoLogin}>Login</a>
                </div>
            </div>
        </form>
        
            
    </div>
  );
}

export default SignUp;

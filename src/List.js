import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import rp from 'request-promise'
import axios from 'axios'
import Cookie from "js-cookie"
import jwt_decode from "jwt-decode";

function List() {
    const history = useHistory();
    
    //This state is used to show survey list and 
    //also as placeholder message while loading
    const [message, setMessage] = useState('Loading Surveys !');
    
    //Flag to stop recursive API calls
    const [fetched, setFetched] = useState(0);

    //Email variable to show logged in user
    var email =""

    //Go to Survey form component
    const gotoHome = () =>{
        history.push("/")
    }
    
    //Logout from active session
    const gotoLogout = () =>{
        Cookie.remove('token') //remove token
        //go to Login
        gotoLogin()
    }

    //Go to login screen
    const gotoLogin = () =>{
        history.push("/login")
    }

    //Go to register component
    const gotoRegister = () =>{
        history.push("/register")
    }

    //Check for locally stored token
    const token =  Cookie.get("token") ? Cookie.get("token") : null;
    if(token == null){
        //Token doesnt exist locally, go to Login
        gotoLogin()
    }
    else{
        console.log("Token: ",token)
        //decode token to check expiry
        var decoded = jwt_decode(token);
        console.log("Decoded: ", decoded)

        //Set email id
        //setEmail(decoded.email)
        email = decoded.email;

        if (Date.now() >= decoded.exp * 1000) {
            //Token is expired
            console.log("token expired !")
            Cookie.remove('token') //remove token
            //go to Login
            gotoLogin()
        }
    }

    //Fetch all survey data from API->Lambda function->DynamoDB
    const fetchData = async() =>{
        //URL for getSurvey API
         const url='https://m1op42umdg.execute-api.ap-south-1.amazonaws.com/dev/getSurveys';

        //Making API call using axios
        axios.get(url, 
            {headers:{
                Authorization: token
            }}
        )
        .then(response=>{
            //Setting flag to limit future calls
            setFetched(1)
            console.log("Response: ",response.data.body)
            if(response.data.body.result.length < 1){
                setMessage("No survey created yet!")
            }
            else{
                //Create table rows dynamically from fetched results
                var records = [];
                response.data.body.result.forEach(record => {
                    records.push(
                        <tr>
                            <th scope="row">{record.sid}</th>
                            <td>{record.sname}</td>
                            <td>{record.edate}</td>
                            <td>{record.surl}</td>
                            <td>{record.semail}</td>
                            <td>{record.accessibility}</td>
                            <td>{record.trigger}</td>
                            <td>{Date(parseInt(record.timestamp))}</td>
                        </tr>
                    )
                });

                setMessage(
                    <table className='table table-bordered table-striped mb-0'>
                        <thead>
                            <tr>
                                <th scope='col'>ID#</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Exp Date</th>
                                <th scope='col'>URL</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Accessability</th>
                                <th scope='col'>Trigger</th>
                                <th scope='col'>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records}
                        </tbody>
                    </table>
                )
            }
            
        })
        .catch(err=>{
            console.log("Error API call: ",err)
            //Setting flag to limit future calls
            setFetched(1)
        });
        
    }

    if(!fetched){
        fetchData();
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#" onClick={gotoHome}>eGain Survey Administration</a>
                <ul class="navbar-nav ml-auto">
                    <li>
                        <a className="nav-link" href='#'>{email}</a>
                    </li>
                    <li>
                        <a className="nav-link" href='#' onClick={gotoLogout}>Logout</a>
                    </li>
                </ul> 
            </nav>


            <div style={{margin:'80px'}}>
                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                    {message}
                </div>
                <div>Go back to creating Survey <a href="#" onClick={gotoHome}>here</a></div>
            </div>
        </div>
    )
}

export default List;
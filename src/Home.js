import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import rp from 'request-promise'
import axios from 'axios'
import Cookie from "js-cookie"
import jwt_decode from "jwt-decode";

function Home() {
    const history = useHistory();
    
    //This is to show any success or error message to the screen
    const [message, setMessage] = useState('');
    
    //Below states are used to indivisualy track every input fields 
    //while they are being modified 
    const [sname, setSname] = useState('');
    const [edate, setEdate] = useState('');
    const [surl, setSurl] = useState('');
    const [semail, setSemail] = useState('');
    const [cc, setCC] = useState(false);
    const [ac, setAC] = useState(false);
    const [accessibility, setAccessibility] = useState('');

    var email =""

    //Handle Case closure checkbox state on user input
    const handleCC = (event) => {
        if(event.target.checked){
            setCC(true);
        }
        else{
            setCC(false);
        }
    }

    //Handle Activity closure checkbox state on user input
    const handleAC = (event) => {
        if(event.target.checked){
            setAC(true);
        }
        else{
            setAC(false);
        }
    }

    //Go to Survey list components
    const gotoList = () =>{
        history.push("/list")
    }

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

        //Check if stored token is alreay expired 
        if (Date.now() >= decoded.exp * 1000) {
            //Token is expired
            console.log("token expired !")
            Cookie.remove('token') //remove token
            //go to Login
            gotoLogin()
        }
    }

    //Post survey data to API->Lambda function
    const postData  = async(event) => {
        event.preventDefault();

        //Create trigger value based on checked boxes
        var trigger = ''
        if(ac && cc){
            trigger = "Activity & Case closure "
        }
        else{
            if(ac){
                trigger = "Activity closure"
            }

            if(cc){
                trigger = "Case closure"
            }
        }

        //URL for postSurvey API
        const url='https://m1op42umdg.execute-api.ap-south-1.amazonaws.com/dev/postSurveys';
        //Creating request body to be posted to API->Lambda function
        const req_data = {
            "sname" : sname,
            "edate" : edate,
            "surl" : surl,
            "semail" : semail,
            "trigger" : trigger,
            "accessibility" : accessibility
        }

        axios.post(url, 
            req_data,
            {headers:{
                Authorization: token
            }}
        )
        .then(response=>{
            console.log("Response: ",response)
            setMessage(response.data.body.message)
        })
        .catch(err=>{
            console.log("Error API call: ",err)
        });
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
                <form onSubmit={postData}>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_name">Name</label>
                        </div>
                        <div className="form-group col-md-3 col-sm-5">
                            <input type="name" class="form-control" id="i_name" placeholder="Survey Name"
                             value={sname} onChange={event => setSname(event.target.value)}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_exp">Expiry Date</label>
                        </div>
                        <div className="form-group col-md-3 col-sm-5">
                            <input type="Date" class="form-control" id="i_exp" placeholder="Select Date"
                             value={edate} onChange={event => setEdate(event.target.value)}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_url">Survey URL</label>
                        </div>
                        <div className="form-group col-md-3 col-sm-5">
                            <input type="url" class="form-control" id="i_url" placeholder="Survey URL"
                             value={surl} onChange={event => setSurl(event.target.value)}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_frm_email">Email</label>
                        </div>
                        <div className="form-group col-md-3 col-sm-5">
                            <input type="email" class="form-control" id="i_frm_email" placeholder="Email"
                             value={semail} onChange={event => setSemail(event.target.value)}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_trigger">Survey Trigger</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="i_cc" onChange={handleCC} checked={cc}/>
                            <label className="form-check-label" for="i_cc">
                                Case closure
                            </label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input className="form-check-input" type="checkbox" id="i_ac" onChange={handleAC} checked={ac}/>
                            <label className="form-check-label" for="i_ac">
                                Activity closure
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5" style={{textAlign:'right'}}>
                            <label for="i_select">Survey Accessibility</label>
                        </div>
                        <div className="form-group col-md-3 col-sm-5">
                        <select class="custom-select mr-sm-2" id="i_select"
                             value={accessibility} onChange={event => setAccessibility(event.target.value)}>
                            <option selected>Select...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6" style={{textAlign:'right'}}>
                            <button className="btn btn-primary" type='submit'>Submit</button>
                        </div>
                        <div className="form-group col-md-6" style={{textAlign:'left'}}>
                            <button className="btn btn-primary" type='reset'>Cancel</button>
                        </div>
                    </div>
                </form>

                <div>{message}</div>
                <div>View list of surveys <a href="#" onClick={gotoList}>here</a></div>
            </div>
        </div>
    )
}

export default Home;
import 'bootswatch/dist/slate/bootstrap.min.css';
import React, { useState } from 'react';
import logo from '../logo.png';
import {Router, Route, Link} from 'react-router-dom';

export function RegisterPage(){
  const [validated] = useState(false);
  return (
    <form  noValidate={validated} >
      <div className = "logo">
        <p></p>
        <img src={logo} className="img-fluid" alt="logo" />
        <h1> Register Here </h1>
      </div>
      <fieldset>
        <div className="form-group">
          <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" style={{width:"40%",display: "inline-block"}}></input>
        </div>
        <div className="form-group">
          <input required type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Username"  style={{width:"40%",display: "inline-block"}}></input>
        </div>

        <div className="input-group"  style={{width:"40%",display: "inline-block"}}>

          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"  style={{width:"50%",display: "inline-block"}}></input>
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password"  style={{width:"50%",display: "inline-block"}}></input>
          <p></p>
        </div>
        <div className="container" style={{width:"40%"}}>
        <div className="row"  >
            <div className="col " >
              <Link className="btn btn-secondary " to="./login" >Go to Login</Link>
            </div>
            <div className="col"  >
              <button type="submit"  id="registration" className="btn btn-secondary ">Register</button>
            </div>
          </div>
        </div>
        </fieldset>
      </form>
    );
}

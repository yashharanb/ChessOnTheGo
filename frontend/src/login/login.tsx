import 'bootswatch/dist/slate/bootstrap.min.css';
import React, { useState } from 'react';
import logo from '../logo.png';
import {Router, Route, Link} from 'react-router-dom';
export function LoginPage(){

  const [validated] = useState(false);
  return (

    <form  noValidate={validated}>
      <div className = "logo">
        <p></p>
        <img src={logo} className="img-fluid" alt="logo" />
      </div>
      <fieldset>
        <div className="form-group">
          <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" style={{width:"40%",display: "inline-block"}}></input>
        </div>
        <div className="form-group">
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" style={{width:"40%",display: "inline-block"}}></input>
        </div>
        <div className="loginButton">
          <button type="submit" id="login" className="btn btn-secondary">Login</button>
          <p></p>
        </div>

        <Link className="btn btn-secondary" to="./registration">Create a new Accont</Link>

        </fieldset>
      </form>
    );
}

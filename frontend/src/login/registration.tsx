import 'bootswatch/dist/slate/bootstrap.min.css';
import React, { useState } from 'react';
import logo from './logo.png';
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
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">User Name</label>
          <input required type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Username"></input>
        </div>
  
        <div className="input-group">
        <label htmlFor="exampleInputPassword1">Password</label>

        <label htmlFor="exampleInputPassword1">Confirm Password</label>
        </div>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">*</span>
          </div>
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
          <div className="input-group-prepend">
            <span className="input-group-text">*</span>
          </div>
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password"></input>
        </div>
        <Link className="btn btn-link" to="./login">Login to Chess On The Go</Link>
        <button type="submit"  id="registration" className="btn btn-primary">Register</button>
        </fieldset>
      </form>
    );
}

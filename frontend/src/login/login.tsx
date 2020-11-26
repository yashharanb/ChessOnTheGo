import 'bootswatch/dist/slate/bootstrap.min.css';
import React, { useState } from 'react';
import logo from './logo.png';
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
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
        </div>
        <button type="submit" id="login" className="btn btn-primary">Login</button>
        <Link className="btn btn-link" to="./registration">Create a new Accont</Link>
        </fieldset>
      </form>
    );
}

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../../slices/landingPage";
import { Navigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { FilledInput, IconButton, InputAdornment, Button, TextField } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./landing-page.css";

const LandingPage = () => {

  const userInfo = {
    login: "",
    password: "",
    password2: "",
    showPassword: false,
    succesfulLogin: null,
    reenterError: false,
    successfulRegister: null,
    successMsg: null,
    errorMsg: null
  };

  const [user, setUser] = useState(userInfo);
  const [uiOption, setUIOption] = useState("login");

  const dispatch = useDispatch();

  const setUserLogin = function(e) {
    setUser({ ...user, login: e.target.value });
  }

  const setUserPwd = function(e) {
    setUser({ ...user, password: e.target.value });
  }

  const setUserPwd2 = function(e) {
    if(e.target.value != user.password) {
      setUser({ ...user, reenterError: true, password2: e.target.value})
    }
    else {
      setUser({ ...user, reenterError: false, password2: e.target.value}) 
    }
  }

  const handleClickShowPassword = () => {
    setUser({ ...user, showPassword: !user.showPassword });
  };

  const loginUser = () => {
    console.log(user)
    dispatch(login({login: user.login, password: user.password}))
    .unwrap()
    .then(data => {
      console.log(data, "page")

      sessionStorage.setItem('token', data.accessToken)
      setUser({ ...user, succesfulLogin: true})
    })
    .catch(e => {
      console.log(e)
      setUser({ ...user, succesfulLogin: false})
    })
  }

  const registerUser = () => {
    console.log(user)
    if (user.password == user.password2) {
      dispatch(register({login: user.login, password: user.password}))
      .unwrap()
      .then(data => {
        console.log(data)
        setUser({ ...user, successfulRegister: true, successMsg: "New User created! Login to access Cloud Sweep.",})
        setUIOption("login")
      })
      .catch(e => {
        console.log(e.response)
        setUser({ ...user, successfulRegister: false})
      })    
    }
  }

  const onRegisterClick = function() {
    setUIOption("register")
  }

  const onLoginClick = function() {
    setUIOption("login")
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className="gridMargin">
          What is CloudSweeper
          <br /><br /><br />
          Why do we need CloudSweeper
          <br /><br /><br />
          Any more information ?
        </div>

      </Grid>
      <Grid item xs={3}>
        <div className="gridMargin">

          <TextField id="user-email" value={user.login} placeholder="email@domain.com" onChange={setUserLogin} variant="outlined" className="user-login" size="small" /> <br />

          <FilledInput size="small" label="Password" className="user-login" required type={user.showPassword ? "text" : "password"} value={user.password} placeholder="******" onChange={setUserPwd} 
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                  {user.showPassword ? <VisibilityOff /> : <Visibility />} 
                </IconButton>
              </InputAdornment>
            }
          /> <br />

          {
            uiOption == "register" &&
            <div>
              <FilledInput size="small" label="Re-enter Password" className="user-login" required type={user.showPassword ? "text" : "password"} value={user.password2} placeholder="******" onChange={setUserPwd2} 
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                      {user.showPassword ? <VisibilityOff /> : <Visibility />} 
                    </IconButton>
                  </InputAdornment>
                }
              /> <br />  
            </div>        
          }
          {

            uiOption == "login" && 
            <div>
              <Button type="submit" variant="contained" onClick={loginUser}>Login</Button> <br />
              {user.succesfulLogin && <Navigate to='/home'  /> }
              {user.succesfulLogin === false && <div> User auth failed</div>}
              {user.successMsg && <div>{user.successMsg}</div>}
              <br />
            </div>
          }
          {

            uiOption == "register" && 
            <div>
              <Button type="submit" disabled={user.reenterError} variant="contained" onClick={registerUser}>Register</Button> <br />
              {user.reenterError && <div>Passwords do not match</div>}
              {user.successfulRegister && <div>New user created!</div> }
              {user.successfulRegister === false && <div>Failed to create new user</div>}
              {user.errorMsg && <div>{user.errorMsg}</div>}
              <br />
            </div>
          }          
          {
            uiOption == "login" && 
            <div>
              New User? <a className="pointer" onClick={(e) => onRegisterClick()}>Register</a>
            </div>
          }
          {
            uiOption == "register" && 
            <div>
              Already a user? <a className="pointer" onClick={(e) => onLoginClick()}>Login</a>
            </div>
          }          
        </div>
      </Grid>
    </Grid>
  );
};

export default LandingPage;

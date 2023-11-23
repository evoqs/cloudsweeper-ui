import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveUsers, login } from "../../slices/landingPage";
import { Navigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { ImageList, ImageListItem, FilledInput, IconButton, InputAdornment, Button, TextField } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./landing-page.css";

const LandingPage = () => {

  const userInfo = {
    login: "",
    password: "",
    password2: "",
    showPassword: false,
    currentOption: "login",
    succesfulLogin: null
  };
  const [user, setUser] = useState(userInfo);

  const dispatch = useDispatch();

  const setUserLogin = function(e) {
    setUser({ ...user, login: e.target.value });
  }

  const setUserPwd = function(e) {
    setUser({ ...user, password: e.target.value });
  }

  const handleClickShowPassword = () => {
    setUser({ ...user, showPassword: !user.showPassword });
  };

  const loginUser = () => {
    console.log(user)
    dispatch(login({login: user.login, password: user.password}))
    .unwrap()
    .then(data => {
      console.log(data)

      sessionStorage.setItem('token', data.accessToken)
      setUser({ ...user, succesfulLogin: true})
    })
    .catch(e => {
      console.log(e)
      setUser({ ...user, succesfulLogin: false})
    })
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
            <Button type="submit" variant="contained" onClick={loginUser}>Login</Button> <br />
            {user.succesfulLogin && <Navigate to='/home'  /> }
            {user.succesfulLogin == false && <div> User auth failed</div>}
          <br />
          New User? Register
        </div>
      </Grid>
    </Grid>
  );
};

export default LandingPage;

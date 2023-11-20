import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../slices/home";
import { Link } from "react-router-dom";
import Menu from "../Menu";
import "./home.css";

const Home = () => {
  const userProfileState = {
    username: "",
    name: ""
  }

  const users = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [profile, setUserProfile] = useState(userProfileState);

  const initFetch = useCallback(() => {
    dispatch(userProfile())
    .unwrap()
    .then(data => {
      setUserProfile({ ...profile, name: data.name, username: data.username})
    })
    .catch(e => {
      console.log(e)
    });
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])
  console.log(profile)
  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">
        
        {profile.name && profile.name} <br />
        {profile.username && profile.username}

      </div>
    </div>
  );
};

export default Home;

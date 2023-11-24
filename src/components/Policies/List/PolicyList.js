import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { userProfileDispatch, deletePolicyDispatch, retrievePoliciesDispatch } from "../../../utils/api-calls";
import 'react-js-cron/dist/styles.css'
import Menu from "../../Menu";
import "./policyList.css";
import { Button } from '@mui/material';

import { GrEdit, GrTrash } from "react-icons/gr";

const PolicyList = () => {
  const userProfileState = {
    username: "",
    name: ""
  } 
  const dispatch = useDispatch();
  const [profile, setUserProfile] = useState(userProfileState);
  const [policiesList, setPoliciesList] = useState([]);
  const [refreshPage, setRefreshPage] = useState(true);
  const reloadPage = function () {
    setRefreshPage(true)
  }

  if (refreshPage) {
    retrievePoliciesDispatch(dispatch, setPoliciesList)
    setRefreshPage(false)
  }


  const initFetch = useCallback(() => {
    userProfileDispatch(dispatch, setUserProfile, profile)
  }, [dispatch])


  useEffect(() => {
    initFetch()
  }, [initFetch])

  const editPipeline = function (policyID) {
    console.log('edit ', policyID)
  }

  const deletePipeline = function (policyID) {
    console.log('delete ', policyID)
    deletePolicyDispatch(dispatch, {id: policyID}, reloadPage)
  }

  const addPipeline = function() {
    console.log("In Add")
  }

  let policiesListEl = function() {
    if (policiesList.length === 0) {
      return(
        <div>
          No pipelines available
        </div>
      )
    } else {
      return policiesList.map((pl, index) => {
        return (
          <div key={index}>
            {pl.policyid} - {pl.policyname} 
          {/* <GrEdit className="pointer" onClick={() => editPipeline(pl.policyid)} /> */}
            {pl.policytype !== 'Default' && <GrTrash className="pointer" onClick={() => deletePipeline(pl.policyid)} /> }
          </div>
        )
      })

    }
  }

  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">

        <Button type="submit" variant="contained"><a href="/policies/create" className="create-pipeline-btn">Create Policy</a></Button><br /><br />
        {policiesListEl()}        
      </div>
    </div>
  );
};


export default PolicyList;

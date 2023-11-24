import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { userProfileDispatch, retrievePipelinesDispatch, deletePipelineDispatch } from "../../utils/api-calls";
import 'react-js-cron/dist/styles.css'
import Menu from "../Menu";
import "./pipeline.css";
import { Button } from '@mui/material';

import { GrEdit, GrTrash } from "react-icons/gr";

const Pipeline = () => {
  const userProfileState = {
    username: "",
    name: ""
  } 
  const dispatch = useDispatch();
  const [profile, setUserProfile] = useState(userProfileState);
  const [pipelinesList, setPipelinesList] = useState([]);
  const [refreshPage, setRefreshPage] = useState(true);
  const reloadPage = function () {
    setRefreshPage(true)
  }

  if (refreshPage) {
    retrievePipelinesDispatch(dispatch, setPipelinesList)
    setRefreshPage(false)
  }

  const initFetch = useCallback(() => {
    userProfileDispatch(dispatch, setUserProfile, profile)
  }, [dispatch])


  useEffect(() => {
    initFetch()
  }, [initFetch])

  const editPipeline = function (pipelineID) {
    console.log('edit ', pipelineID)
  }

  const delPipeline = function (pipelineID, defaultPL) {
    if (defaultPL) {
      alert("Default pipeline can not be deleted")
    } else {
      deletePipelineDispatch(dispatch, {id: pipelineID}, reloadPage)
      console.log('delete ', pipelineID)
    }
  }

  let pipelinesListEl = function() {
    if (pipelinesList.length === 0) {
      return(
        <div>
          No pipelines available
        </div>
      )
    } else {
      return pipelinesList.map((pl, index) => {
        return (
          <div key={index}>
            {pl.piplineid} - {pl.piplinename} 
            {!pl.default && <GrTrash className="pointer" onClick={() => delPipeline(pl.piplineid, pl.default)}  />}
            {/* pl.default && <GrTrash className='pointer' onClick={() => delPipeline(pl.piplineid, pl.default)} /> */}
            
          {/* <GrEdit className="pointer" onClick={() => editPipeline(pl.piplineid)} /> */}
            
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

        <Button type="submit" variant="contained"><a href="/pipelines/create" className="create-pipeline-btn">Create Pipeline</a></Button><br /><br />
        {pipelinesListEl()}        
      </div>
    </div>
  );
};


export default Pipeline;

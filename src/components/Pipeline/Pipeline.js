import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';

import Reports from "../Reports";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Paper, Typography } from '@mui/material';

import { useDispatch } from "react-redux";
import { userProfileDispatch, retrievePipelinesDispatch, deletePipelineDispatch, retrievePoliciesDispatch } from "../../utils/api-calls";
import 'react-js-cron/dist/styles.css'
import Menu from "../Menu";
import "./pipeline.css";
import { Button } from '@mui/material';

import { GrEdit, GrTrash, GrArticle } from "react-icons/gr";

const Pipeline = () => {
  const userProfileState = {
    username: "",
    name: ""
  } 

  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [profile, setUserProfile] = useState(userProfileState);
  const [pipelinesList, setPipelinesList] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);
  const [refreshPage, setRefreshPage] = useState(true);
  const [reportPL, setReportPL] = useState({})
  const [showReport, setShowReport] = useState(false)

  const handleClickOpen = (pl) => {
    if (open) {
      setOpen(false);
      setReportPL({})
    } else {
      setReportPL(pl)
      setOpen(true);
    }
  };

  const handleClose = (e) => {
    setOpen(false);
  };


  const reloadPage = function () {
    setRefreshPage(true)
  }

  if (refreshPage) {
    retrievePipelinesDispatch(dispatch, setPipelinesList)
    setRefreshPage(false)
  }

  const initFetch = useCallback(() => {
    userProfileDispatch(dispatch, setUserProfile, profile)
    retrievePoliciesDispatch(dispatch, setPoliciesList)
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

        let reportEl = null;
        if (pl.piplineid == reportPL.piplineid) {
          reportEl = (
            <Reports pipeline={reportPL} policies={policiesList} />
          )
        }

        return (
          <div key={index}>
            <div key={index} className={index % 2 == 0 ? 'even-line pipeline' : 'odd-line pipeline'}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  {pl.piplinename}
                </Grid>
                <Grid item xs={2}>
                  <GrArticle className="pointer" onClick={(e) => handleClickOpen(pl)} />
                  {!pl.default && <GrTrash className="pointer" onClick={() => delPipeline(pl.piplineid, pl.default)}  />}
                </Grid>
              </Grid>
              
            </div>
            {reportEl}
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

      <Dialog
        open={false}
        onClose={(e) => handleClose(e)}
        className="reports-container"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Reports"}
        </DialogTitle>
        <DialogContent>
          <Reports pipeline={reportPL} policies={policiesList} />
        </DialogContent>
      </Dialog>



    </div>
  );
};


export default Pipeline;

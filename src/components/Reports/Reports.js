import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { userProfileDispatch, deletePolicyDispatch, retrievePoliciesDispatch, retrieveReportsDispatch } from "../../utils/api-calls";
import 'react-js-cron/dist/styles.css'
import "./reports.css";
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import { GrEdit, GrTrash } from "react-icons/gr";

const Reports = (props) => {
  console.log(props)
  const dispatch = useDispatch();
  const [reports, setReports] = useState([])
  const [refreshPage, setRefreshPage] = useState(true);
  const reloadPage = function () {
    setRefreshPage(true)
  }

  const setPolicyReport = function(report) {
    setReports(report)
  }

  console.log(reports)

  if (refreshPage) {
    retrieveReportsDispatch(dispatch, props.pipeline.piplineid, setPolicyReport)  
    setRefreshPage(false)
  }
/*
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
            {pl.policytype !== 'Default' && <GrTrash className="pointer" onClick={() => deletePipeline(pl.policyid)} /> }
          </div>
        )
      })

    }
  }
*/

  const handleArray = function(report) {

  }

  const handleJSON = function(report) {

  }



  const getKeys = function(results) {
    let tempKeys = Object.keys(results)
    let resultKeys = []
    tempKeys.forEach((key) => {
      if(typeof(results[key]) == "string") {
        resultKeys.push(key)
      } else if(typeof(results[key] == "object")){
        if (results[key].length == undefined) {
          Object.keys(results[key]).forEach((nestedKey) => {
            resultKeys.push(key + "." + nestedKey)
          })
        } else {

        }
      }
    })
    return resultKeys   
  }

  const getPolicyInfo = function(policyID) {
    let policyInfo = props.policies.filter((policy) => {
      return policy.policyid == policyID;
    })
    if (policyInfo.length == 1) {
      return policyInfo[0].policyname
    }
  }

  const getPropByString = function(obj, propString) {
    if (!propString)
      return obj;

    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }


  let reportsEl = function () {
    if (reports.length === 0) {
      console.log("Empty reports")
      return (<div> No Reports Available </div>)
    } else {
      return (
        <div>
          {
            reports.map((report, index) => {
              return (
                <div key={index}>
                <div>
                  <strong>Resource:</strong> {report.resource}<br />
                  <strong>Last Run:</strong> {report.lastruntime}<br />
                  <strong>Status:</strong> {report.lastrunstatus}<br />
                  <strong>Policy:</strong> {getPolicyInfo(report.policyid)} <br />
                  {
                    report.resultlist.map((result, index2) => {

                      const keys = getKeys(JSON.parse(result.result)[0])
                      return (
                        <div key={index2}>
                          <div>
                            <br /><strong>Region:</strong> {result.region}<br />
                            {
                              JSON.parse(result.result).map((regionResult, index3) => {
                                return (
                                  <div key={index3}>
                                    {
                                      keys.map((key, index4) => {
                                        console.log(key, getPropByString(regionResult, key))
                                        let output = getPropByString(regionResult, key);
                                        if (typeof(output) != "string") {
                                          output = ""
                                        }
                                        return (
                                          <div key={index4}>
                                            {key} - {output}
                                          </div>
                                        )
                                      })
                                    }
                                    <hr />
                                  </div>
                                )
                              })
                            }
                          </div>
                          <hr />
                        </div>
                      )
                    })
                  }
                </div>
                <hr />
                </div>
              )
            })
          }
        </div>
      )
    }
  }


  

  let policiesListEl = null;

  return (
    <div className="list row">
      <div className="reports-container">
        {reportsEl()}
      </div>
    </div>
  );
};


export default Reports;

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { retrieveReportsDispatch } from "../../utils/api-calls";
import 'react-js-cron/dist/styles.css'
import "./reports.css";
import { Grid } from '@mui/material';

const Reports = (props) => {
  const dispatch = useDispatch();
  const [reports, setReports] = useState([])
  const [refreshPage, setRefreshPage] = useState(true);
  const [filterValues, setFilterValues] = useState({})

  const setPolicyReport = function(report) {
    setReports(report)
  }

  if (refreshPage) {
    retrieveReportsDispatch(dispatch, props.pipeline.piplineid, setPolicyReport, setFilterValues)
    setRefreshPage(false)
  }

  const getKeys = function(results) {
    let tempKeys = Object.keys(results)
    let resultKeys = []
    tempKeys.forEach((key) => {
      if(typeof(results[key]) === "string") {
        resultKeys.push(key)
      } else if(typeof(results[key] === "object")){
        if (results[key].length === undefined) {
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
      return policy.policyid === policyID;
    })
    if (policyInfo.length === 1) {
      return policyInfo[0].policyname
    }
  }

  const [filters, setFilterOptionValues] = useState({});
  const [filtersChanged, setFilterChanged] = useState((new Date()).toString());

  const handleFilterChange = (policyid, columnName, selectedValue) => {
    let curFilters = filters;
    if (!curFilters[policyid]) {
      curFilters[policyid] = {}
    }
    curFilters[policyid][columnName] = selectedValue
    setFilterOptionValues(curFilters);
    setFilterChanged((new Date()).toString())
  };


  let reportsEl = function () {
    if (reports.length === 0) {
      return (<div> No Reports Available </div>)
    } else {
      return (
        <div>
          {
            reports.map((report, index) => {
              let reportBody = []
              if (report.resultlist.length != 0) {
                let keys = ['Region'];
                keys.push(...report.displayDefinition.displayOrder)
                let tableData = report.results;

                let curFilters = filtersChanged && filters[report.policyid] ? filters[report.policyid] : {}
                Object.keys(curFilters).forEach((filter) => {
                  tableData = tableData.filter((row) => curFilters[filter] ? row[filter] === curFilters[filter] : true)
                })
                reportBody = tableData.map((result, index2) => {
                  let row = keys.map((key, index3) => {
                    let output = result[key]
                    return (
                      <td key={index3}>{output.toString()}</td>
                    )
                  })
                  return (
                    <tr key={index2}>
                      {row}
                    </tr>
                  )
                })
                return (
                  <div key={index}>
                    <div>
                      <strong>Resource:</strong> {report.resource}<br />
                      <strong>Last Run:</strong> {report.lastruntime}<br />
                      <strong>Status:</strong> {report.lastrunstatus}<br />
                      <strong>Policy:</strong> {getPolicyInfo(report.policyid)} <br /><br />
                      { reportBody.length != 0 && 
                        <div key={index}>
                          <div>
                            <table border="1">
                              <thead>
                                <tr>
                                  {keys.map((key, index3) => {
                                    let fvalue = filters[report.policyid] && filters[report.policyid][key] ? filters[report.policyid][key] : ''
                                    return (
                                      <th key={key} >
                                        {report.displayDefinition.displayName[key] ? report.displayDefinition.displayName[key] : key}
                                        <select className='filter-dropdown'
                                          onChange={(e) => handleFilterChange(report.policyid, key, e.target.value)}
                                          value={fvalue}
                                        >
                                          <option value="">All</option>
                                          {filterValues[report.policyid][key].map((value) => (
                                            <option key={value} value={value}>
                                              {value}
                                            </option>
                                          ))}
                                        </select>                                        
                                      </th>
                                    )
                                  })}
                                </tr>
                              </thead>
                              <tbody>
                                {reportBody}
                              </tbody>
                            </table>
                            <hr />
                          </div>
                        </div>
                      }
                      { reportBody.length === 0 && <div>No reports available</div>}
                    </div>
                  </div>                      
                )
              }
            })
          }
          <hr />
        </div>
      )
    }  
  }

  return (
    <div className="list row">
      <div className="reports-container">
        {reportsEl()}
      </div>
    </div>
  );
};


export default Reports;

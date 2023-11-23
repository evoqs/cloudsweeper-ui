import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrievePipelines, retrievePolicyStructure } from "../../slices/pipelines"
import { retrieveAccountsDispatch, userProfileDispatch, retrievePoliciesDispatch, addPipelineDispatch } from "../../utils/api-calls";
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
import Menu from "../Menu";
import "./pipelineSetup.css";
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { GrEdit, GrTrash, GrAdd, GrFormClose } from "react-icons/gr";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = ['Pipeline info', 'Select Filters', 'Schedule', 'Summary'];

const PipelineSetup = () => {
  const dispatch = useDispatch();

  const [screen1Info, setScreen1Info] = useState({plName: '', account: '', regions: [], accountName: ''})
  const [screen2Info, setScreen2Info] = useState({policies: [], policyNames: []})
  const [timerValue, setValue] = useState('30 5 * * *')

  const [allAccountsList, setAccountsList] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const initFetch = useCallback(() => {
    retrieveAccountsDispatch(dispatch, setAccountsList)
    retrievePoliciesDispatch(dispatch, setPoliciesList)
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleScreen1Change = (e) => {
    let accid = e.target.value;
    let accountinfo = allAccountsList.find((acc) => { return acc.cloudaccountid == accid})
    setScreen1Info({...screen1Info, account: e.target.value, accountName: accountinfo.description})
  }
  const updateRegions = (e) => {
    let regions = screen1Info.regions;
    if (regions.indexOf(e.target.value) == -1) {
      regions.push(e.target.value)
    } else {
      regions.splice(regions.indexOf(e.target.value), 1);
    }
    setScreen1Info({...screen1Info, regions: regions})
  }

  const updateSelectedPolicies = (e, policy) => {
    let policies = screen2Info.policies;
    let policyNames = screen2Info.policyNames;
    if(policies.indexOf(policy.policyid) == -1) {
      policies.push(policy.policyid)
      policyNames.push(policy.policyname)
    } else {
      policies.splice(policies.indexOf(policy.policyid), 1);
      policyNames.splice(policyNames.indexOf(policy.policyname), 1)      
    }
    setScreen2Info({...screen2Info, policies: policies, policyNames: policyNames})
  }

  const handlePlNameChange = (e) => {
    setScreen1Info({...screen1Info, plName: e.target.value})
  }

  const redirectPage = function() {
    alert("Pipeline Created");
  }

  const handleNext = () => {
    let flag = true
    if (activeStep == 0) {
      if (screen1Info.plName == '' || screen1Info.account == '' || screen1Info.regions.length == 0) {
        alert("Enter all fields")
        flag = false;
      }
    }
    if (activeStep == 1) {
      if (screen2Info.policies.length == 0) {
        alert("Enter all fields")
        flag = false;
      }
    }

    if(activeStep == 3) {
      addPipelineDispatch(dispatch, screen1Info.account, screen1Info.plName, screen2Info.policies, timerValue, screen1Info.regions, true, redirectPage)
    }

    if (flag) {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setScreen1Info({plName: '', regions: [], account: '', accountName: ''})
    setScreen2Info({policies: []})
    setValue("30 5 * * *")
    setActiveStep(0);

  };

  const editPipeline = function (pipelineID) {
    console.log('edit ', pipelineID)
  }

  let screen1 = function(step) {
    // TODO: Fetch from API
    const regions = ['us-east', 'us-west', 'eu-lon']
    return (
      step == 0 && 
      <div> <br /><br />
        <TextField placeholder="Pipeline name" value={screen1Info.plName} onChange={(e) => handlePlNameChange(e)} id="pipeline-name" label="Pipeline Name" variant="outlined" className="text-field" size="small" /> 
        <br /><br />
        <FormControl>
          <Select
            id='select-account'
            className='radio-field'
            value={screen1Info.accountName}
            onChange={(e) => handleScreen1Change(e)}
            renderValue={(selectedAccount) => selectedAccount}
          >
          <MenuItem value="" disabled>Select an option</MenuItem>
          {
            allAccountsList.map((account, index) => {
              return(
                <MenuItem key={index} value={account.cloudaccountid} name={account.cloudaccountid}>{account.description}</MenuItem>
              )
            })
          }
          </Select>
        </FormControl>

        <br /><br />

        {/* TODO: Add option to select all */}
        <FormControl size="small" component="fieldset">
          <InputLabel id='region-name'>Region</InputLabel>
          <Select
            labelId="select-region"
            id="select-region"
            label="Region"
            value={screen1Info.regions.join(', ')}
            className='radio-field'
            renderValue={(selectedRegion) => selectedRegion}
          >
          {
            regions.map((region, index) => {
              return (
                <MenuItem key={index}>
                  <FormControlLabel value={region} control={<Checkbox onChange={(e) => updateRegions(e)} checked={screen1Info.regions.includes(region)} />} label={region} />
                </MenuItem>
              )
            })
          }
          </Select>
        </FormControl>
      </div>

    )
  }

  let screen2 = function(step) {
    return (
      step == 1 && 
      <div>
        <br />
        <strong>Select policies</strong>
        <br /><br />
        <FormControl size="small" component="fieldset">
          <InputLabel id='select-policies'>Policies</InputLabel>
          <Select
            labelId="select-policies"
            id="select-policies"
            label="Policies"
            value={screen2Info.policyNames.join(', ')}
            className='radio-field'
            renderValue={(selectedPolicy) => selectedPolicy}
          >
          {
            policiesList.map((policy, index) => {
              return (
                <MenuItem key={index}>
                  <FormControlLabel value={policy.policyid} control={<Checkbox onChange={(e) => updateSelectedPolicies(e, policy)} checked={screen2Info.policies.includes(policy.policyid)} />} label={policy.policyname} />
                </MenuItem>
              )
            })
          }
          </Select>
        </FormControl>        
      </div>

    )
  }

  let screen3 = function(step) {
    return (step == 2 && 
      <div>
        <Typography sx={{ mt: 2, mb: 1 }}>Step 3</Typography>
        <Cron value={timerValue} setValue={setValue}  /> <br />
        {timerValue}

      </div>
    )
  }

  let screen4 = function(step) {
    return (step == 3 && 
      <div>
        <Typography sx={{ mt: 2, mb: 1 }}>Step 4</Typography>
        Overview - summary
        <br /><br />
        <strong>Pipeline name: </strong>{screen1Info.plName}<br /><br />
        <strong>Account: </strong>{screen1Info.accountName} <br /><br />
        <strong>Regions: </strong>{screen1Info.regions.join(", ")} <br /><br />

        <strong>Policies: </strong>  {screen2Info.policyNames.join(", ")}<br /><br />

        Timer Details: {timerValue} <br /><br />
        <Cron value={timerValue} setValue={setValue} disabled={true} allowClear={false} />
      </div>
    )
  }

  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">

        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Create Another Pipeline</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {screen1(activeStep)}
              {screen2(activeStep)}
              {screen3(activeStep)}
              {screen4(activeStep)}

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>    
      </div>
    </div>
  );
};


export default PipelineSetup;

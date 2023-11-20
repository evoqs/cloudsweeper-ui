import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrievePipelines, retrievePolicyStructure } from "../../slices/pipelines"
import { retrieveAccountsDispatch, userProfileDispatch } from "../../utils/api-calls";
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
  // accountid, cloudAccID, pipelineName, policies, schedule, enabled
  const dispatch = useDispatch();

  const [screen1Info, setScreen1Info] = useState({plName: '', account: '', regions: []})
  const [timerValue, setValue] = useState('30 5 * * *')
  const [filterValues, setFilterValues] = useState({s3: [{filter: 'name', name: 'xyz', dummyKey: 'dummy-hi'}, {filter: 'createdBy', user: 'Monisha'}]})
  // const [filterValues, setFilterValues] = useState({})

  const [allAccountsList, setAccountsList] = useState([]);
  const [filterSchema, setFilterSchema] = useState({});

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());



  const [selectedResource, setSelectedResource] = useState('s3');
  
  
  const [filtersToAdd, setFiltersToAdd] = useState({filters: {}})
  const [currentSelectedFilter, setCurrentSelectedFilter] = useState({filterName: "", filterSettings: {}})

  const initFetch = useCallback(() => {
    dispatch(retrievePolicyStructure())
    .unwrap()
    .then(data => {
      setFilterSchema(data)
    })
    .catch(e => {
      console.log(e)
    })
    retrieveAccountsDispatch(dispatch, setAccountsList)
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const dropDown = function (options, selectedValue, onChangeHandler, resourceName, index=-1, resource='', disabled=false, key='') {
    return (
      <span key={resourceName}>
        <FormControl size="small" className='resource-type'>
          <InputLabel id='resource-name'>{resourceName}</InputLabel>
          <Select disabled={disabled} key={resourceName} labelId={resourceName} value={selectedValue} label={resourceName} onChange={(e) => onChangeHandler(e, index, resource, key)}>
            {options && options.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>{item}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </span>
    )
  }

  const textField = function(value, onChangeHandler, name, index, resource, filterIndex) {
    return (
      <TextField required value={value} key={index}
        onChange={(e) => onChangeHandler(e, value, name, filterIndex, resource)} id={name}
        label={name} variant="outlined" 
        className="filter-txt" size="small" 
      />
    )
  }

  const onResourceChange = function() {

  }

  const deleteFilterOption = function(resource, filter, index) {
    let newFilterValues = []
    newFilterValues = filterValues[resource]
    newFilterValues.splice(index, 1);
    console.log(newFilterValues)
    setFilterValues({...filterValues, [resource]: newFilterValues})
  }

  const onFilterAdd = function(resource) {
    let resourceFilters = filterValues[resource]
    resourceFilters.push({filter: ''})
    console.log(resourceFilters)
    setFilterValues({...filterValues, [resource]: resourceFilters})
  }

  const onFilterChange = function(e, index, resource) {
    let filterList = getFilterKeys(resource, e.target.value);
    let newFilterValues = filterValues[resource]
    newFilterValues[index].filter = e.target.value
    filterList.forEach((fl) => {
      newFilterValues[index][fl] = ''
    });
    setFilterValues({...filterValues, [resource]: newFilterValues})
  }

  const getFilterKeys = function (resource, filter) {
    return filterSchema[resource].filterDetails[filter].filterList
  }

  const onFilterValueChange = function(e, oldValue, name, index, resource) {
    let newFilterValues = filterValues[resource]
    newFilterValues[index][name] = e.target.value
    setFilterValues({...filterValues, [resource]: newFilterValues})
    validateFilterValues();
  }

  const getIntegerKeys = function() {
    let integerKeys = []
    let resources = Object.keys(filterSchema);
    console.log(resources);
    resources.forEach((resource) => {
      filterSchema[resource].filterOptions.forEach((option) => {
        console.log(resource, option)
        console.log()
        filterSchema[resource].filterDetails[option].filterList.forEach((filter) => {
          let filterInfo = filterSchema[resource].filterDetails[option].filterInfo[filter]
          if (filterInfo.type == 'int') {
            let key = resource + '-' + option + '-' + filter
            if (filterInfo.validations) {
              integerKeys.push({key: key, validations: filterInfo.validations})
            }
          }
        })
      })
    })
    return integerKeys
  }

  const validateFilterValues = function() {
    console.log("validateFilterValues")
    // let integerKeys = getIntegerKeys()
    // console.log(integerKeys)

  }

  const deleteResource = function(resource) {
    let newFilterValues = filterValues[resource];
    delete newFilterValues[resource]
    console.log(filterValues)
    setFilterValues({filterValues: newFilterValues})
  }

  const onDropDownValueChange = function(e, index, resource, key) {
    console.log(e.target.value, index, resource, key)
    let newFilterValues = filterValues[resource];
    console.log(newFilterValues)
    newFilterValues[index][key] = e.target.value
    setFilterValues({...filterValues, [resource]: newFilterValues})

  }
  const renderFilters = function() {
    return Object.keys(filterValues).map((resource, index) => {
      let filterElements = filterValues[resource].map((filterValue, index2) => {
        let filterOptionsList = []
        if (filterValue.filter != '')
          filterOptionsList = filterSchema[resource] && filterSchema[resource].filterDetails[filterValue.filter].filterList 
        let optionsElement = []
        filterOptionsList && filterOptionsList.forEach((option, index3) => {
          if(option != '') {
            let metadata = getFilterMetadata(resource, filterValue.filter, option)
            if(metadata && metadata.type === 'dropdown') {
              optionsElement.push(
                dropDown(metadata.options, filterValue[option] , onDropDownValueChange, metadata.displayName, index2, resource, false, option)
              )
            }
            if(metadata && metadata.type === 'freetext') {
              optionsElement.push(
                textField(filterValue[option], onFilterValueChange, option, index3, resource, index2)
              )
            } else if(metadata && metadata.type === 'int') {
              optionsElement.push(
                textField(filterValue[option], onFilterValueChange, option, index3, resource, index2)
              )            
            }
          }
        })
        if (filterSchema[resource] && filterSchema[resource].filterOptions) {
          return (
            <div key={index2}>
              <GrFormClose className="pointer margin-6 " onClick={(e) => deleteFilterOption(resource, filterValue.filter, index2)} />
              {dropDown(filterSchema[resource].filterOptions, filterValue.filter, onFilterChange, 'Filter', index2, resource)}
              {optionsElement}
            </div>
          )
        }
      })

      return(
        <div key={index}>
          <GrFormClose className="pointer margin-6 " onClick={(e) => deleteResource(resource)} />
          {dropDown(Object.keys(filterSchema), resource, onResourceChange, 'Resource', '', '', true)} 
          <GrAdd className="pointer margin-6" onClick={() => onFilterAdd(resource)} /><br />
          <br />
          {filterElements}
          <br /><br />
          
        </div>

      )
    })
  }

  const getFilterMetadata = function(resource, filterName, filterKey, flag=false) {
    if (filterSchema[resource] && filterSchema[resource].filterOptions.indexOf(filterName) != -1) {
      let filterDetails = filterSchema[resource].filterDetails[filterName];
      return filterDetails.filterInfo[filterKey]
    }
  }

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleScreen1Change = (e, key) => {
    setScreen1Info({...screen1Info, [key]: e.target.value})
  }
  const updateRegions = (e) => {
    console.log('here..')
    console.log(e.target.value)

    let regions = screen1Info.regions;
    console.log(regions)
    if (regions.indexOf(e.target.value) == -1) {
      regions.push(e.target.value)
      setScreen1Info({...screen1Info, regions: regions})
    }

  }
  const handlePlNameChange = (e) => {
    setScreen1Info({...screen1Info, plName: e.target.value})
  }

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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

  const handleChange = (e) => {
    setSelectedResource(e.target.value)
  }

  const addFilters = (e) => {
    console.log(e.target.value)
    console.log(selectedResource)
    let newFilterValues = []
    if (filterValues[selectedResource]) {
      alert('Filter already available. edit it')
    } else {
      setFilterValues({...filterValues, [selectedResource]: [{filter: ''}]})
    }
  }

  const handleReset = () => {
    setActiveStep(0);
  };

  const resources = ['s3', 'ec2']

  let currentFilter = []

  const editPipeline = function (pipelineID) {
    console.log('edit ', pipelineID)
  }

  const deletePipeline = function (pipelineID) {
    console.log('delete ', pipelineID)
  }

  const getFilters = function(filters, index, filter) {
    const currentFilters = filters[index][filter];
    let element = currentFilters.map((filter, index2) => {
      return (
        <div key={index2}>
          {filter.name}
          {filter.filters.map((filValues, index3) => {
            return (
              <div key={index3}>
                {filValues.name}: {filValues.value} {filValues.prop}
              </div>
            )
          })}
          <br />
        </div>
      )
    })

    return element
  }

  let screen1 = function(step) {
    // TODO: Fetch from API
    const regions = ['us-east', 'us-west', 'eu-lon']
    return (
      step == 0 && 
      <div> <br /><br />
        <TextField placeholder="Pipeline name" value={screen1Info.plName} onChange={(e) => handlePlNameChange(e)} id="pipeline-name" label="Pipeline Name" variant="outlined" className="text-field" size="small" /> 
        <br /><br />

        <select
          className='radio-field'
          label="Account"
          value={screen1Info.account}
          onChange={(event) => handleScreen1Change(event, 'account')}
        >
          <option value="" disabled>
            Account
          </option>
          {allAccountsList.map((option, index) => (
            <option key={index} value={option.description}>
              {option.description}
            </option>
          ))}
        </select>        
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
        <Typography sx={{ mt: 2, mb: 1 }}>Step 2</Typography>
        <FormControl size="small" className='resource-type'>
          <InputLabel id='resource-name'>Resource</InputLabel>
          <Select labelId='select-resource' value={selectedResource} label='Resource' onChange={handleChange}>
            {resources.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>{item}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <GrAdd className="pointer margin-6" onClick={(e) => addFilters(e)} /><br />
        <br /><br /><br />

        {renderFilters()}

        <br /><br /><br />
        {
          currentFilter.length > 0 && 
          currentFilter.map((resourceFilter, index) => {
            return (
              <div key={index}>
                {resourceFilter.resource}
                {
                  resourceFilter.filters.map((filters, index2) => {
                    return (
                      <div key={index2}>
                        {
                          Object.keys(filters).map((filter, index3) => {
                            return getFilters(resourceFilter.filters, index2, filter)
                          })
                        }
                        
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
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
        <br />
        {screen1Info.plName}<br />
        {screen1Info.account} <br />
        {screen1Info.region} <br />
        Timer Details: {timerValue} <br />
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
                <Button onClick={handleReset}>Reset</Button>
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

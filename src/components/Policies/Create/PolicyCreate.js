import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrievePipelines, retrievePolicyStructure } from "../../../slices/pipelines"
import { retrieveAccountsDispatch, userProfileDispatch } from "../../../utils/api-calls";
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
import Menu from "../../Menu";
import "./policyCreate.css";
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { GrEdit, GrTrash, GrAdd, GrFormClose } from "react-icons/gr";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = ['Pipeline info', 'Select Filters', 'Schedule', 'Summary'];

const PolicyCreate = () => {
  
  const dispatch = useDispatch();

  const [filterValues, setFilterValues] = useState({s3: [{filter: 'name', name: 'xyz', dummyKey: 'dummy-hi'}, {filter: 'createdBy', user: 'Monisha'}]})
  const [filterOps, setFilterOps] = useState(['And', 'Or'])
  // const [filterValues, setFilterValues] = useState({})

  const [filterSchema, setFilterSchema] = useState({});


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

    let newFilterOps = []
    newFilterOps = filterOps
    newFilterOps.splice(index, 1);


    console.log(newFilterValues)
    setFilterOps(newFilterOps)
    setFilterValues({...filterValues, [resource]: newFilterValues})
  }

  const onFilterAdd = function(resource) {
    let resourceFilters = filterValues[resource]
    resourceFilters.push({filter: ''})
    let newFilterOps = filterOps;
    newFilterOps.push('And')
    setFilterOps(newFilterOps)
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

  const [selectedOption, setSelectedOption] = useState('And');

  const handleOptionChange = (e, index) => {

    setSelectedOption(e.target.value);
    let newFilterOps = filterOps
    filterOps[index] = e.target.value
    setFilterOps(newFilterOps)
  };

  const validateFilterValues = function() {
    console.log("validateFilterValues")
    // let integerKeys = getIntegerKeys()
    // console.log(integerKeys)

  }

  console.log(filterOps)

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
              <label className='pointer'><input type="radio" value="And" checked={filterOps[index2] === 'And'} onChange={(e) => handleOptionChange(e, index2)} /> And </label>
              <label className='pointer'><input type="radio" value="Or" checked={filterOps[index2] === 'Or'} onChange={(e) => handleOptionChange(e, index2)} /> Or </label>
            </div>
          )
        }
      })

      return(
        <div key={index}>
          Select filters for {resource}
          <GrAdd className="pointer" onClick={() => onFilterAdd(resource)} /><br />
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

  const submitPolicy = function() {
    console.log(filterValues['s3'])
    console.log(filterOps)
    let policies = []
    let response = []

    if(filterOps.indexOf('Or') == -1) {
      
      filterValues.s3.forEach((filter) => {
        let filterParams = {}
        
        console.log(filter)
        Object.keys(filter).forEach((fkey) => {
          console.log(fkey, filter[fkey])
          if (fkey != 'filter') {
            filterParams[fkey] = filter[fkey]
          }
        })
        policies.push(filterParams)
      })
      response = [{'and': policies}]
    } else {






      filterValues.s3.forEach((filter) => {
        let filterParams = {}
        console.log(filter)
        Object.keys(filter).forEach((fkey) => {
          console.log(fkey, filter[fkey])
          if (fkey != 'filter') {
            filterParams[fkey] = filter[fkey]
          }          
        })   
        policies.push(filterParams)     
      })      
    }
    console.log(policies)
    console.log(response)
  }

  const handleChange = (e) => {
    setSelectedResource(e.target.value)
  }

  const resources = ['s3', 'ec2']

  let currentFilter = []


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

  let screen2 = function() {
    return (
      <div>
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

  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">
        {screen2()}   
        <Button type="submit" variant="contained" onClick={submitPolicy}>Submit</Button> <br />
      </div>
    </div>
  );
};


export default PolicyCreate;

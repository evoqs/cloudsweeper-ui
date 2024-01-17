import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrievePolicyStructure } from "../../../slices/pipelines"
import { addPolicy } from "../../../slices/policies";
import { retrieveAccountsDispatch, userProfileDispatch } from "../../../utils/api-calls";
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
import Menu from "../../Menu";
import "./policyCreate.css";
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Radio, RadioGroup, FormControlLabel, FormLabel, FormGroup, Switch } from '@mui/material';
import { GrEdit, GrTrash, GrAdd, GrFormClose } from "react-icons/gr";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';


const PolicyCreate = () => {
  
  const [open, setOpen] = React.useState(false);
  const [policyName, setPolicyName] = useState('monisha-test')
  const handleNameChange = (e) => {
    setPolicyName(e.target.value)
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e, value) => {
    console.log(value)
    if (value == 'clear') {
      setSelectedResource(tempValue)
      setFilterValues({[tempValue]: []})
      setFilterOps([])
    }
    setOpen(false);
  };


  const dispatch = useDispatch();

  // const [filterValues, setFilterValues] = useState({s3: [{filter: 'name', name: 'xyz', dummyKey: 'dummy-hi'}, {filter: 'createdBy', user: 'Monisha'}]})
  const [filterValues, setFilterValues] = useState({})
  const [tempValue, setTempResource] = useState('')
  const [filterOps, setFilterOps] = useState([])
  const [allResources, setAllResources] = useState([])

  const [filterSchema, setFilterSchema] = useState({});
  const [selectedResource, setSelectedResource] = useState('');
  
  const [filtersToAdd, setFiltersToAdd] = useState({filters: {}})
  const [currentSelectedFilter, setCurrentSelectedFilter] = useState({filterName: "", filterSettings: {}})

  const initFetch = useCallback(() => {
    dispatch(retrievePolicyStructure())
    .unwrap()
    .then(data => {
      let types = []
      let r = Object.keys(data)
      r.forEach((res) => {
        data[res].filterOptions.forEach((opt) => {
          data[res].filterDetails[opt].filterList.forEach((fil) => {
            console.log(res, opt, fil, data[res].filterDetails[opt].filterInfo[fil].type)
            if (types.indexOf(data[res].filterDetails[opt].filterInfo[fil].type) == -1) {
              types.push(data[res].filterDetails[opt].filterInfo[fil].type)
            }
          })
        })
      })
      console.log(types)
      setAllResources(Object.keys(data))
      setFilterSchema(data)
    })
    .catch(e => {
      console.log(e)
    })
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const dropDown = function (options, ids, selectedValue, onChangeHandler, resourceName, index=-1, resource='', disabled=false, key='') {
    return (
      <span key={resourceName}>
        <FormControl size="small" className='resource-type'>
          <InputLabel id='resource-name'>{resourceName}</InputLabel>
          <Select disabled={disabled} key={resourceName} labelId={resourceName} value={selectedValue} label={resourceName} onChange={(e) => onChangeHandler(e, index, resource, key)}>
            {options && options.map((item, index) => {
              return (
                <MenuItem key={ids[index]} value={ids[index]}>{item}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </span>
    )
  }

  const textField = function(value, onChangeHandler, displayName, name, index, resource, filterIndex) {
    return (
      <TextField required value={value} key={index}
        onChange={(e) => onChangeHandler(e, value, name, filterIndex, resource, 'textfield')} id={name}
        label={displayName} variant="outlined" 
        className="filter-txt" size="small" 
      />
    )
  }

  const dateField = function(value, onChangeHandler, displayName, name, index, resource, filterIndex) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} key={index}>
        <DatePicker key={index} className="date-picker" label={displayName} value={value} onChange={(e) => onChangeHandler(e, value, name, filterIndex, resource, 'date')}/>
      </LocalizationProvider>
    )
  }

  const booleanField = function(value, onChangeHandler, displayName, name, index, resource, filterIndex) {
    return (
      <label key={index} className='pointer'><input type="checkbox" value={value} checked={value} onChange={(e) => onChangeHandler(e, value, name, filterIndex, resource, 'boolean')} /> {displayName} </label>
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

  const getFilterIDFromName = function(resource, filterName) {
    return filterName
  }

  const getFilterKeys = function (resource, filter) {
    return filterSchema[resource].filterDetails[filter].filterList
  }

  const onFilterValueChange = function(e, oldValue, name, index, resource, type) {
    let newFilterValues = filterValues[resource]
    if(newFilterValues && newFilterValues[index]) {
      if (type == 'date') {
        newFilterValues[index][name] = new Date(e.$y, e.$M, e.$D);
      } else if (type == 'boolean') {
        newFilterValues[index][name] = oldValue == '' || oldValue == false ? true : false 
      } else {
        newFilterValues[index][name] = e.target.value
      }
      setFilterValues({...filterValues, [resource]: newFilterValues})
      validateFilterValues();
    }
  }

  const getIntegerKeys = function() {
    let integerKeys = []
    let resources = Object.keys(filterSchema);
    resources.forEach((resource) => {
      filterSchema[resource].filterOptions.forEach((option) => {
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
  }


  const deleteResource = function(resource) {
    let newFilterValues = filterValues[resource];
    delete newFilterValues[resource]
    setFilterValues({filterValues: newFilterValues})
  }

  const onDropDownValueChange = function(e, index, resource, key) {
    let newFilterValues = filterValues[resource];
    newFilterValues[index][key] = e.target.value
    setFilterValues({...filterValues, [resource]: newFilterValues})

  }
  const renderFilters = function() {
    return Object.keys(filterValues).map((resource, index) => {
      let filterElements = filterValues[resource].map((filterValue, index2) => {
        let filterOptionsList = []
        if (filterValue && filterValue.filter != '') {
          filterOptionsList = filterSchema[resource] && filterSchema[resource].filterDetails[filterValue.filter].filterList 
        }
        let optionsElement = []
        filterOptionsList && filterOptionsList.forEach((option, index3) => {
          if(option != '') {
            let metadata = getFilterMetadata(resource, filterValue.filter, option)
            if(metadata && metadata.type === 'dropdown') {
              optionsElement.push(
                dropDown(metadata.options, metadata.options, filterValue[option] , onDropDownValueChange, metadata.displayName, index2, resource, false, option)
              )
            }
            if(metadata && metadata.type === 'freetext') {

              optionsElement.push(
                textField(filterValue[option], onFilterValueChange, metadata.displayName, option, index3, resource, index2)
              )
            } else if(metadata && metadata.type === 'int') {
              optionsElement.push(
                textField(filterValue[option], onFilterValueChange, metadata.displayName, option, index3, resource, index2)
              )            
            } else if (metadata && metadata.type == 'date') {
              optionsElement.push(dateField(filterValue[option], onFilterValueChange, metadata.displayName, option, index3, resource, index2))

            } else if (metadata && metadata.type == 'boolean') {
              optionsElement.push(booleanField(filterValue[option], onFilterValueChange, metadata.displayName, option, index3, resource, index2))

            }
          }
        })
        if (filterSchema[resource] && filterSchema[resource].filterOptions) {
          let tempFilterOptions = [];
          filterSchema[resource].filterOptions.forEach((option) => {
            tempFilterOptions.push(filterSchema[resource].filterDetails[option].displayName)
          })
          return (
            <div key={index2}>
              <GrFormClose className="pointer margin-6 " onClick={(e) => deleteFilterOption(resource, filterValue.filter, index2)} />
              {dropDown(tempFilterOptions, filterSchema[resource].filterOptions, filterValue.filter, onFilterChange, 'Filter', index2, resource)}
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
    let policies = []
    let response = []
    console.log(filterValues[selectedResource])
    filterValues[selectedResource].forEach((filter) => {
      let filterParams = {filterName: filter.filter}
      
      Object.keys(filter).forEach((fkey) => {
        if (fkey != 'filter') {
          filterParams[fkey] = filter[fkey]
        }
      })
      policies.push(filterParams)
    })
    response = [{'and': policies}]
/*
    dispatch(addPolicy({policyName: policyName, regions: [], definition: response}))
    .unwrap()
    .then(data => {
      alert("Policy created")
    })
    .catch(e => {
      console.log(e)
    })
*/
  }

  const handleChange = (e) => {
    if (selectedResource != '') {
      setOpen(true)
    } else {
      setSelectedResource(e.target.value)
      setFilterValues({[e.target.value]: []})
      setFilterOps([])      
    }
    setTempResource(e.target.value)
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

  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">
        <div>
          <TextField placeholder="Policy name" value={policyName} onChange={(e) => handleNameChange(e)} id="policy-name" label="Policy Name" variant="outlined" className="text-field" size="small" />  <br /> <br />
          <FormControl size="small" className='resource-type'>
            <InputLabel id='resource-name'>Resource</InputLabel>
            <Select labelId='select-resource' value={selectedResource} label='Resource' onChange={handleChange}>
              {allResources.map((item, index) => {
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

        <Button type="submit" variant="contained" onClick={submitPolicy}>Submit</Button> <br />

      <Dialog
        open={open}
        onClose={(e) => handleClose(e, null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Important!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Changing resource will delete all the filters applied.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => handleClose(e, 'cancel')}>Cancel</Button>
          <Button onClick={(e) => handleClose(e, 'clear')} autoFocus>Ok!</Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
};


export default PolicyCreate;

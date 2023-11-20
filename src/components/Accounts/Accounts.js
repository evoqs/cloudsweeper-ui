import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../slices/home";
import { retrieveAccountsDispatch, addAccountDispatch, deleteAccountDispatch } from "../../utils/api-calls";
import Menu from "../Menu";
import "./accounts.css";
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Box, FilledInput, Button, TextField } from '@mui/material';
import { GrEdit, GrTrash } from "react-icons/gr";


const Accounts = () => {
  const userProfileState = {
    username: "",
    name: ""
  }
  const users = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [profile, setUserProfile] = useState(userProfileState);
  const [accountsList, setAccountsList] = useState([]);
  const [refreshPage, setRefreshPage] = useState(true);

  const reloadPage = function () {
    setRefreshPage(true)
  }

  if (refreshPage) {
    retrieveAccountsDispatch(dispatch, setAccountsList)
    setRefreshPage(false)
  }

  const initAWSCreds = {accessKey: '121', secret: 'sds', name: '1212111sd', region: 'test'} 
  const [awsCreds, setAWSCreds] = useState(initAWSCreds);

  const handleAWSAccessChange = e => {
    setAWSCreds({ ...awsCreds, accessKey: e.target.value });
  }

  const handleAWSAccName = e => {
    setAWSCreds({ ...awsCreds, name: e.target.value });
  }

  const handleAWSSecretChange = e => {
    setAWSCreds({ ...awsCreds, secret: e.target.value });
  }  

  const submitAWSCreds = function() {
    console.log(awsCreds)
    addAccountDispatch(dispatch, {accountid: "1033", accounttype: "aws", description: awsCreds.name, aws_access_key_id: awsCreds.accessKey, aws_secret_access_key: awsCreds.secret, aws_region: awsCreds.region}, reloadPage)
  }

  const editAccount = function (accountID) {
    console.log('edit ', accountID)
  }

  const deleteAccount = function (accountID) {
    console.log('delete ', accountID)
    deleteAccountDispatch(dispatch, {id: accountID}, reloadPage)
  }

  const initFetch = useCallback(() => {
    dispatch(userProfile())
    .unwrap()
    .then(data => {
      setUserProfile({ ...profile, name: data.name, username: data.username})
    })
    .catch(e => {
      console.log(e)
    });
    // retrieveAccountsDispatch(dispatch, setAccountsList)
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])
  console.log(accountsList)
  return (
    <div className="list row">
      <div className="col-md-1">
        <Menu />
      </div>
      <div className="col-md-1 verticalLine">
      </div>      
      <div className="col-md-10">
        <strong>Cloud Accounts</strong> <br />
        { accountsList && accountsList != 'error' &&
          accountsList.map((acc, index) => {
            return (
              <div key={index}>
                {acc.description} 
                {/*<GrEdit className="pointer" onClick={() => editAccount(acc.cloudaccountid)} /> */}
                <GrTrash className="pointer" onClick={() => deleteAccount(acc.cloudaccountid)} />
              </div>
            )
          })
        }
        <br />
        <strong>Add Cloud accounts</strong><br />
{/*
        <FormControl>
          <RadioGroup row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="aws"
            name="radio-buttons-group"
          >
            <FormControlLabel value="aws" control={<Radio />} label="AWS" />
            <FormControlLabel value="gcp" control={<Radio />} label="Google" disabled />
            <FormControlLabel value="ibm" control={<Radio />} label="IBM" disabled />
            <FormControlLabel value="oracle" control={<Radio />} label="Oracle" disabled />
          </RadioGroup>
        </FormControl>       
*/}
        <Box mt={2}>
          <TextField id="account-name" label="Account name" value={awsCreds.name} onChange={handleAWSAccName} variant="outlined" className="aws-input" size="small" /> <br />
          <TextField id="access-key" label="AWS Access Key" value={awsCreds.accessKey} onChange={handleAWSAccessChange} variant="outlined" className="aws-input" size="small" /> <br />
          <TextField id="secret-key" label="AWS Secret" value={awsCreds.secret} onChange={handleAWSSecretChange} variant="outlined" className="aws-input" size="small" /> <br />
          <Button type="submit" variant="contained" onClick={submitAWSCreds}>Create Account</Button> <br />
        </Box> 

      </div>
    </div>
  );
};

export default Accounts;

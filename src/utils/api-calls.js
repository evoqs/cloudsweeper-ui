import { retrieveAccounts, addAccount, deleteAccount } from "../slices/accounts";
import { retrievePipelines, deletePipeline, addPipeline } from "../slices/pipelines"
import { retrievePolicies, deletePolicy } from "../slices/policies"
import { userProfile } from "../slices/home";

// fetch all accounts
const retrieveAccountsDispatch = function (dispatch, setAccountsList) {
  dispatch(retrieveAccounts())
  .unwrap()
  .then(data => {
    setAccountsList(data)
  })
  .catch(e => {
    console.log(e)
  })
}

// add account
const addAccountDispatch = function (dispatch, {accountid, accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region}, reloadPage) {
  console.log("In dispatch", accountid, accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region)
  dispatch(addAccount({accountid, accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region}))
  .unwrap()
  .then(data => {
    console.log("created account")
    reloadPage()
  })
  .catch(e => {
    console.log(e)
  })
}

// delete account
const deleteAccountDispatch = function (dispatch, {id}, reloadPage) {
  dispatch(deleteAccount({id}))
  .unwrap()
  .then(data => {
    console.log("deleted account")
    reloadPage()
  })
  .catch(e => {
    console.log(e)
  })
}

// fetch user profile
const userProfileDispatch = function (dispatch, setUserProfile, profile) {
  dispatch(userProfile())
  .unwrap()
  .then(data => {
    setUserProfile({ ...profile, name: data.name, username: data.username})
  })
  .catch(e => {
    console.log(e)
  });  
}

// fetch pipelines
const retrievePipelinesDispatch = function (dispatch, setPipelinesList) {
  dispatch(retrievePipelines())
  .unwrap()
  .then(data => {
    setPipelinesList(data)
  })
  .catch(e => {
    console.log(e)
  })
}
// add pipelines
const addPipelineDispatch = function (dispatch, accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled, handler) {
  console.log(accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled)
  dispatch(addPipeline({accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled}))
  .unwrap()
  .then(data => {
    console.log("created pipeline")
    handler()
  })
  .catch(e => {
    console.log(e)
  })
} 

// delete pipelines

const deletePipelineDispatch = function (dispatch, {id}, reloadPage) {
  console.log(reloadPage)
  dispatch(deletePipeline({id}))
  .unwrap()
  .then(data => {
    console.log("deleted pipeline")
    reloadPage()
  })
  .catch(e => {
    console.log(e)
  })
}


// fetch policies
const retrievePoliciesDispatch = function (dispatch, setPoliciesList) {
  dispatch(retrievePolicies())
  .unwrap()
  .then(data => {
    setPoliciesList(data)
  })
  .catch(e => {
    console.log(e)
  })
}
// add policies

// delete policies

const deletePolicyDispatch = function (dispatch, {id}, reloadPage) {
  console.log(reloadPage)
  dispatch(deletePolicy({id}))
  .unwrap()
  .then(data => {
    console.log("deleted policy")
    reloadPage()
  })
  .catch(e => {
    console.log(e)
  })
}



export {
  retrieveAccountsDispatch,
  userProfileDispatch,
  addAccountDispatch,
  deleteAccountDispatch,
  retrievePipelinesDispatch,
  addPipelineDispatch,
  deletePipelineDispatch,
  retrievePoliciesDispatch,
  deletePolicyDispatch
}
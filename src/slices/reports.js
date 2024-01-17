import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ReportsService from "../services/reports";

const initialState = [];

export const retrieveReports = createAsyncThunk(
  "reports/get",
  async (data) => {
    const res = await ReportsService.getReports(data.pipelineID);
    let response = res.data;
    // let response = [{"_id": "65574036b46b103827bb3a24","displayDefinition": {"displayName": {"attachments": "Attached","availabilityZone": "Availability Zone","region": "Region","snapshotId": "Snapshot Id","state": "State","volumeId": "Volume Id","volumeType": "Volume Type"},"displayOrder": ["volumeId","volumeType","snapshotId","availabilityZone","state","attachments"]},"lastrunstatus": "SUCCESS","lastruntime": 1702382647,"pipelineid": "655729f9bb2adf0cc2b1deda","policyid": "655723c9bb2adf0cc2b1ded9","resource": "ebs","resultlist": [{"region": "ap-northeast-1","result": [{"resultData": {"attachments": true,"availabilityZone": "ap-northeast-1a","encrypted": "","region": "","snapshotId": "snap-03526e0884a67b7fb","state": "in-use","volumeId": "vol-0ba99949c5f8009cb","volumeType": "gp2"},"resultMetaData": null},{"resultData": {"attachments": true,"availabilityZone": "ap-northeast-1a","encrypted": "","region": "","snapshotId": "snap-03526e0884a67b7fb","state": "in-use","volumeId": "vol-06648e66e76b1407d","volumeType": "gp2"},"resultMetaData": null},{"resultData": {"attachments": true,"availabilityZone": "ap-northeast-1a","encrypted": "","region": "","snapshotId": "snap-0ae02beb4873352c7","state": "in-use","volumeId": "vol-0a88ff416a75efec1","volumeType": "gp2"},"resultMetaData": null}]},{"region": "ap-south-1","result": []},{"region": "ap-southeast-2","result": [{"resultData": {"attachments": true,"availabilityZone": "ap-southeast-2c","encrypted": "","region": "","snapshotId": "snap-077e13803c95ebe32","state": "in-use","volumeId": "vol-0a328dcbdc9c3dbfc","volumeType": "gp3"},"resultMetaData": null}]},{"region": "us-east-1","result": []}]},{"_id": "656add1b749be21433e96d7c","displayDefinition": {"displayName": {"domain": "Domain","networkBorderGroup": "Network Border Group","publicIp": "Public IP","publicIpv4pool": "IPv4 Pool","region": "Region"},"displayOrder": ["publicIp","publicIpv4pool","domain","networkBorderGroup"]},"lastrunstatus": "SUCCESS","lastruntime": 1702382648,"pipelineid": "655729f9bb2adf0cc2b1deda","policyid": "656acee006c1ccea6bb5db9e","resource": "elastic-ip","resultlist": [{"region": "ap-northeast-1","result": []},{"region": "ap-south-1","result": [{"resultData": {"domain": "vpc","networkBorderGroup": "ap-south-1","publicIp": "13.235.169.33","publicIpv4pool": "amazon"},"resultMetaData": null}]},{"region": "ap-southeast-2","result": [{"resultData": {"domain": "vpc","networkBorderGroup": "ap-southeast-2","publicIp": "52.65.57.145","publicIpv4pool": "amazon"},"resultMetaData": null}]},{"region": "us-east-1","result": []}]},{"_id": "656b1a2a749be21433e96d7e","displayDefinition": {"displayName": {"description": "Description","snapshotId": "Snapshot Id","state": "State","storageTier": "Storage Tier","volumeId": "Volume Id","volumeSize": "Size"},"displayOrder": ["snapshotId","volumeId","volumeSize","description","state","storageTier"]},"lastrunstatus": "SUCCESS","lastruntime": 1702382648,"pipelineid": "655729f9bb2adf0cc2b1deda","policyid": "656b19cf749be21433e96d7d","resource": "ebs-snapshot","resultlist": [{"region": "ap-northeast-1","result": []},{"region": "ap-south-1","result": []},{"region": "ap-southeast-2","result": []},{"region": "us-east-1","result": []}]}]
    let reports = []
    response.forEach((policyReport) => {
      let d = new Date(0)
      d.setUTCSeconds(policyReport.lastruntime)
      policyReport.lastruntime = d.toString();
      let policyResults = []
      policyReport.resultlist.forEach((resultList) => {
        resultList.result.forEach((res) => {
          let currentResult = {}
          currentResult['Region'] = resultList.region;
          Object.keys(res.resultData).forEach((resDataKey) => {
            currentResult[resDataKey] = res.resultData[resDataKey]
          })
          policyResults.push(currentResult);
        })
      })
      policyReport.results = policyResults;
      reports.push(policyReport)
    })
    return reports;
  }
);


const reportsPageSlice = createSlice({
  name: "reports",
  initialState,
  extraReducers: {
    [retrieveReports.fulfilled]: (state, action) => {
      return [...action.payload];
    }
  },
});

const { reducer } = reportsPageSlice;
export default reducer;

import http from "../http-common";

class PipelinesService {
  getAll() {
    return http.get("/api/gw/accounts/1033/pipelines");
  }

  getPolicyStructure() {
    return http.get("/api/gw/dummy-json");
  }

  addPipeline(accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled) {
    console.log(accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled)
    let scheduleArr = schedule.split(' ')
    let data = {
      accountid,  // str
      cloudaccountid: cloudAccID, // str
      pipelinename: pipelineName, // str
      policies, //array of str
      schedule: {"minute": scheduleArr[0], "hour": scheduleArr[1], "dayofmonth": scheduleArr[2], "month": scheduleArr[3], "dayofweek": scheduleArr[4]}, // {"minute":"*", "hour":"1","dayofmonth":"*","month":"*","dayofweek":"*"}
      enabled, // boolean
      execregions
    }
    return http.post("/api/gw/pipeline", data)
  }

  deletePipeline(pipelineID) {
    return http.delete("/api/gw/pipeline/" + pipelineID)
  }

}

export default new PipelinesService();
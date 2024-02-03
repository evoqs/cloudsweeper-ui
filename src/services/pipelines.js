import http from "../http-common";

class PipelinesService {
  getAll() {
    return http.get("/api/gw/pipelines");
  }

  getPolicyStructure() {
    return http.get("/api/gw/dummy-json");
  }

  getRegions() {
    return http.get("/api/gw/regions");
  }

  addPipeline(cloudAccID, pipelineName, policies, schedule, execregions, email, enabled) {
    console.log(cloudAccID, pipelineName, policies, schedule, execregions, enabled)
    let scheduleArr = schedule.split(' ')
    let data = {
      cloudaccountid: cloudAccID, // str
      piplinename: pipelineName, // str
      policies, //array of str
      schedule: {"minute": scheduleArr[0], "hour": scheduleArr[1], "dayofmonth": scheduleArr[2], "month": scheduleArr[3], "dayofweek": scheduleArr[4]}, // {"minute":"*", "hour":"1","dayofmonth":"*","month":"*","dayofweek":"*"}
      enabled, // boolean
      execregions,
      notifications: {emailAddresses: email.split(','), slackUrls: [], webhookUrls: []}
    }
    return http.post("/api/gw/pipeline", data)
  }

  deletePipeline(pipelineID) {
    return http.delete("/api/gw/pipeline/" + pipelineID)
  }

}

export default new PipelinesService();
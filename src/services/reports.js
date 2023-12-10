import http from "../http-common";

class ReportsService {
  getReports(pipelineID) {
    return http.get("/api/gw/pipelineresults?pipelineid=" + pipelineID);
  }
}

export default new ReportsService();
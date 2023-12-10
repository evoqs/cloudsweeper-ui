import http from "../http-common";

class PoliciesService {
  getAll() {
    return http.get("/api/gw/policies");
  }

  getPolicyStructure() {
    return http.get("/api/gw/dummy-json");
  }

  addPolicy(policyname, policydefinition) {
    let data = {
      policyname, // str
      policydefinition: JSON.stringify({'policies': policydefinition})
    }
    return http.post("/api/gw/policy", data)
  }

  deletePolicy(policyID) {
    return http.delete("/api/gw/policy/" + policyID)
  }
}

export default new PoliciesService();
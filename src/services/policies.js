import http from "../http-common";

class PoliciesService {
  getAll() {
    return http.get("/api/gw/accounts/1033/policies");
  }

  getPolicyStructure() {
    return http.get("/api/gw/dummy-json");
  }

  addPolicy(accountid, policyname, execregions, policydefinition) {
    let data = {
      accountid,  // str
      policyname, // str
      execregions, // array of str
      policydefinition: policydefinition
    }
    return http.post("/api/gw/policy", data)
  }

// '{ "policydefinition": "{\"policies\":[{\"name\":\"my-first-policy\",\"resource\":\"aws.ec2\",\"filters\":[{\"tag:Custodian\":\"present\"}]}]}"}' http://127.0.0.1:8000/policy

  deletePolicy(policyID) {
    return http.delete("/api/gw/policy/" + policyID)
  }
}

export default new PoliciesService();
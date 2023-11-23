import http from "../http-common";

class AccountsDataService {
  getAll() {
    return http.get("/api/gw/cloudaccounts");
  }

  addAccount(accountid, accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region) {
    console.log(accountid, accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region)
    let data = {
      name: description,
      accountid,
      accounttype,
      description,

      awscredentials: {
        aws_access_key_id,
        aws_secret_access_key,
        aws_region
      }
    }
    return http.post("/api/gw/cloudaccount", data)
  }

  deleteAccount(accountid) {
    return http.delete("/api/gw/cloudaccount/" + accountid)    
  }
}

export default new AccountsDataService();

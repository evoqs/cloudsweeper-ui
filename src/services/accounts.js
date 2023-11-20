import http from "../http-common";

class AccountsDataService {
  getAll() {
    return http.get("/api/gw/accounts/1033/cloudaccounts");
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
/*
 '{
 "accountid": "1033", 
 "accounttype": "aws",  
 "description": "awsaccount for qa", 
 "awscredentials": {"aws_access_key_id": "AKIA4T2VWH7A6GQYCS7Z", "aws_secret_access_key": "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"}}'


*/
  deleteAccount(accountid) {
    return http.delete("/api/gw/cloudaccount/" + accountid)    
  }
}

export default new AccountsDataService();

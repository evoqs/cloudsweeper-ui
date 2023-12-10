import http from "../http-common";

class LandingDataService {
  getAll() {
    return http.get("/api/users");
  }

  login(userInfo) {
    console.log("service.", userInfo)
    return http.post("/api/auth/login", {username: userInfo.login, password: userInfo.password})
  }

  register(userInfo) {
    console.log("service.", userInfo)
    return http.post("/api/auth/register", {username: userInfo.login, password: userInfo.password})
  }  
}

export default new LandingDataService();
import http from "../http-common";

class HomeDataService {
  getAll() {
    return http.get("/api/users");
  }

  userProfile() {
    return http.get("/api/users/profile")
  }
}

export default new HomeDataService();
import axios from "axios";

export default axios.create({
  baseURL: "http://" + window.location.hostname + ":8080",
  headers: {
    "Content-type": "application/json",
    "Authorization": sessionStorage.token ? sessionStorage.token : ""
  }
});
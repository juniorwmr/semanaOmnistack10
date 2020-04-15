import axios from "axios";

const api = axios.create({
  baseURL: "https://cptec-api.herokuapp.com",
});

export default api;

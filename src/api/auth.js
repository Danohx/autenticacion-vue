import axios from "axios";

const API = "http://localhost:4000/auth";

export default {
  register(data) {
    return axios.post(`${API}/register`, data);
  },
  login(data) {
    return axios.post(`${API}/login`, data);
  },
};

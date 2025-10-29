import axios from "axios";

const API = process.env.VUE_APP_API_URL || "http://localhost:4000";

export default {
  register(data) {
    return axios.post(`${API}/register`, data);
  },
  login(data) {
    return axios.post(`${API}/login`, data);
  },
};

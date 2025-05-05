import axios from "axios";
import { API } from "@/constants/api";

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  transformRequest: [(data) => {
    const params = new URLSearchParams();
    for (const key in data) {
      params.append(key, data[key]);
    }
    return params.toString();
  }],
});

export default apiClient;

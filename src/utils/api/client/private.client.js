import axios from "axios";
import queryString from "query-string";
import { getCookie } from "../../cookie";

const baseURL = "http://localhost:8000/api/v1";

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

privateClient.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("AuthToken")}`,
    },
    credentials: "include",
  };
});

privateClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (err) => {
    throw err.response.data;
  }
);

export default privateClient;

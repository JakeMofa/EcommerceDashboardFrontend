import axios from "axios";
import { isClient } from "../helpers/isClient";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { clearUserInfoOnClient } from "../providers/auth";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 60000,
});

export const reports_api_request = axios.create({
  baseURL: process.env.NEXT_REPORTS_API_URL,
  timeout: 60000,
});

export const api_request = axios.create({
  baseURL: "",
  timeout: 60000,
});

request.interceptors.request.use(
  (config) => {
    const user = JSON.parse(isClient ? localStorage.getItem("user") : "{}");

    if (user?.access_token) {
      const decodedToken = jwtDecode(user?.access_token);
      var expDate = moment(decodedToken?.exp * 1000);
      const seconds = expDate.diff(moment(), "seconds"); // 1

      if (seconds < 100) {
        clearUserInfoOnClient();
        return Promise.reject({
          response: { status: 401, message: "Not authorized" },
        });
      } else {
        config.headers["Authorization"] = `Bearer ${user?.access_token}`;
      }
    }

    if (
      config.url.startsWith("/sales/") ||
      config.url.startsWith("/advertising") ||
      config.url.startsWith("/advertising-campaign-graph") ||
      config.url.startsWith("/customer-acquisition") ||
      config.url.startsWith("/breakdown") ||
      config.url.startsWith("/category-breakdown") ||
      config.url.startsWith("/new-customer-sales") ||
      config.url.startsWith("/categories") ||
      config.url.startsWith("/report-logs") ||
      config.url.startsWith("/configurations") ||
      config.url.startsWith("/inventory")
    ) {
      const brand = JSON.parse(localStorage.getItem("brand"));
      config.url = "/brands/" + brand?.id + config.url;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res) => {
    if (res?.response?.status === 401) {
      clearUserInfoOnClient();
    }
    return res;
  },
  (error) => {
    if (error?.response?.status === 401) {
      clearUserInfoOnClient();
      return Promise.reject(error);
    }
    return error.response;
  }
);

export default request;

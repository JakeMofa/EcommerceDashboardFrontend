import { message } from "antd";
import {
  fetchBrandList,
  fetchUserBrandList,
  fetchAmazonSpApiCredentialsRequest,
  fetchAmazonAdvertisingCredentialsRequest,
  fetchAdvertiserList,
} from "../api/brands.api";
import {
  setBrandList,
  setUserBrandList,
  setAmazonSpApiCredentialsList,
  setAmazonAdvertisingCredentialsList,
  setAdvertiserList,
} from "../store/slice/brands.slice";

export const getBrandList = (data) => {
  return (dispatch) => {
    fetchBrandList(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(setBrandList(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getUserBrandList = (data) => {
  return (dispatch) => {
    fetchUserBrandList(data)
      .then((res) => {
        if (res.data) {
          dispatch(setUserBrandList({ data: res.data.brands, status: true }));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getAmazonSpApiCredentialsList = (data) => {
  return (dispatch) => {
    dispatch(setAmazonSpApiCredentialsList({ data: [], status: false }));
    fetchAmazonSpApiCredentialsRequest(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setAmazonSpApiCredentialsList({ data: res.data, status: true })
          );
        } else {
          dispatch(setAmazonSpApiCredentialsList({ data: [], status: true }));
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getAmazonAdvertisingCredentialsList = (data) => {
  return (dispatch) => {
    dispatch(setAmazonAdvertisingCredentialsList({ data: [], status: false }));
    fetchAmazonAdvertisingCredentialsRequest(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setAmazonAdvertisingCredentialsList({
              data: res.data,
              status: true,
            })
          );
        } else {
          dispatch(
            setAmazonAdvertisingCredentialsList({ data: [], status: true })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

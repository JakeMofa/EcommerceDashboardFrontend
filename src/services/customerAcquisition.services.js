import { message } from "antd";
import { setCustomerAcquisitionMonthly } from "../store/slice/customerAcquisitionMonthly.slice";
import { setCustomerAcquisitionWeekly } from "../store/slice/customerAcquisitionWeekly.slice";
import {
  setCustomerAcquisitionLTV,
  setCustomerAcquisitionPredictiveLTV,
} from "../store/slice/customerAcquisitionLTV.slice";
import { setCustomerAcquisitionBreakdownMonthly } from "../store/slice/customerAcquisitionBreakdownMonthly.slice";
import { setCustomerAcquisitionBreakdownWeekly } from "../store/slice/customerAcquisitionBreakdownWeekly.slice";
import { setCustomerAcquisitionCategoryBreakdownMonthly } from "../store/slice/customerAcquisitionCategoryBreakdownMonthly.slice";
import { setCustomerAcquisitionCategoryBreakdownWeekly } from "../store/slice/customerAcquisitionCategoryBreakdownWeekly.slice";
import {
  fetchCustomerAcquisitionMonthly,
  fetchCustomerAcquisitionWeekly,
  fetchCustomerAcquisitionLTV,
  fetchCustomerAcquisitionPredictiveLTV,
  fetchCustomerAcquisitionBreakdownMonthly,
  fetchCustomerAcquisitionBreakdownWeekly,
  fetchCustomerAcquisitionCategoryBreakdownMonthly,
  fetchCustomerAcquisitionCategoryBreakdownWeekly,
} from "../api/customerAcquisition.api";
import initialState from "../store/initialState";

export const getCustomerAcquisitionMonthly = (data) => {
  return (dispatch) => {
    fetchCustomerAcquisitionMonthly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionMonthly({ status: true, data: res.data })
          );
        } else {
          dispatch(
            setCustomerAcquisitionMonthly({
              ...initialState.customerAcquisitionMonthly,
              status: false,
            })
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

export const getCustomerAcquisitionWeekly = (data) => {
  return (dispatch) => {
    fetchCustomerAcquisitionWeekly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionWeekly({ status: true, data: res.data })
          );
        } else {
          dispatch(
            setCustomerAcquisitionWeekly({
              ...initialState.customerAcquisitionWeekly,
              status: false,
            })
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

export const getCustomerAcquisitionLTV = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionLTV(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setCustomerAcquisitionLTV({ status: true, data: res.data }));
        } else {
          dispatch(
            setCustomerAcquisitionLTV({
              ...initialState.customerAcquisitionLTV.LTV,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCustomerAcquisitionPredictiveLTV = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionPredictiveLTV(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionPredictiveLTV({
              status: true,
              data: res.data.ltvPrediction,
            })
          );
        } else {
          dispatch(
            setCustomerAcquisitionPredictiveLTV({
              ...initialState.customerAcquisitionLTV.predictiveLTV,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCustomerAcquisitionBreakdownMonthly = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionBreakdownMonthly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionBreakdownMonthly({
              status: true,
              ...res.data,
            })
          );
        } else {
          dispatch(
            setCustomerAcquisitionBreakdownMonthly({
              ...initialState.customerAcquisitionBreakdownMonthly,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCustomerAcquisitionBreakdownWeekly = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionBreakdownWeekly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionBreakdownWeekly({
              status: true,
              ...res.data,
            })
          );
        } else {
          dispatch(
            setCustomerAcquisitionBreakdownWeekly({
              ...initialState.customerAcquisitionBreakdownWeekly,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCustomerAcquisitionCategoryBreakdownMonthly = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionCategoryBreakdownMonthly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionCategoryBreakdownMonthly({
              status: true,
              data: res.data,
            })
          );
        } else {
          dispatch(
            setCustomerAcquisitionCategoryBreakdownMonthly({
              ...initialState.customerAcquisitionCategoryBreakdownMonthly,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCustomerAcquisitionCategoryBreakdownWeekly = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "loading...", key: "loading", duration: 0 });
    fetchCustomerAcquisitionCategoryBreakdownWeekly(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCustomerAcquisitionCategoryBreakdownWeekly({
              status: true,
              data: res.data,
            })
          );
        } else {
          dispatch(
            setCustomerAcquisitionCategoryBreakdownWeekly({
              ...initialState.customerAcquisitionCategoryBreakdownWeekly,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

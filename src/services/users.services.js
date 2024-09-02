import { message } from "antd";
import {
  fetchSwitchUser,
  fetchUserList,
  removeBrandAM,
  removeBrandCategory,
  updateBrandAM,
  updateBrandCategory,
} from "../api/users.api";
import { setSwitchUser, setUserList } from "../store/slice/users.slice";

export const getUserList = (data) => {
  return (dispatch) => {
    fetchUserList(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(setUserList(res.data));
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

export const assignUserToBrand = (data) => {
  return (dispatch) => {
    // message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    updateBrandAM(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          // dispatch(setUserList(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy();
      });
  };
};

export const deleteUserOfBrand = (data) => {
  return (dispatch) => {
    // message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    removeBrandAM(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          // dispatch(setUserList(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy();
      });
  };
};

export const assignCategoryToBrand = (data) => {
  return (dispatch) => {
    // message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    updateBrandCategory(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          // dispatch(setUserList(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy();
      });
  };
};

export const deleteCategoryOfBrand = (data) => {
  return (dispatch) => {
    // message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    removeBrandCategory(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          // dispatch(setUserList(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy();
      });
  };
};

export const getSwitchUser = (data) => {
  return (dispatch) => {
    fetchSwitchUser(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSwitchUser(res.data));
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

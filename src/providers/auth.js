import { isClient } from "../helpers/isClient";
import jwtDecode from "jwt-decode";
import { deleteCookie } from "cookies-next";
import Router from "next/router";
import { cookies } from "../constants/cookies";
import moment from "moment";
const { createContext, useEffect } = require("react");

const AuthContext = createContext({});

export const clearUserInfoOnClient = () => {
  isClient && deleteCookie(cookies.BRAND_ID);
  isClient && deleteCookie(cookies.TOKEN);
  isClient && localStorage.clear();
  isClient && Router.push("/login");
};

const AuthProvider = (props) => {
  const user = JSON.parse(isClient ? localStorage.getItem("user") : "{}");
  const brand = JSON.parse((isClient && localStorage.getItem("brand")) || "{}");
  const token = user?.access_token;

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      var expDate = moment(decodedToken?.exp * 1000);

      const handleCheckTokenValidity = () => {
        const seconds = expDate.diff(moment(), "seconds"); // 1

        const currentBrand = JSON.parse(localStorage.getItem("brand") || "{}");

        if (brand.id && currentBrand.id && brand.id !== currentBrand.id) {
          location.reload();
        }

        if (seconds < 100) {
          clearUserInfoOnClient();
        }
      };

      window.addEventListener("focus", handleCheckTokenValidity);
      const timeout = setInterval(handleCheckTokenValidity, 1000);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("focus", handleCheckTokenValidity);
      };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;

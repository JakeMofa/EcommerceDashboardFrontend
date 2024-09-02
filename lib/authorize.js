import { cookies } from "@/src/constants/cookies";
import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";
import moment from "moment";

const authorize =
  (action) =>
  async (req, res, { breakAll }) => {
    const url = req.nextUrl;
    const token = req.cookies.get(cookies.TOKEN)?.value;
    const tokenPresent = !!token;

    if (action === "reverse" && tokenPresent) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (tokenPresent) {
      const decodedToken = jwtDecode(token);
      var expDate = moment(decodedToken?.exp * 1000);
      const seconds = expDate.diff(moment(), "seconds"); // 1
      if (seconds < 100 && url.pathname !== "/login") {
        res.cookies.delete(cookies.TOKEN);
        return res;
      }
      return res;
    } else {
      if (action === "reverse") {
        return res;
      } else {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  };

export default authorize;

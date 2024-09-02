import Link from "next/link";
import { useState } from "react";
import { Input, message } from "antd";
import { useRouter } from "next/router";
import { signInRequest } from "@/src/api/auth.api";
import { fetchUserBrandList } from "@/src/api/brands.api";
import { setCookie, deleteCookie } from "cookies-next";
import { cookies } from "@/src/constants/cookies";
import jwt_decode from "jwt-decode";
import CommonLeftSide from "@/src/components/common-left-side";

// except Dollar as its default
const currencySymbols = {
  UK: "GBP",
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    setSending(true);

    localStorage.clear();
    deleteCookie(cookies.BRAND_ID);
    deleteCookie(cookies.TOKEN);

    let body = {
      email,
      password,
    };

    signInRequest(body)
      .then((res) => {
        setSending(false);
        if (res.status >= 200 && res.status <= 299) {
          const user = res.data;
          var decoded = jwt_decode(user.access_token);
          setCookie(cookies["TOKEN"], user.access_token, {
            maxAge: decoded.exp,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              role: user.role.toLowerCase().includes("admin")
                ? "Admin"
                : user.role,
              original_role: user.role,
            })
          );
          if (res.data.role != "User") {
            window.location.href = "/brands";
            return;
          }
          if (res.data.role == "User" && res.data.user_status == 0) {
            window.location.href = "/dashboard";
            return;
          }
          if (res.data.role == "User" && res.data.user_status != 0) {
            fetchUserBrandList().then((res) => {
              if (res.status >= 200 && res.status <= 299) {
                const brands = res.data.brands || [];
                if (brands.length > 0) {
                  if (brands.length == 1) {
                    localStorage.setItem(
                      "brand",
                      JSON.stringify({
                        ...brands[0].brand,
                        role: brands[0].role,
                      })
                    );
                    localStorage.setItem(
                      "currency_symbol",
                      currencySymbols[brands[0].brand.marketplace] || "USD"
                    );
                    setCookie(cookies.BRAND_ID, brands[0].brand.id);
                    window.location.href = "/sales-analytics/sales";
                    return;
                  }
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      ...user,
                      role: user.role == "Admin" ? "Admin" : "Manager",
                    })
                  );
                  window.location.href = "/brands";
                  return;
                }
                if (brands.length === 0) {
                  window.location.href = "/dashboard";
                  return;
                }
              } else {
                message.error("Something went wrong");
              }
            });
          }
        } else {
          message.error(
            res.data.message == "Unauthorized"
              ? "Wrong password. Try again or reset your password."
              : "Wrong email. Try again or create an account."
          );
        }
      })
      .catch((err) => message.error(err));
  };

  return (
    <div style={{ height: "100vh" }}>
      <div
        className="d-flex flex-column flex-root h-100vh"
        style={{ height: "100%" }}
      >
        <div className="row" style={{ height: "100%" }}>
          <CommonLeftSide />

          <div
            style={{ background: "#fff", minHeight: "800px" }}
            className="d-flex flex-column col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
          >
            <div className="d-flex flex-center flex-column flex-column-fluid">
              <div className="w-lg-500px p-10 p-lg-15 mx-auto">
                <form onSubmit={onLogin} className="form w-100">
                  <div className="text-center mb-10">
                    <h1 className="text-dark fw-bold mb-3">
                      Sign In to <b className="fw-boldest">Vendo</b>
                    </h1>
                    <div className="text-gray-400 fw-bold fs-4">
                      New Here?{" "}
                      <Link
                        href="/signup"
                        style={{ color: "black" }}
                        className="link-primary fw-bolder"
                      >
                        Create an Account
                      </Link>
                    </div>
                  </div>
                  <div className="fv-row mb-10">
                    <label className="form-label fs-6 fw-bolder text-dark">
                      Email
                    </label>
                    <Input
                      placeholder="Enter Email"
                      type="email"
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="fv-row mb-10">
                    <div className="d-flex flex-stack mb-2">
                      <label className="form-label fw-bolder text-dark fs-6 mb-0">
                        Password
                      </label>
                      <Link href="/forget-password" className="fs-6 fw-bolder">
                        Forgot Password ?
                      </Link>
                    </div>
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      size="large"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={email && password && !sending ? false : true}
                      className="btn btn-light-danger btn-lg btn-primary w-100 mb-5"
                    >
                      {sending ? (
                        <span>
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                      ) : (
                        <span className="indicator-label">Login</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
              <div className="d-flex flex-center fw-bold fs-6">
                <p className="text-muted text-hover-primary px-2">
                  <Link href="/support">Support</Link>
                </p>
                {/* <p className="text-muted text-hover-primary px-2">Purchase</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

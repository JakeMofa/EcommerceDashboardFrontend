import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useMount from "../hooks/useMount";
import { deleteCookie } from "cookies-next";
import { cookies } from "../constants/cookies";
import { useDispatch } from "react-redux";
import { reset } from "../store/root.reducer";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isMount = useMount();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [hideMenus, setHideMenus] = useState(false);

  const user = isMount ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const brand = isMount
    ? JSON.parse(localStorage.getItem("brand") || "{}")
    : {};

  const checkWidth = () => {
    isMount && setHideMenus(690 > window.innerWidth);
  };

  useEffect(() => {
    if (isMount) {
      setHideMenus(690 > window.innerWidth);

      window.addEventListener("resize", (e) => {
        checkWidth();
      });

      return () => {
        window.removeEventListener("resize", () => {});
      };
    }
  }, []);

  useEffect(() => {
    if (isMount) {
      function updateSize() {
        if (window.innerWidth < 992) {
          setCollapsed(true);
        } else {
          setCollapsed(false);
        }
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const backToAdmin = () => {
    localStorage.removeItem("brand");
    deleteCookie(cookies.BRAND_ID);
    dispatch(reset());
    router.push("/brands");
  };

  const GetModules = () =>
    isMount && localStorage.getItem("brand")
      ? JSON.parse(localStorage.getItem("brand") || "")?.role === "User"
        ? "User"
        : "BrandManager"
      : user?.role;

  return (
    <div className="d-flex flex-column flex-root" style={{ height: "100vh" }}>
      <div
        className="page d-flex flex-row flex-column-fluid"
        style={{ height: "100vh" }}
      >
        <Sidebar
          user={user}
          brand={brand}
          hideMenus={hideMenus}
          collapsed={collapsed}
          userType={GetModules()}
          setCollapsed={() => setCollapsed(!collapsed)}
        />
        <div
          style={{ height: "100vh" }}
          className=" d-flex flex-column flex-row-fluid"
        >
          <Header
            collapsed={collapsed}
            hideMenus={hideMenus}
            backToAdmin={backToAdmin}
            setHideMenus={setHideMenus}
            setCollapsed={() => setCollapsed(!collapsed)}
          />
          <div
            style={{
              height: "100vh",
              overflow: "auto",
            }}
            className="d-flex flex-column flex-row-fluid"
            id="kt_wrapper"
          >
            <div className="flex-column flex-column-fluid">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

import { message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { nameObject } from "@/src/helpers/header.helper";
import Wrapper from "./style";
import useMount from "@/src/hooks/useMount";
import { BackArrowSvg, ForwardArrowSvg } from "@/src/assets";

export default function Header(props) {
  const router = useRouter();
  const isMount = useMount();

  const { backToAdmin, hideMenus, setHideMenus, collapsed, setCollapsed } =
    props;

  const [current, setCurrent] = useState({
    name: "",
  });

  useEffect(() => {
    if (nameObject[router.route]) {
      setCurrent(nameObject[router.route]);
    } else {
      if (
        Object.keys(nameObject).findIndex((d) =>
          d.includes("/" + router.route.split("/")[1])
        ) !== -1
      ) {
        return setCurrent(nameObject["/" + router.route.split("/")[1]]);
      }
      setCurrent({ name: "" });
    }
  }, [router?.route]);

  return (
    <>
      <Wrapper id="kt_header" className="header">
        {isMount && window.innerWidth >= 992 && (
          <div className="arrow" onClick={() => setCollapsed()}>
            {!collapsed ? <BackArrowSvg /> : <ForwardArrowSvg />}
          </div>
        )}
        <div
          className="container-fluid d-flex align-items-center flex-wrap justify-content-between"
          id="kt_header_container"
        >
          {((isMount && window.innerWidth < 690) || hideMenus) && (
            <div
              onClick={() => setHideMenus(!hideMenus)}
              style={{
                transition: "0.6s",
                transform: `translateX(${!hideMenus ? "100" : "0"}px)`,
              }}
              className="btn btn-icon btn-active-icon-primary"
            >
              <span className="svg-icon svg-icon-1 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                    fill="black"
                  />
                  <path
                    opacity="0.3"
                    d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                    fill="black"
                  />
                </svg>
              </span>
            </div>
          )}
          <div
            className="page-title d-flex flex-column align-items-start justify-content-center flex-wrap me-2 pb-5 pb-lg-0 pt-7 pt-lg-0"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', lg: '#kt_header_container'}"
          >
            <div className="d-flex flex-column text-light fw-bolder my-0 fs-1">
              <p className="d-flex flex-column text-light fw-bolder mb-0 mt-2 fs-2">
                {current?.name}
              </p>
              {current?.name === "Dashboard" ? (
                <small className="text-muted fs-6 fw-bold ms-1 pt-1">
                  Waiting for approval...
                </small>
              ) : current?.parent ? (
                <ul className="breadcrumb breadcrumb-separatorless fw-bolder fs-7 pt-1 mt-1">
                  <li className="breadcrumb-item text-muted">
                    <p className="text-gray-400 text-hover-light">
                      {current?.parent ?? "Dashboard"}
                    </p>
                  </li>
                  <li className="breadcrumb-item mb-3">
                    <span className="bullet bg-gray-600 w-5px h-2px" />
                  </li>
                  <li className="breadcrumb-item">
                    <p>{current?.name}</p>
                  </li>
                </ul>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="d-flex d-lg-none align-items-center ms-p1 me-2"></div>

          {isMount &&
            JSON.parse(localStorage.getItem("user") || "{}")?.role != "User" &&
            localStorage.getItem("brand") && (
              <div className="d-flex">
                <button
                  className="btn btn-secondary ml-auto mr-10px"
                  onClick={backToAdmin}
                >
                  Back to{" "}
                  {JSON.parse(localStorage.getItem("user") || "{}")?.role}
                </button>
              </div>
            )}
        </div>
      </Wrapper>
    </>
  );
}

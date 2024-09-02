import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Menu, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
  adminMenus,
  brandManagerMenu,
  managerMenus,
  userMenus,
} from "@/src/helpers/sidebar.helper";
import { setSwitchUser } from "@/src/store/slice/users.slice";
import Wrapper from "./style";
import { deleteCookie } from "cookies-next";
import { cookies } from "@/src/constants/cookies";
import useMount from "@/src/hooks/useMount";

export default function Sidebar(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("dashboard");
  const { user, collapsed, hideMenus, userType, brand } = props;
  const isMount = useMount();

  useEffect(() => {
    const splitLocal = router?.route?.split("/");
    if (splitLocal[1]) {
      if (splitLocal.length > 2) {
        setCurrent(splitLocal[2]);
      } else {
        setCurrent(splitLocal[1]);
      }
    } else {
      setCurrent("dashboard");
    }
  }, [router?.route]);

  const defaultSubMenuSelected = () => {
    let subMenuPath = router?.route.split("/");
    if (subMenuPath.length === 3) {
      return [subMenuPath?.[1]];
    }
    return [];
  };

  const menus = {
    Admin: adminMenus,
    Manager: managerMenus,
    User: userMenus,
    BrandManager: brandManagerMenu,
  };

  const menuItems = () => {
    return menus[userType];
  };

  const checkMenu = () => {
    const menu = menus[userType];

    // To be Fixed later
    if (router?.route === "/brands/edit") {
      return ["brands/edit?activeTab=general", "brands"];
    }
    if (router?.route === "/users/edit") {
      return ["users"];
    }

    if (defaultSubMenuSelected()?.length == 0) {
      return [current];
    }
    if (
      menu?.filter((d) => d?.key === defaultSubMenuSelected()?.[0]).length == 0
    ) {
      return [""];
    }
    return [current];
  };

  return (
    <Wrapper
      style={{
        height: "100%",
        width: collapsed ? "105px" : "289px",
        minWidth: collapsed ? "105px" : "289px",
        zIndex: isMount && window.innerWidth >= 992 ? "999" : "1000",
        position:
          690 > ((isMount && window.innerWidth) || hideMenus)
            ? "absolute"
            : "relative",
        transition: "width 0.4s, 0.4s",
        background: "#fff",
        overflowY: "auto",
        overflowX: "hidden",
        transform: `translateX(${hideMenus ? "-106" : "0"}px)`,
        boxShadow: "0 0 15px 0 rgb(34 41 47 / 5%)",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          height: !collapsed ? "350px" : "185px",
          display: "grid",
          justifyItems: "center",
          transition: "width 0.3s, 0.3s",
          animation: ".4s linear",
        }}
      >
        <div>
          <div
            className="aside-logo flex-column-auto mx-auto"
            id="kt_aside_logo"
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: "3px",
            }}
          >
            <Link href="/">
              <Image
                src={collapsed ? "/favicon.png" : "/images/VendoVelocity_STACKED_Blck_Org_120x80.png"}
                width={collapsed ? 45 : 220}
                className="logo shimmer"
                height={collapsed ? 45 : 120}
                style={{
                  transition: "width 0.4s, 0.4s",
                }}
                alt="Logo"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="aside-user my-5 my-lg-10" id="kt_aside_user">
          <div className="d-flex align-items-center flex-column">
            <div
              style={{ display: "grid", justifyItems: "center" }}
              className="mb-4 symbol symbol-75px"
            >
              {collapsed && (
                <Tooltip
                  title={
                    <div
                      className="text-center"
                      style={{ transition: "width 0.4s, 0.4s" }}
                    >
                      <Link
                        href={{ pathname: "/users/edit", query: user }}
                        as={`/users/edit`}
                      >
                        {user?.u_name}
                      </Link>
                      <span className="text-gray-600 fw-bold d-block fs-7 mb-1">
                        {user?.u_email}
                      </span>
                      <span className="text-gray-600 fw-bold d-block fs-7 mb-1 mt-2">
                        {brand?.name}
                      </span>
                    </div>
                  }
                  placement="right"
                >
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    color="#A1A5B7"
                    style={{ marginTop: "20px" }}
                    className=" w-20px h-20px"
                  />
                </Tooltip>
              )}
            </div>

            {!collapsed && (
              <div className="text-center">
                {isMount && user?.u_photo && (
                  <div className="mb-3 rounded-lg">
                    <img width="100" src={user.u_photo}></img>
                  </div>
                )}
                <Link href={"/users/edit?activeTab=general"} className="ml-2" style={{ color: "#000" }}>
                  {isMount ? (
                    <div>
                      <p className="d-inline fs-4">{user?.u_name}</p>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="ms-2 w-15px"
                      />
                    </div>
                  ) : (
                    "Loading.."
                  )}
                </Link>
                <span className="text-gray-600 fw-bold d-block fs-7 mb-1">
                  {isMount ? user?.u_email : "Loading.."}
                </span>

                <span className="fw-bold d-block fs-5 mb-1 mt-3">
                  {isMount ? brand?.name : "Loading.."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMount && (
        <>
          <div
            style={{
              height: !collapsed ? "calc(100% - 410px)" : "calc(100% - 280px)",
              minHeight: "250px",
              overflow: "auto",
              transition: "width 0.4s, 0.4s",
              animation: ".5s linear",
              minWidth: collapsed ? "105px" : "289px",
              maxWidth: collapsed ? "105px" : "289px",
              display: "flex",
              justifyContent: "center",
              paddingLeft: "10px",
            }}
            id="kt_aside_menu_wrapper"
          >
            <Menu
              selectedKeys={checkMenu()}
              mode="inline"
              onClick={(e) => {
                router.push("/" + e.keyPath.reverse().join("/"));
                setCurrent(e.key);
              }}
              inlineCollapsed={collapsed}
              defaultOpenKeys={defaultSubMenuSelected()}
              items={menuItems()}
            />
          </div>
          <div
            style={{
              height: "60px",
              transition: "width 0.4s, 0.4s",
              animation: ".5s linear",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            <button
              className={`btn btn-light-danger btn-icon-gray-600 btn-text-gray-600 w-200px ${
                collapsed ? "mx-3" : "mx-0"
              }`}
              style={
                {
                  // backgroundImage: "linear-gradient(45deg,#000000,#3e3e3e)",
                  // color: "#FFF",
                }
              }
              id="btnLogout"
              onClick={() => {
                dispatch(setSwitchUser({}));
                isMount && localStorage.clear();
                deleteCookie(cookies["TOKEN"]);
                router.push("/login");
              }}
            >
              <LogoutOutlined
                className={`${
                  isMount && window.innerWidth >= 992 && !collapsed
                    ? "me-2"
                    : ""
                }`}
                style={{ transform: "rotate(-90deg)" }}
              />{" "}
              {!collapsed ? "Logout" : ""}
            </button>
          </div>
        </>
      )}
    </Wrapper>
  );
}

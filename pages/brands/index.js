import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, message, Modal, Select, Tooltip } from "antd";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import Pagination from "@/src/components/pagination";
import { DefaultPerPage } from "@/src/config";
import { timeFormat, timeSince } from "@/src/helpers/formatting.helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faArrowLeftRotate,
} from "@fortawesome/free-solid-svg-icons";
import { getBrandList, getUserBrandList } from "@/src/services/brands.services";
import _ from "lodash";
import { isClient } from "@/src/helpers/isClient";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import {
  selectBrandList,
  selectUserBrandList,
} from "@/src/store/slice/brands.slice";
import { SwitchUserSvg } from "@/src/assets";
import NoData from "@/src/components/no-data";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  deleteBrandRequest,
  archiveBrandRequest,
  restoreBrandRequest,
} from "@/src/api/brands.api";
import useMount from "@/src/hooks/useMount";
import { fetchAmazonSpApiCredentialsRequest } from "@/src/api/brands.api";
import { setCookie } from "cookies-next";
import { cookies } from "@/src/constants/cookies";

const { confirm } = Modal;

const statusOptions = [
  {
    label: "Ready",
    value: "Created",
  },
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Deleted",
    value: "Deleted",
  },
];

// except Dollar as its default
const currencySymbols = {
  UK: "GBP",
};

export default function Users(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMount = useMount();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(DefaultPerPage);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("desc");

  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("Created");

  const brandList = useSelector(selectBrandList);
  const userBrandList = useSelector(selectUserBrandList);

  const userRole = isMount
    ? JSON.parse(localStorage.getItem("user") || "{}")?.role
    : "User";

  useEffect(() => {
    if (localStorage.getItem("brand")) {
      router.push("/sales-analytics/sales");
    }
  }, []);

  useEffect(() => {
    if (brandList) {
      setList(brandList.data);
      setLoading(false);
      setTotalPage(brandList.count);
    }
  }, [brandList]);

  useEffect(() => {
    if (userBrandList.status) {
      setList(userBrandList.data.map((d) => ({ ...d.brand, role: d.role })));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userBrandList]);

  const switchBrand = (brand) => {
    message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });

    fetchAmazonSpApiCredentialsRequest(brand.id)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem(
            "currency_symbol",
            currencySymbols[res.data[0]?.marketplace] || "USD"
          );
          localStorage.setItem(
            "brand",
            JSON.stringify({ role: userRole, ...brand })
          );
          setCookie(cookies.BRAND_ID, brand.id);
          window.location.href = "/sales-analytics/sales";
        } else {
          message.error("something Went Wrong. Please try again later");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };

  useEffect(() => {
    setLoading(true);

    if (userRole === "Admin") {
      dispatch(
        getBrandList({
          page: page,
          perPage: pageSize,
          search_term: searchText,
          status: status,
        })
      );
    } else if (userRole === "Manager") {
      dispatch(getUserBrandList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const onPageNo = (e) => {
    setPage(e);
    dispatch(
      getBrandList({
        page: e,
        perPage: pageSize,
        search_term: searchText,
        orderBy: orderBy,
        order: order,
        status: status,
      })
    );
    setPage(e);
  };

  const onPerPage = (e) => {
    setPage(1);
    setPageSize(e);
    setLoading(true);
    setOrderBy("id");
    setOrder("desc");
    dispatch(
      getBrandList({
        page: 1,
        perPage: e,
        search_term: searchText,
        orderBy: orderBy,
        order: order,
        status: status,
      })
    );
  };

  const search = () => {
    setLoading(true);
    setPage(1);
    setOrderBy("id");
    setOrder("desc");
    dispatch(
      getBrandList({
        page: 1,
        perPage: pageSize,
        search_term: searchText,
        status: status,
        orderBy: orderBy,
        order: order,
      })
    );
  };

  const handleChange = (_pagination, _filters, sorter) => {
    dispatch(
      getBrandList({
        page: page,
        perPage: pageSize,
        search_term: searchText,
        status: status,
        orderBy: sorter?.columnKey,
        order: sorter?.order?.slice(0, -3),
      })
    );
  };

  useEffect(() => {
    userRole === "Admin" && search();
  }, [status]);

  const deleteBrand = (brandID) => {
    setLoading(true);
    (status == "Deleted"
      ? archiveBrandRequest(brandID)
      : deleteBrandRequest(brandID)
    )
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          dispatch(
            getBrandList({
              page: page,
              perPage: pageSize,
              search_term: searchText,
              status: status,
              orderBy: orderBy,
              order: order,
            })
          );
          message.success(
            `Brand has been ${
              status == "Deleted" ? "archived" : "deleted"
            } Successfully`
          );
        } else {
          setLoading(false);
          message.error("Unable to delete brand");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const restoreBrand = (brandID) => {
    setLoading(true);
    restoreBrandRequest(brandID)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          dispatch(
            getBrandList({
              page: page,
              perPage: pageSize,
              search_term: searchText,
              status: status,
              orderBy: orderBy,
              order: order,
            })
          );
          message.success(`Brand has been restored Successfully`);
        } else {
          setLoading(false);
          message.error("Unable to restore brand");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const showDeleteConfirm = (id, name) => {
    confirm({
      title: `Are you sure to ${
        status == "Deleted" ? "archive" : "delete"
      } ${name} brand?`,
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteBrand(id);
      },
      onCancel() {},
    });
  };

  const showRestoreConfirm = (id, name) => {
    confirm({
      title: `Are you sure to restore ${name} brand?`,
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        restoreBrand(id);
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "#",
      width: 60,
      align: "left",
      sorter: true,
      key: "id",
      render: (text) => {
        return <span>{text?.id}</span>;
      },
    },
    {
      title: "Brand Name",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.u_amazon_seller_name || "N/A"}</b>;
      },
    },
    {
      title: "Name",
      width: 120,
      align: "left",
      key: "name",
      sorter: true,
      render: (text) => {
        return <span>{text?.name || "N/A"}</span>;
      },
    },
    {
      title: "Switch Brand",
      width: 100,
      align: "center",
      render: (text) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              switchBrand(text);
            }}
          >
            <SwitchUserSvg />
          </span>
        );
      },
    },
    {
      title: "Created At",
      width: 130,
      align: "left",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.created_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.created_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Updated At",
      width: 130,
      align: "left",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.updated_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.updated_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Action",
      width: 70,
      align: "left",
      render: (text) => {
        return (
          <div className="d-flex">
            {text.role !== "User" && status != "Deleted" && (
              <Tooltip title="Edit">
                <Link
                  href={`/brands/edit?brandId=${text.id}&activeTab=general`}
                >
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    style={{ marginRight: "10px" }}
                    className="text-dark fs-3 cursor-pointer w-15px"
                  />
                </Link>
              </Tooltip>
            )}

            {userRole === "Admin" && status == "Deleted" && (
              <Tooltip title="Restore">
                <FontAwesomeIcon
                  onClick={() => showRestoreConfirm(text.id, text.name)}
                  icon={faArrowLeftRotate}
                  className="text-primary fs-3 cursor-pointer w-15px me-3"
                />
              </Tooltip>
            )}

            {userRole === "Admin" && (
              <Tooltip title="Delete">
                <FontAwesomeIcon
                  onClick={() => showDeleteConfirm(text.id, text.name)}
                  icon={faTrashCan}
                  className="text-danger fs-3 cursor-pointer w-15px"
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ].filter(
    (c) =>
      status === "Created" || status === "Deleted" || c.title !== "Switch Brand"
  );

  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          {userRole === "Admin" && (
            <div className="row mb-4">
              <div className="card card-flush h-xl-100">
                <div className="card-body px-4 py-4">
                  <div className="d-flex flex-wrap gap-3">
                    <div>
                      <Input
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={(ev) => {
                          if (ev?.key === "Enter") {
                            ev?.preventDefault();
                            ev?.target?.blur();
                          }
                        }}
                        onBlur={() => {
                          search();
                        }}
                        value={searchText}
                        placeholder="search..."
                      />
                    </div>
                    <div>
                      <Select
                        size="large"
                        style={{ width: 200 }}
                        value={status || null}
                        placeholder="Select Brand Status"
                        onChange={(e) => {
                          setStatus(e);
                        }}
                        options={statusOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7">
                <div className="h-80px px-10 pt-4 d-flex flex-row justify-content-between align-items-center">
                  <h4 className="fw-bold">MANAGE BRANDS</h4>
                  {userRole === "Admin" && (
                    <p
                      className="btn btn-light-danger btn-dark"
                      onClick={() => router.push("/brands/create")}
                    >
                      Add Brand
                    </p>
                  )}
                </div>
                <div className="card-body pt-2">
                  {loading ? (
                    <Loading />
                  ) : list?.length != 0 ? (
                    <ASINTable
                      columns={columns}
                      dataSource={list}
                      onChange={handleChange}
                      ellipsis
                      rowKey="key"
                      loading={loading}
                      pagination={false}
                      scroll={{
                        x:
                          columns
                            ?.map((d) => d.width)
                            .reduce((a, b) => a + b, 0) + 300,
                      }}
                    />
                  ) : (
                    <NoData />
                  )}

                  {userRole === "Admin" && (
                    <Pagination
                      loading={loading || list?.length === 0}
                      pageSize={pageSize}
                      page={page}
                      totalPage={totalPage}
                      onPerPage={onPerPage}
                      onPageNo={onPageNo}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

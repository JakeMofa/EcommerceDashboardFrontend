import React, { useState, useEffect } from "react";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { Menu, Dropdown } from "antd";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@/src/components/pagination";
import { DefaultPerPage } from "@/src/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { getShippingList } from "@/src/services/shipping.services";
import AddNew from "@/src/components/shipping-from-address/addNew";
import { selectShippingList } from "@/src/store/slice/shipping.slice";
import NoData from "@/src/components/no-data";
import { ExportToExcel } from "@/src/hooks/Excelexport";

export default function ShippingFromAddress() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(DefaultPerPage);

  const shipList = useSelector(selectShippingList);
  useEffect(() => {
    setLoading(true);
    dispatch(
      getShippingList({
        page: page,
        perPage: pageSize,
      })
    );
    setList(shipList);
  }, []);

  useEffect(() => {
    if (shipList) {
      setList(shipList.data);
      setLoading(false);
      setTotalPage(shipList.count);
    }
  }, [shipList]);

  const columns = [
    {
      title: "#",
      width: 60,
      align: "left",
      render: (_, __, i) => {
        return <span>{(page - 1) * pageSize + 1 + i}</span>;
      },
    },
    {
      title: "Address Name",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.addressName || "N/A"}</b>;
      },
    },
    {
      title: "Address Line 1",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.addressLine1 || "N/A"}</b>;
      },
    },
    {
      title: "Address Line 2",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.addressLine2 || "N/A"}</b>;
      },
    },
    {
      title: "City",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.city || "N/A"}</b>;
      },
    },
    {
      title: "State",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.state || "N/A"}</b>;
      },
    },
    {
      title: "Country",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.country || "N/A"}</b>;
      },
    },
    {
      title: "Zip poster",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.zipPoster || "N/A"}</b>;
      },
    },
    {
      title: "Action",
      width: 120,
      align: "left",
      render: (text) => {
        return (
          <div className="d-flex">
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-danger fs-3 cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const menu = (
    <Menu>
      <Menu.Item key="1">Export to csv</Menu.Item>
      <ExportToExcel
        columns={[]}
        rows={[]}
        fileName={"inventory-management-shipping-from-address"}
        loading={loading}
      >
        <button className="btn btn-light-danger btn-sm fw-bolder ">
          Export Data
        </button>
        <Menu.Item key="2">Export to xlsx</Menu.Item>
      </ExportToExcel>
    </Menu>
  );
  const onPageNo = (e) => {
    dispatch(
      getShippingList({
        page: e,
        perPage: pageSize,
      })
    );
    setList(shipList);
    setPage(e);
  };

  const onPerPage = (e) => {
    setPage(1);
    setPageSize(e);
    dispatch(
      getShippingList({
        page: 1,
        perPage: e,
      })
    );
    setList(shipList);
  };
  return (
    <DashboardLayout>
      <div className="mx-5 my-5 ">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header row m-4">
                <div className=" d-flex justify-content-between">
                  <h3 className="card-title align-items-start flex-column mt-5">
                    <span className="mx-2 card-label fw-bolder fs-3 mb-1">
                      Shipping From Address
                    </span>
                  </h3>
                  <div className="d-flex">
                    <Dropdown className="btn btn-dark me-2" overlay={menu}>
                      <p
                        className="btn btn-dark d-flex align-items-center"
                        id="kt_drawer_example_basic_button"
                      >
                        Export
                      </p>
                    </Dropdown>

                    <p
                      className="btn btn-dark d-flex align-items-center"
                      onClick={() => {
                        setModalOpen(!modalOpen);
                      }}
                    >
                      Add New
                    </p>
                  </div>
                </div>
                {modalOpen && (
                  <AddNew columns={columns} modalValue={modalOpen} />
                )}
              </div>
              <div className="card-body pt-2">
                {loading ? (
                  <Loading />
                ) : list?.length !== 0 && list != undefined ? (
                  <div>
                    <ASINTable
                      columns={columns}
                      dataSource={list}
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
                  </div>
                ) : (
                  <NoData />
                )}
                <Pagination
                  loading={loading || list?.length === 0}
                  pageSize={pageSize}
                  page={page}
                  totalPage={totalPage}
                  onPerPage={onPerPage}
                  onPageNo={onPageNo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

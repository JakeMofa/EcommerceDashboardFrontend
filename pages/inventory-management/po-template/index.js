import { Pagination } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPoTemplateList } from "@/src/services/poTemplate.services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "@/src/components/loading";
import _ from "lodash";
import { DefaultPerPage } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import NoData from "@/src/components/no-data";
import { useRouter } from "next/router";
import ASINTable from "@/src/components/table";
import { ExportToExcel } from "@/src/hooks/Excelexport";

export default function PoTemplate() {
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(DefaultPerPage);
  const router = useRouter();
  const poList = useSelector((state) => state.PoTemplate);
  useEffect(() => {
    setTableLoading(true);
    dispatch(
      getPoTemplateList({
        page: page,
        perPage: pageSize,
      })
    );
    setList(poList);
  }, []);
  useEffect(() => {
    if (poList) {
      setList(poList.data);
      setTableLoading(false);
      setTotalPage(poList.count);
    }
  }, [poList]);
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
      title: "Po Name",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.poName || "N/A"}</b>;
      },
    },
    {
      title: "Ship From",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.shipFrom || "N/A"}</b>;
      },
    },
    {
      title: "Ship To",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.shipTo || "N/A"}</b>;
      },
    },
    {
      title: "Created At",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.createdAt || "N/A"}</b>;
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
  const onPageNo = (e) => {
    dispatch(
      getPoTemplateList({
        page: e,
        perPage: pageSize,
      })
    );
    setList(poList);
    setPage(e);
  };
  const onPerPage = (e) => {
    setPage(1);
    setPageSize(e);
    dispatch(
      getPoTemplateList({
        page: 1,
        perPage: e,
      })
    );
    setList(poList);
  };
  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n/* .table th, .table td{\nborder:1px solid red\n} */\n",
            }}
          />
          <div className="row gx-5 gx-xl-5">
            <div className="col-lg-12">
              <div className="card mb-1">
                <div className="card-header border-bottom border-bottom-dashed">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-0">
                      PO Template
                    </span>
                  </h3>
                  <div className="card-toolbar">
                    <button
                      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                      id="kt_drawer_example_basic_button"
                      onClick={() =>
                        router.push(
                          "../inventory-management/po-template/create"
                        )
                      }
                    >
                      Create PO Template
                    </button>
                    <ExportToExcel
                      columns={[]}
                      rows={[]}
                      fileName={"inventory-management-po-template"}
                      loading={tableLoading}
                    >
                      <button className="btn btn-light-danger btn-sm fw-bolder ">
                        Export Data
                      </button>
                    </ExportToExcel>
                  </div>
                </div>
                <div className="card-body pt-2 table-responsive">
                  <div className="card-body table-responsive pt-0 px-4">
                    {tableLoading ? (
                      <Loading />
                    ) : list?.length !== 0 && list != undefined ? (
                      <div>
                        <ASINTable
                          columns={columns}
                          dataSource={list}
                          ellipsis
                          rowKey="key"
                          loading={tableLoading}
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
                      loading={tableLoading || list?.length === 0}
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
        </div>
      </div>
    </DashboardLayout>
  );
}

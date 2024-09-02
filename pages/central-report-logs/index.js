import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ASINTable from "@/src/components/table";
import NoData from "@/src/components/no-data";
import Pagination from "@/src/components/pagination";
import { timeFormat, timeSince } from "@/src/helpers/formatting.helpers";
import { selectCentralReportLogs } from "@/src/store/slice/centralReportLogs.slice";
import { getCentralReportLogs } from "@/src/services/centralReportLogs.services";
import _ from "lodash";
import { DefaultPerPage } from "@/src/config";
import TopBarFilter from "@/src/components/central-report-logs/top-bar-filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message, Tooltip, Button } from "antd";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { getBrandList } from "@/src/services/brands.services";
import { selectBrandList } from "@/src/store/slice/brands.slice";
import Link from "next/link";
import { fileDownloadUrl } from "@/src/helpers/s3Upload.helpers";

const report_types = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Uploaded Shipment",
    value: "uploaded_shipment",
  },
  {
    label: "Uploaded Ads",
    value: "uploaded_ads",
  },
  {
    label: "Uploaded DSP",
    value: "uploaded_dsp",
  },
  {
    label: "Uploaded Category",
    value: "uploaded_category",
  },
];

const statuses = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Inprogress",
    value: "in_progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Failed",
    value: "failed",
  },
];

export default function CentralReportLogs() {
  const [tableLoading, setTableLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const reportLogs = useSelector(selectCentralReportLogs);
  const brandList = useSelector(selectBrandList);

  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    pageSize: DefaultPerPage,
    orderBy: "created_at",
    order: "descend",
    reportType: "",
    brand_id: "",
    status: "",
  });

  useEffect(() => {
    dispatch(
      getBrandList({
        perPage: 9999,
        orderBy: "u_amazon_seller_name",
        order: "asc",
      })
    );
  }, []);

  useEffect(() => {
    if (brandList.data.length > 0) {
      setBrandsLoading(false);
    }
  }, [brandList.data]);

  useEffect(() => {
    let time = setTimeout(() => {
      setTableLoading(true);
      message.loading({ content: "Loading...", key: "loading", duration: 0 });
      dispatch(
        getCentralReportLogs({
          ...filter,
        })
      );
    }, 600);
    return () => {
      clearTimeout(time);
    };
  }, [filter]);

  useEffect(() => {
    if (reportLogs?.status === true) {
      setList(reportLogs.results);
      setTableLoading(false);
    } else if (reportLogs.status === false) {
      setList([]);
      setTableLoading(false);
    }
    message.destroy("loading");
  }, [reportLogs]);

  const handleChange = (_pagination, _filters, sorter) => {
    setFilter({
      ...filter,
      orderBy: sorter?.columnKey,
      order: sorter?.order,
    });
  };

  const onPageNo = (e) => {
    setFilter({ ...filter, page: e });
  };

  const onPerPage = (e) => {
    setFilter({ ...filter, page: 1, pageSize: e });
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
      title: "Report Type",
      width: 130,
      align: "left",
      key: "report_type",
      render: (text) => {
        return (
          <span>
            {report_types.find((r) => r.value === text?.report_type)?.label}
          </span>
        );
      },
    },
    {
      title: "Status",
      width: 100,
      align: "left",
      key: "status",
      render: (text) => {
        return (
          <span className="">
            <span className="">
              {statuses.find((r) => r.value === text?.status)?.label}{" "}
            </span>

            {text.status == "failed" && (
              <span>
                <Tooltip
                  title={text?.error || "N/A"}
                  className="ms-2"
                  overlayStyle={{ maxWidth: "800px" }}
                >
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    color="#A1A5B7"
                    className="w-20px h-20px position-relative"
                    style={{
                      top: "3px",
                    }}
                  />
                </Tooltip>
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: "Brand",
      width: 150,
      align: "left",
      key: "brand",
      render: (text) => {
        return (
          <span>
            {brandList?.data?.find((r) => r.id == text?.brand)?.name || "N/A"}
          </span>
        );
      },
    },
    {
      title: "File Name",
      width: 180,
      align: "left",
      key: "file_url",
      render: (text) => {
        return <span>{text?.file_url || "N/A"}</span>;
      },
    },
    {
      title: "File",
      width: 100,
      align: "left",
      key: "file_url",
      render: (text) => {
        return (
          <Link
            href={fileDownloadUrl(text?.file_url)}
            download={true}
            className="button"
          >
            <Button type="primary" shape="round" size="small">
              Download
            </Button>
          </Link>
        );
      },
    },
    {
      title: "Initiated At",
      width: 130,
      align: "left",
      key: "created_at",
      sorter: true,
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
      title: "Last Updated At",
      width: 170,
      align: "left",
      key: "updated_at",
      sorter: true,
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
  ];

  const brands = brandList.data.map((brand) => {
    return { label: brand.u_amazon_seller_name, value: brand.id };
  });

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          {TopBarFilter(filter, setFilter, report_types, statuses, brands)}
          <div className="row mb-4">
            <div className="col-lg-12"></div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7 pt-5">
                <div className="card-body pt-2">
                  <div className="mb-5 d-flex flex-row justify-content-between">
                    <h1>Central Report Logs</h1>
                  </div>
                  {list?.length != 0 ? (
                    <ASINTable
                      columns={columns}
                      dataSource={list}
                      ellipsis
                      onChange={handleChange}
                      rowKey="key"
                      loading={tableLoading || brandsLoading}
                      pagination={false}
                      scroll={{
                        x:
                          columns
                            ?.map((d) => d.width)
                            .reduce((a, b) => a + b, 0) + 300,
                      }}
                    />
                  ) : (
                    <div>
                      <NoData />
                    </div>
                  )}
                  <Pagination
                    loading={tableLoading || list?.length === 0}
                    pageSize={parseInt(filter.pageSize)}
                    page={parseInt(filter.page)}
                    totalPage={parseInt(reportLogs.count)}
                    onPerPage={onPerPage}
                    onPageNo={onPageNo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ASINTable from "@/src/components/table";
import NoData from "@/src/components/no-data";
import {
  currencyFormat,
  numberFormat,
  timeFormat,
} from "@/src/helpers/formatting.helpers";
import { selectInventoryRestockReport } from "@/src/store/slice/inventoryRestockReport.slice";
import { getInventoryRestockReport } from "@/src/services/inventoryRestockReport.services";
import _ from "lodash";
import { message, Tooltip } from "antd";
import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";
import Drawer from "@/src/components/drawer";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import Loading from "@/src/components/loading";

const configurationTableKey = "inventory-restock-report";

export default function InventoryRestockReport() {
  const [list, setList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();
  const restockReport = useSelector(selectInventoryRestockReport);

  const [isOpen, setIsOpen] = useState(false);
  const [columnConfig, setColumnConfig] = useState([]);
  const [columnConfigLoaded, setColumnConfigLoaded] = useState(false);

  useEffect(() => {
    setColumnConfig(columns.slice(1).map((d) => d.title));

    fetchConfigurations(configurationTableKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setColumnConfig(res.data);
          setColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  }, []);

  useEffect(() => {
    if (columnConfigLoaded && columnConfig.length > 0) {
      updateConfigurations(configurationTableKey, columnConfig);
    }
  }, [columnConfig]);

  useEffect(() => {
    if (restockReport?.status === true) {
      setList(restockReport.data);
      setTableLoading(false);
    } else if (restockReport?.status === false) {
      setList([]);
      setTableLoading(false);
    }
    message.destroy("loading");
  }, [restockReport]);

  useEffect(() => {
    setTableLoading(true);
    dispatch(getInventoryRestockReport());
  }, []);

  const columns = [
    {
      title: "Product",
      width: 260,
      align: "left",
      key: "product",
      render: (text) => {
        return (
          <div className="d-flex align-items-center position-relative">
            <div className="d-flex justify-content-start flex-column">
              <span className="text-dark fw-boldest fs-6 mb-1">
                <Tooltip
                  row={2}
                  rule
                  title={text?.productName}
                  placement="topLeft"
                >
                  {text?.productName || ""}
                </Tooltip>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">ASIN:</b> {text?.asin}
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">SKU:</b> {text?.fnSku}
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">Merchant SKU:</b>{" "}
                  <Tooltip row={2} rule title={text?.merchantSku}>
                    {text?.merchantSku?.substring(0, 20) || ""}
                  </Tooltip>
                </div>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Alert",
      width: 120,
      align: "left",
      key: "alert",
      className: "text-capitalize",
      render: (text) => {
        return <span>{text?.alert?.split("_").join(" ") || "N/A"}</span>;
      },
    },
    {
      title: "Condition",
      width: 150,
      align: "left",
      key: "condition",
      render: (text) => {
        return <span>{text?.condition?.replace(/([A-Z])/g, " $1")}</span>;
      },
    },
    {
      title: "Fulfilled By",
      width: 100,
      align: "left",
      key: "fulfilledBy",
      render: (text) => {
        return <span>{text?.fulfilledBy || "N/A"}</span>;
      },
    },
    {
      title: "Supplier",
      width: 120,
      align: "left",
      key: "supplier",
      className: "text-capitalize",
      render: (text) => {
        return <span>{text?.supplier || "N/A"}</span>;
      },
    },
    {
      title: "Supplier Part No",
      width: 140,
      align: "left",
      key: "supplierPartNo",
      className: "text-capitalize",
      render: (text) => {
        return <span>{text?.supplierPartNo || "N/A"}</span>;
      },
    },
    {
      title: "Country",
      width: 100,
      align: "left",
      key: "country",
      render: (text) => {
        return <span>{text?.country || "N/A"}</span>;
      },
    },
    {
      title: "Price",
      width: 70,
      align: "left",
      key: "price",
      render: (text) => {
        return <span>{currencyFormat(text?.price)}</span>;
      },
    },
    {
      title: "Currency Code",
      width: 130,
      align: "left",
      key: "currencyCode",
      render: (text) => {
        return <span>{text?.currencyCode || "N/A"}</span>;
      },
    },
    {
      title: "Total Days Of Supply",
      width: 180,
      align: "left",
      key: "totalDaysOfSupply",
      render: (text) => {
        return <span>{text?.totalDaysOfSupply || "N/A"}</span>;
      },
    },
    {
      title: "Days Of Supply At Amazon Network",
      width: 260,
      align: "left",
      key: "daysOfSupplyAtAmazonFulfillmentNetwork",
      render: (text) => {
        return (
          <span>{text?.daysOfSupplyAtAmazonFulfillmentNetwork || "N/A"}</span>
        );
      },
    },
    {
      title: "Recommended Replenishment Qty",
      width: 250,
      align: "left",
      key: "recommendedReplenishmentQty",
      render: (text) => {
        return <span>{numberFormat(text?.recommendedReplenishmentQty)}</span>;
      },
    },
    {
      title: "Recommended Ship Date",
      width: 200,
      align: "left",
      key: "recommendedShipDate",
      render: (text) => {
        return <span>{text?.recommendedShipDate || "N/A"}</span>;
      },
    },
    {
      title: "Recommended Action",
      width: 170,
      align: "left",
      key: "recommendedAction",
      className: "text-capitalize",
      render: (text) => {
        return <span>{text?.recommendedAction || "N/A"}</span>;
      },
    },
    {
      title: "Unit Storage Size",
      width: 140,
      align: "left",
      key: "unitStorageSize",
      render: (text) => {
        return <span>{text?.unitStorageSize || "N/A"}</span>;
      },
    },
    {
      title: "Report Date",
      width: 170,
      align: "left",
      key: "report_date",
      render: (text) => {
        return <span>{timeFormat(text.report_date)}</span>;
      },
    },
    {
      title: "Sales Last 30 Days",
      width: 150,
      align: "left",
      key: "salesLast30Days",
      render: (text) => {
        return <span>{currencyFormat(text?.salesLast30Days)}</span>;
      },
    },
    {
      title: "Units Sold Last 30 Days",
      width: 180,
      align: "left",
      key: "unitsSoldLast30Days",
      render: (text) => {
        return <span>{numberFormat(text?.unitsSoldLast30Days)}</span>;
      },
    },
    {
      title: "Total Units",
      width: 100,
      align: "left",
      key: "totalUnits",
      render: (text) => {
        return <span>{numberFormat(text?.totalUnits)}</span>;
      },
    },
    {
      title: "Inbound",
      width: 90,
      align: "left",
      key: "inbound",
      render: (text) => {
        return <span>{numberFormat(text?.inbound)}</span>;
      },
    },
    {
      title: "Available",
      width: 100,
      align: "left",
      key: "available",
      render: (text) => {
        return <span>{numberFormat(text?.available)}</span>;
      },
    },
    {
      title: "FC Transfer",
      width: 110,
      align: "left",
      key: "fcTransfer",
      render: (text) => {
        return <span>{numberFormat(text?.fcTransfer)}</span>;
      },
    },
    {
      title: "FC Processing",
      width: 130,
      align: "left",
      key: "fcProcessing",
      render: (text) => {
        return <span>{numberFormat(text?.fcProcessing)}</span>;
      },
    },
    {
      title: "Custom Order",
      width: 120,
      align: "left",
      key: "customOrder",
      render: (text) => {
        return <span>{numberFormat(text?.customOrder)}</span>;
      },
    },
    {
      title: "Un FulFillable",
      width: 120,
      align: "left",
      key: "unFulFillable",
      render: (text) => {
        return <span>{numberFormat(text?.unFulFillable)}</span>;
      },
    },
    {
      title: "Working",
      width: 90,
      align: "left",
      key: "working",
      render: (text) => {
        return <span>{numberFormat(text?.working)}</span>;
      },
    },
    {
      title: "Shipped",
      width: 90,
      align: "left",
      key: "shipped",
      render: (text) => {
        return <span>{numberFormat(text?.shipped)}</span>;
      },
    },
    {
      title: "Receiving",
      width: 100,
      align: "left",
      key: "Receiving",
      render: (text) => {
        return <span>{currencyFormat(text?.receiving)}</span>;
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7 pt-5">
                <div className="card-body pt-2">
                  <div className="mb-5 d-flex flex-row justify-content-between">
                    <h1>Inventory Restock Report</h1>
                    <div className="card-toolbar">
                      <button
                        onClick={() => setIsOpen(true)}
                        className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                        id="kt_drawer_example_basic_button"
                      >
                        {" "}
                        Configuration{" "}
                      </button>
                      <ExportToExcel
                        sheets={[
                          {
                            title: "main",
                            rows: list.map((d) => {
                              return {
                                ["Product Name"]: d.productName,
                                ["ASIN"]: d.asin,
                                ["SKU"]: d.fnSku,
                                ["Merchant ASIN"]: d.merchantSku,
                                ["Alert"]: d.alert,
                                ["Condition"]: d.condition,
                                ["Fulfilled By"]: d.fulfilledBy,
                                ["Supplier"]: d.supplier,
                                ["Supplier Part No"]: d.supplierPartNo,
                                ["Country"]: d.country,
                                ["Price"]: currencyFormat(d.price),
                                ["Currency Code"]: d.currencyCode,
                                ["Total Days Of Supply"]: d.totalDaysOfSupply,
                                ["Days Of Supply At Amazon Network"]:
                                  d.daysOfSupplyAtAmazonFulfillmentNetwork,
                                ["Recommended Replenishment Qty"]:
                                  d.recommendedReplenishmentQty,
                                ["Recommended Ship Date"]:
                                  d.recommendedShipDate,
                                ["Recommended Action"]: d.recommendedAction,
                                ["Unit Storage Size"]: d.unitStorageSize,
                                ["Report Date"]: d.report_date,
                                ["Sales Last 30 Days"]: currencyFormat(
                                  d.salesLast30Days
                                ),
                                ["Units Sold Last 30 Days"]: numberFormat(
                                  d.unitsSoldLast30Days
                                ),
                                ["Total Units"]: numberFormat(d.totalUnits),
                                ["Inbound"]: numberFormat(d.inbound),
                                ["Available"]: numberFormat(d.available),
                                ["FC Transfer"]: numberFormat(d.fcTransfer),
                                ["FC Processing"]: numberFormat(d.fcProcessing),
                                ["Custom Order"]: numberFormat(d.customOrder),
                                ["Un FulFillable"]: numberFormat(
                                  d.unFulFillable
                                ),
                                ["Working"]: numberFormat(d.working),
                                ["Shipped"]: numberFormat(d.shipped),
                                ["Receiving"]: numberFormat(d.receiving),
                              };
                            }),
                          },
                        ]}
                        fileName={"sales-data-by-week"}
                        loading={tableLoading}
                      >
                        <button className="btn btn-light-danger btn-sm fw-bolder ">
                          Export Data
                        </button>
                      </ExportToExcel>
                    </div>
                  </div>
                  {tableLoading ? (
                    <Loading />
                  ) : list?.length != 0 ? (
                    <ASINTable
                      id="inventory-restock-report"
                      resizable
                      columns={columns.filter(
                        (c) =>
                          ["Product"].includes(c.title) ||
                          columnConfig.includes(c.title)
                      )}
                      dataSource={list}
                      ellipsis
                      rowKey="id"
                      loading={tableLoading}
                      pagination={true}
                      scroll={{
                        y:
                          typeof window !== "undefined"
                            ? window.innerHeight - 310
                            : undefined,
                        x:
                          columns
                            .filter(
                              (c) =>
                                c.title == "Product" ||
                                columnConfig.includes(c.title)
                            )
                            ?.reduce((a, b) => a + (b.width || 0), 0) + 300,
                      }}
                    />
                  ) : (
                    <div>
                      <NoData />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <Drawer
            columnsList={columns.slice(1).map((d) => d.title)}
            columnConfig={columnConfig}
            setColumnConfig={setColumnConfig}
            defaultConfig={columns.slice(1).map((d) => d.title)}
            open={isOpen}
            onHide={() => {
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

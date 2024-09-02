import {
  Dropdown,
  Input,
  message,
  theme,
  Tooltip,
  InputNumber,
  Form,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  editInventoryPlanningData,
  getInventoryPlanningData,
} from "@/src/services/InventoryPlanning.services";
import Drawer from "@/src/components/drawer";
import ASINTable from "@/src/components/table";
import Loading from "@/src/components/loading";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { selectInventoryPlanningList } from "@/src/store/slice/planning.slice";
import NoData from "@/src/components/no-data";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";

import { currencyFormat, numberFormat } from "@/src/helpers/formatting.helpers";

const configurationTableKey = "inventory-planning";
const { useToken } = theme;

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const [list, setList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const InventoryPlaningRes = useSelector(selectInventoryPlanningList);

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
    if (InventoryPlaningRes?.status === true) {
      setList(InventoryPlaningRes.data);
      setTableLoading(false);
    } else if (InventoryPlaningRes?.status === false) {
      setList([]);
      setTableLoading(false);
    }
    message.destroy("loading");
  }, [InventoryPlaningRes]);

  useEffect(() => {
    setTableLoading(true);
    dispatch(getInventoryPlanningData());
  }, []);

  const onFinish = (values) => {
    dispatch(editInventoryPlanningData(values));
  };

  const columns = [
    {
      title: "Product",
      width: 260,
      align: "left",
      key: "product",
      sorter: (a, b) => a.asin.localeCompare(b.asin),
      render: (text) => {
        return (
          <div className="d-flex align-items-center position-relative">
            <div className="d-flex justify-content-start flex-column">
              <span className="text-dark fw-boldest fs-6 mb-1">
                <Tooltip
                  row={2}
                  rule
                  title={text?.product_name}
                  placement="topLeft"
                >
                  <div>{text?.product_name}</div>
                </Tooltip>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">ASIN:</b> {text?.asin}
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">SKU:</b> {text?.f_sku}
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">Merchant SKU:</b>{" "}
                  <Tooltip row={2} rule title={text?.merchant_sku}>
                    {text?.merchant_sku?.substring(0, 20) || ""}
                  </Tooltip>
                </div>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "On Hand",
      width: 100,
      align: "left",
      key: "on_hand",
      sorter: (a, b) => a.on_hand - b.on_hand,
      render: (row) => {
        return (
          <Dropdown
            dropdownRender={() => (
              <div style={contentStyle}>
                <div>
                  <div className="px-7 py-5">
                    <div className="fs-5 text-dark fw-bold">On Hand</div>
                  </div>
                  <div className="separator border-gray-200" />
                  <div className="px-7 py-5 min-w-300px">
                    <Form
                      name={`inventory-planning-on-hand-${row.asin}`}
                      onFinish={onFinish}
                      initialValues={{
                        on_hand: row?.on_hand || 0,
                        asin: row?.asin,
                      }}
                    >
                      <Form.Item name="asin" hidden={true}>
                        <Input type="text" />
                      </Form.Item>
                      <Form.Item name="on_hand">
                        <InputNumber
                          className="min-w-250px"
                          placeholder="On Hand"
                          min={0}
                          size="large"
                        />
                      </Form.Item>
                      <div className="d-flex justify-content-end mt-7">
                        <button
                          type="reset"
                          className="btn btn-sm btn-light btn-active-light-primary me-2"
                        >
                          <CloseOutlined />
                        </button>
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                          data-kt-menu-dismiss="true"
                        >
                          <CheckOutlined />
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          >
            <span onClick={(e) => e.preventDefault()}>
              <b
                style={{
                  borderBottom: "1px dashed #ff643c",
                  color: "#ff643c",
                  cursor: "pointer",
                }}
              >
                {row?.on_hand || "Not Set"}
              </b>
            </span>
          </Dropdown>
        );
      },
    },
    {
      title: "Inventory Multiplier",
      width: 170,
      align: "left",
      key: "inventory_multiplier",
      sorter: (a, b) => a.inventory_multiplier - b.inventory_multiplier,
      render: (row) => {
        return (
          <Dropdown
            dropdownRender={() => (
              <div style={contentStyle}>
                <div>
                  <div className="px-7 py-5">
                    <div className="fs-5 text-dark fw-bold">
                      Edit Inventory Multiplier
                    </div>
                  </div>
                  <div className="separator border-gray-200" />
                  <div className="px-7 py-5 min-w-300px">
                    <Form
                      name={`inventory-planning-multiplier-${row.asin}`}
                      onFinish={onFinish}
                      initialValues={{
                        multiplier: row?.inventory_multiplier || 0,
                        asin: row?.asin,
                      }}
                    >
                      <Form.Item name="asin" hidden={true}>
                        <Input type="text" />
                      </Form.Item>
                      <Form.Item name="multiplier">
                        <InputNumber
                          className="min-w-250px"
                          placeholder="Inventory Multiplier"
                          min={0}
                          step={0.05}
                          size="large"
                        />
                      </Form.Item>
                      <div className="d-flex justify-content-end mt-7">
                        <button
                          type="reset"
                          className="btn btn-sm btn-light btn-active-light-primary me-2"
                        >
                          <CloseOutlined />
                        </button>
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                          data-kt-menu-dismiss="true"
                        >
                          <CheckOutlined />
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          >
            <span onClick={(e) => e.preventDefault()}>
              <b
                style={{
                  borderBottom: "1px dashed #ff643c",
                  color: "#ff643c",
                  cursor: "pointer",
                }}
              >
                {row?.inventory_multiplier || "0"}
              </b>
            </span>
          </Dropdown>
        );
      },
    },
    {
      title: "7 Days Units Sold",
      width: 150,
      align: "left",
      key: "last_7_day_units_sold",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.last_7_day_units_sold)}</b>
          </span>
        );
      },
    },
    {
      title: "30 Days Units Sold",
      width: 150,
      align: "left",
      key: "last_30_day_units_sold",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.last_30_day_units_sold)}</b>
          </span>
        );
      },
    },
    {
      title: "60 Days Units Sold",
      width: 150,
      align: "left",
      key: "last_60_day_units_sold",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.last_60_day_units_sold)}</b>
          </span>
        );
      },
    },
    {
      title: "90 Days Units Sold",
      width: 150,
      align: "left",
      key: "day_90_units_sold",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.day_90_units_sold)}</b>
          </span>
        );
      },
    },
    {
      title: "YTD Units Sold",
      width: 130,
      align: "left",
      key: "ytd_units_sold",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.ytd_units_sold)}</b>
          </span>
        );
      },
    },
    {
      title: "YTD Sales",
      width: 120,
      align: "left",
      key: "ytd_sales",
      render: (row) => {
        return (
          <span>
            <b>${currencyFormat(row?.ytd_sales)}</b>
          </span>
        );
      },
    },
    {
      title: "1 Month Supply",
      width: 130,
      align: "left",
      key: "one_month_supply",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.one_month_supply)}</b>
          </span>
        );
      },
    },
    {
      title: "Available",
      width: 110,
      align: "left",
      key: "available",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.available)}</b>
          </span>
        );
      },
    },
    {
      title: "Inbound",
      width: 110,
      align: "left",
      key: "inbound",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.inbound)}</b>
          </span>
        );
      },
    },
    {
      title: "FC transfer",
      width: 130,
      align: "left",
      key: "fc_transfer",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.fc_transfer)}</b>
          </span>
        );
      },
    },
    {
      title: "Total Units",
      width: 120,
      align: "left",
      key: "total_units",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.total_units)}</b>
          </span>
        );
      },
    },
    {
      title: "Inventory Recommendations",
      width: 220,
      align: "left",
      key: "inventory_recommendations",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.inventory_recommendations)}</b>
          </span>
        );
      },
    },
    {
      title: "Total days of supply",
      width: 160,
      align: "left",
      key: "overal_supply_days",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.overal_supply_days)}</b>
          </span>
        );
      },
    },
    {
      title: "Days of supply at Amazon",
      width: 200,
      align: "left",
      key: "overal_amazon_supply_days",
      render: (row) => {
        return (
          <span>
            <b>{numberFormat(row?.overal_amazon_supply_days)}</b>
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          <div className="row">
            <div className="col-lg-12">
              <div className="card" style={{}}>
                <div className="card-header">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-1">
                      Inventory Planning Data
                    </span>
                  </h3>
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
                              ["Product Name"]: d.product_name,
                              ["ASIN"]: d.asin,
                              ["SKU"]: d.f_sku,
                              ["Merchant ASIN"]: d.merchant_sku,
                              ["On Hand"]: numberFormat(d.on_hand),
                              ["Inventory Multiplier"]: numberFormat(
                                d.inventory_multiplier
                              ),
                              ["7 Days Units Sold"]: numberFormat(
                                d.last_7_day_units_sold
                              ),
                              ["30 Days Units Sold"]: numberFormat(
                                d?.last_30_day_units_sold
                              ),
                              ["60 Days Units Sold"]: numberFormat(
                                d?.last_60_day_units_sold
                              ),
                              ["90 Days Units Sold"]: numberFormat(
                                d?.day_90_units_sold
                              ),
                              ["YTD Units Sold"]: numberFormat(
                                d?.ytd_units_sold
                              ),
                              ["YTD Sales"]: currencyFormat(d?.ytd_sales),
                              ["1 Month Supply"]: numberFormat(
                                d?.one_month_supply
                              ),
                              ["Available"]: numberFormat(d?.available),
                              ["Inbound"]: numberFormat(d?.inbound),
                              ["FC Transfer"]: numberFormat(d?.fc_transfer),
                              ["Total Units"]: numberFormat(d?.total_units),
                              ["Inventory Recommendations"]: numberFormat(
                                d?.inventory_recommendations
                              ),
                              ["Total days of supply"]: numberFormat(
                                d?.overal_supply_days
                              ),
                              ["Days of supply at Amazon"]: numberFormat(
                                d?.overal_amazon_supply_days
                              ),
                            };
                          }),
                        },
                      ]}
                      fileName={"inventory-management-planning"}
                      loading={tableLoading}
                    >
                      <button className="btn btn-light-danger btn-sm fw-bolder ">
                        Export Data
                      </button>
                    </ExportToExcel>
                  </div>
                </div>
                <div className="card-body pt-0 px-4" style={{}}>
                  {tableLoading ? (
                    <Loading />
                  ) : list?.length != 0 ? (
                    <ASINTable
                      id="inventory-planning"
                      resizable
                      columns={columns.filter(
                        (c) =>
                          ["Product"].includes(c.title) ||
                          columnConfig.includes(c.title)
                      )}
                      dataSource={list}
                      ellipsis
                      rowKey="asin"
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
                    <NoData />
                  )}
                </div>
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
    </DashboardLayout>
  );
}

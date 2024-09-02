import { useState, useEffect } from "react";
import { Tooltip, message, Table } from "antd";
import Loading from "../../loading";
import ASINTable from "../../table";
import NoData from "@/src/components/no-data";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import Drawer from "@/src/components/drawer";
import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSalesWeekDetail,
  selectSalesSelectedWeekDetail,
} from "@/src/store/slice/salesByWeek.slice";
import _ from "lodash";
import { CustomDrawer } from "@/src/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ExportToExcel, exportToExcel } from "@/src/hooks/Excelexport";
import WeekExpandAsin from "@/src/components/week-expand-asin";
import { fetchSalesWeekDetails } from "@/src/api/salesByWeek.api";
import { getSalesWeekDetails } from "@/src/services/salesByWeek.services";

const configurationTableKey = "sales-by-week-table";

export default function SalesByWeekTable({ loading, showDSP }) {
  const dispatch = useDispatch();
  const SalesWeekDetailsListRes = useSelector(selectSalesWeekDetail);
  const SalesSelectedWeekDetailsRes = useSelector(
    selectSalesSelectedWeekDetail
  );

  const [isOpen, setIsOpen] = useState(false);
  const [columnConfig, setColumnConfig] = useState([]);
  const [columnConfigLoaded, setColumnConfigLoaded] = useState(false);
  const [isDetails, setIsDetails] = useState([]);
  const [expand, setExpand] = useState(null);
  const [weekDetailsLoading, setWeekDetailsLoading] = useState(true);

  useEffect(() => {
    setColumnConfig(columns.slice(3).map((d) => d.title));

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
    message.destroy();
    setWeekDetailsLoading(false);
  }, [SalesSelectedWeekDetailsRes]);

  useEffect(() => {
    if (SalesWeekDetailsListRes?.status === true) {
      setIsDetails(
        SalesWeekDetailsListRes?.data
          .slice()
          .sort((a, b) => a.year * 55 + a.week - (b.year * 55 + b.week))
      );
    } else if (SalesWeekDetailsListRes?.status === false) {
      setIsDetails([]);
    }
  }, [SalesWeekDetailsListRes]);

  useEffect(() => {
    if (expand !== null) {
      message.destroy();
      message.loading("Loading...");
      setWeekDetailsLoading(true);
      dispatch(
        getSalesWeekDetails({
          year: expand.year,
          week: expand.week,
        })
      );
    }
  }, [expand]);

  const columns = [
    {
      title: "",
      width: "80px",
      align: "left",
      ellipsis: true,
      key: "expand_and_export",
      render: (text) => {
        return (
          <>
            <CustomDrawer
              bodyStyle={{ padding: 0 }}
              onClose={() => setExpand(null)}
              title={`${text?.start_date} to ${text?.end_date} (${text?.year}-${text?.week_name})`}
              opener={
                <div
                  className="d-inline"
                  onMouseDown={() => {
                    setExpand(text);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    icon={faExpand}
                    color="#181C32"
                    className="w-15px h-15px"
                  />
                </div>
              }
            >
              {() => {
                return (
                  expand &&
                  !weekDetailsLoading && (
                    <>
                      <WeekExpandAsin
                        dataSource={expand}
                        asinData={SalesSelectedWeekDetailsRes.data || []}
                      />
                    </>
                  )
                );
              }}
            </CustomDrawer>

            <Tooltip title={`Export`}>
              <FontAwesomeIcon
                icon={faFileExcel}
                color="#181C32"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  exportWeekDetails(text);
                }}
                className="w-15px h-15px"
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Week Date Range",
      width: "220px",
      align: "left",
      ellipsis: true,
      key: "week_date_range",
      sorter: (a, b) => a.year * 55 + a.week - (b.year * 55 + b.week),
      render: (text) => {
        return `${text?.start_date} to ${text?.end_date}`;
      },
    },
    {
      title: "Row Labels",
      width: "130px",
      align: "left",
      sorter: (a, b) => a.year * 55 + a.week - (b.year * 55 + b.week),
      render: (text) => {
        return `${text?.year}-${text?.week_name}`;
      },
    },
    {
      title: "Ordered Product Sales",
      width: "210px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.totalOrderedProductSales - b.totalOrderedProductSales,
      key: "totalOrderedProductSales",
      render: (text) => {
        return currencyFormat(text?.totalOrderedProductSales);
      },
    },
    {
      title: "Total Sessions",
      width: "150px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.totalSession - b.totalSession,
      key: "totalSession",
      render: (text) => {
        return numberFormat(text?.totalSession);
      },
    },
    {
      title: "Page Views",
      width: "130px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.totalPageViews - b.totalPageViews,
      key: "totalPageViews",
      render: (text) => {
        return numberFormat(text?.totalPageViews);
      },
    },
    {
      title: "Buy Box %",
      width: "120px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.avgBuyBox - b.avgBuyBox,
      key: "avgBuyBox",
      render: (text) => {
        return percentageFormat(text?.avgBuyBox);
      },
    },
    {
      title: "Units Ordered",
      width: "150px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.totalUnitOrdered - b.totalUnitOrdered,
      key: "totalUnitOrdered",
      render: (text) => {
        return numberFormat(text?.totalUnitOrdered);
      },
    },
    {
      title: "Conversion Rate",
      width: "160px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.avgUnitSession - b.avgUnitSession,
      key: "avgUnitSession",
      render: (text) => {
        return percentageFormat(text?.avgUnitSession);
      },
    },
    {
      title: "Total Orders",
      width: "140px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.totalOrderItems - b.totalOrderItems,
      key: "totalOrderItems",
      render: (text) => {
        return numberFormat(text?.totalOrderItems);
      },
    },
    {
      title: "Ad Spend",
      width: "120px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.spend - b.spend,
      key: "spend",
      render: (text) => {
        return currencyFormat(text?.spend);
      },
    },
    {
      title: "Ad Sales",
      width: "120px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.revenue - b.revenue,
      key: "revenue",
      render: (text) => {
        return currencyFormat(text?.revenue);
      },
    },
    {
      title: "Total ACOS",
      width: "130px",
      align: "left",
      ellipsis: true,
      key: "tacos",
      sorter: (a, b) => a.tacos - b.tacos,
      render: (text) => {
        return percentageFormat(text?.tacos);
      },
    },
    {
      title: "PPC Spend",
      width: "130px",
      align: "left",
      key: "ppcSpend",
      sorter: (a, b) => a.ppcSpend - b.ppcSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.ppcSpend)}</span>;
      },
    },
    {
      title: "PPC Sales",
      width: "130px",
      align: "left",
      key: "ppcRevenue",
      sorter: (a, b) => a.ppcRevenue - b.ppcRevenue,
      render: (text) => {
        return <span>{currencyFormat(text?.ppcRevenue)}</span>;
      },
    },
    ...(showDSP
      ? [
          {
            title: "DSP Spend",
            width: "130px",
            align: "left",
            ellipsis: true,
            sorter: (a, b) => a.dsp_spend - b.dsp_spend,
            key: "dsp_spend",
            render: (text) => {
              return currencyFormat(text?.dsp_spend);
            },
          },
          {
            title: "DSP Sales",
            width: "120px",
            align: "left",
            ellipsis: true,
            sorter: (a, b) => a.dsp_revenue - b.dsp_revenue,
            key: "dsp_revenue",
            render: (text) => {
              return currencyFormat(text?.dsp_revenue);
            },
          },
        ]
      : []),
    {
      title: "Sponsored Product Spend",
      width: "230px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.product_spend - b.product_spend,
      key: "product_spend",
      render: (text) => {
        return currencyFormat(text?.product_spend);
      },
    },
    {
      title: "Sponsored Product Sales",
      width: "230px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.product_revenue - b.product_revenue,
      key: "product_revenue",
      render: (text) => {
        return currencyFormat(text?.product_revenue);
      },
    },
    {
      title: "Sponsored Display Spend",
      width: "230px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.display_spend - b.display_spend,
      key: "display_spend",
      render: (text) => {
        return currencyFormat(text?.display_spend);
      },
    },
    {
      title: "Sponsored Display Sales",
      width: "220px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.display_revenue - b.display_revenue,
      key: "display_revenue",
      render: (text) => {
        return currencyFormat(text?.display_revenue);
      },
    },
    {
      title: "Sponsored Brand Spend",
      width: "220px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.brand_spend - b.brand_spend,
      key: "brand_spend",
      render: (text) => {
        return currencyFormat(text?.brand_spend);
      },
    },
    {
      title: "Sponsored Brand Sales",
      width: "210px",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.brand_revenue - b.brand_revenue,
      key: "brand_revenue",
      render: (text) => {
        return currencyFormat(text?.brand_revenue);
      },
    },
  ];

  const exportWeekDetails = (d) => {
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchSalesWeekDetails({
      year: d.year,
      week: d.week,
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          exportToExcel({
            columns: [
              "Year",
              "Week",
              "Title",
              "Parent ASIN",
              "Child ASIN",
              "SKU",
              "Ordered Product Sales",
              "Total Sessions",
              "Page Views",
              "Buy Box %",
              "Units Ordered",
              "Conversion Rate",
              "Total Orders",
              "Ad Spend",
              "Ad Sales",
              "Total ACOS",
            ],
            fileName: `sales-by-week{${d?.start_date}}__{${d?.end_date}}`,
            rows: res.data.map((item) => {
              return {
                Year: item.year,
                Week: item.week,
                Title: item.title,
                "Parent ASIN": item.parent_asin,
                "Child ASIN": item.child_asin,
                SKU: item.sku,
                ["Ordered Product Sales"]: currencyFormat(
                  item?.total_ordered_product_sales
                ),
                ["Total Sessions"]: numberFormat(item?.total_session),
                ["Page Views"]: numberFormat(item?.total_page_views),
                ["Buy Box %"]: percentageFormat(item?.avg_buy_box_percentage),
                ["Units Ordered"]: numberFormat(item?.total_ordered_units),
                ["Conversion Rate"]: percentageFormat(
                  item?.avg_unit_session_percentage
                ),
                ["Total Orders"]: numberFormat(item?.total_order_items),
                ["Ad Spend"]: numberFormat(item?.spend),
                ["Ad Sales"]: numberFormat(item?.revenue),
                ["Total ACOS"]: numberFormat(item?.tacos),
              };
            }),
          });
        } else {
          message.error("No Sales data details available yet.");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bolder fs-3 mb-1">
                Analytics by Week
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
                    columns: [
                      "Week",
                      "Ordered Product Sales",
                      "Total Sessions",
                      "Page Views",
                      "Buy Box %",
                      "Units Ordered",
                      "Conversion Rate",
                      "Total Orders",
                      "Ad Spend",
                      "Ad Sales",
                      "Total ACOS",
                      "PPC Spend",
                      "PPC Sales",
                      ...(showDSP ? ["DSP Spend", "DSP Sales"] : []),
                      "Sponsored Product Spend",
                      "Sponsored Product Sales",
                      "Sponsored Brand Spend",
                      "Sponsored Brand Sales",
                      "Sponsored Display Spend",
                      "Sponsored Display Sales",
                    ],
                    rows: isDetails.map((d) => {
                      return {
                        ["Week"]: `${d.year}-${d.week_name}`,
                        ["Ordered Product Sales"]: currencyFormat(
                          d?.totalOrderedProductSales
                        ),
                        ["Total Sessions"]: numberFormat(d?.totalSession),
                        ["Page Views"]: numberFormat(d?.totalPageViews),
                        ["Buy Box %"]: percentageFormat(d?.avgBuyBox),
                        ["Units Ordered"]: numberFormat(d?.totalUnitOrdered),
                        ["Conversion Rate"]: percentageFormat(
                          d?.avgUnitSession
                        ),
                        ["Total Orders"]: numberFormat(d?.totalOrderItems),
                        ["Ad Spend"]: currencyFormat(d?.spend),
                        ["Ad Sales"]: currencyFormat(d?.revenue),
                        ["Total ACOS"]: percentageFormat(d?.tacos),
                        ["PPC Spend"]: currencyFormat(d?.ppcSpend),
                        ["PPC Sales"]: currencyFormat(d?.ppcRevenue),
                        ...(showDSP
                          ? {
                              ["DSP Spend"]: currencyFormat(d?.dsp_spend),
                              ["DSP Sales"]: currencyFormat(d?.dsp_revenue),
                            }
                          : {}),
                        ["Sponsored Product Spend"]: currencyFormat(
                          d?.product_spend
                        ),
                        ["Sponsored Product Sales"]: currencyFormat(
                          d?.product_revenue
                        ),
                        ["Sponsored Display Spend"]: currencyFormat(
                          d?.display_spend
                        ),
                        ["Sponsored Display Sales"]: currencyFormat(
                          d?.display_revenue
                        ),
                        ["Sponsored Brand Spend"]: currencyFormat(
                          d?.brand_spend
                        ),
                        ["Sponsored Brand Sales"]: currencyFormat(
                          d?.brand_revenue
                        ),
                      };
                    }),
                  },
                ]}
                fileName={"sales-data-by-week"}
                loading={loading}
              >
                <button className="btn btn-light-danger btn-sm fw-bolder ">
                  Export Data
                </button>
              </ExportToExcel>
            </div>
          </div>
          <div className="card-body pt-0 px-4" style={{}}>
            {loading && SalesWeekDetailsListRes.status != true ? (
              <Loading />
            ) : isDetails?.length != 0 ? (
              <ASINTable
                id="sales-by-week"
                columns={columns.filter(
                  (c) =>
                    ["", "Week Date Range", "Row Labels"].includes(c.title) ||
                    columnConfig.includes(c.title)
                )}
                dataSource={isDetails}
                rowKey="key"
                loading={loading}
                resizable
                pagination={false}
                scroll={{
                  y:
                    typeof window !== "undefined"
                      ? window.innerHeight - 310
                      : undefined,
                  x:
                    columns
                      .filter(
                        (c) =>
                          c.title == "Row Labels" ||
                          columnConfig.includes(c.title)
                      )
                      ?.reduce((a, b) => a + (b.width || 0), 0) + 300,
                }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell key={0} />
                      <Table.Summary.Cell key={1} />
                      <Table.Summary.Cell key={2}>
                        <b>WOW CHG</b>
                      </Table.Summary.Cell>

                      {columns
                        .slice(3)
                        .filter((c) => columnConfig.includes(c.title))
                        .map((column) => (
                          <Table.Summary.Cell key={column.title}>
                            <b>
                              {SalesWeekDetailsListRes.summary[column.key] || 0}
                              %
                            </b>
                          </Table.Summary.Cell>
                        ))}
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <Drawer
          columnsList={columns.slice(3).map((d) => d.title)}
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
  );
}

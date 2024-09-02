import { useEffect, useState } from "react";
import TopBarFilter from "@/src/components/advertising-analytics/top-bar-filter";
import Graph from "@/src/components/advertising-analytics/total-revenue/Graph";
import Drawers from "@/src/components/advertising-analytics/total-revenue/Drawer";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { defaultWeek, defaultYear } from "@/src/config";
import { getAdvertising } from "@/src/services/advertisingTotalRevenue.services";
import { selectAdvertisingTotalRevenue } from "@/src/store/slice/advertisingTotalRevenue.slice";
import _ from "lodash";
import { message, Tooltip } from "antd";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
  weekDateRange,
} from "@/src/helpers/formatting.helpers";

import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";

const configurationTableKey = "total-revenue-table";
const configurationGraphKey = "total-revenue-graph";

export default function TotalRevenueAcos() {
  const dispatch = useDispatch();

  const advertisements = useSelector(selectAdvertisingTotalRevenue);

  const [loading, setLoading] = useState(true);
  const [tableConfigOpen, setTableConfigOpen] = useState(false);
  const [graphConfigOpen, setGraphConfigOpen] = useState(false);
  const [columnsList, setColumnsList] = useState([]);
  const [tableColumnConfig, setTableColumnConfig] = useState([]);
  const [tableColumnConfigLoaded, setTableColumnConfigLoaded] = useState(false);
  const [graphColumnConfig, setGraphColumnConfig] = useState([]);
  const [graphColumnConfigLoaded, setGraphColumnConfigLoaded] = useState(false);
  const [skipAPI, setSkipAPI] = useState();
  const [showDSP, setShowDSP] = useState(false);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setShowDSP(brand.advertiser_id && brand.advertiser_id.length > 0);
  }, []);

  const [filter, setFilter] = useState({
    week: _.range(1, defaultWeek() + 1),
    year: [defaultYear()],
  });

  const [advertisementsData, setAdvertisementsData] = useState([]);
  useEffect(() => {
    if (advertisements?.status === true) {
      const data = advertisements?.data?.filter((d) => {
        const { year, week, ...values } = d;
        return Object.values(values).some((s) => parseFloat(s) > 0);
      });

      setAdvertisementsData(
        data.sort((a, b) => a.year * 100 + a.week - (b.year * 100 + b.week)) ||
          []
      );
      setLoading(false);
      if (skipAPI !== undefined) {
        setSkipAPI(true);
        setFilter({
          ...filter,
          week: _.uniq(data.map((d) => d.week)),
        });
      }
    } else if (advertisements?.status === false) {
      setAdvertisementsData([]);
      setLoading(false);
    }
  }, [advertisements]);

  useEffect(() => {
    if (!skipAPI && filter?.week.length > 0 && filter?.year.length > 0) {
      setSkipAPI(false);
      const time = setTimeout(() => {
        setLoading(true);
        dispatch(
          getAdvertising({
            search_year: filter?.year.sort()?.join(","),
            search_week: filter?.week?.join(","),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
    setSkipAPI(false);
  }, [filter]);

  const columns = [
    {
      title: "ROW WEEK",
      width: 120,
      align: "center",
      fixed: true,
      sorter: (a, b) => a.year * 100 + a.week - (b.year * 100 + b.week),
      render: (text) => {
        return (
          <Tooltip title={weekDateRange(text?.year, text?.week)}>
            {`${text?.year}-WK${text?.week}`}
          </Tooltip>
        );
      },
    },
    {
      title: "SPEND",
      width: "100px",
      align: "center",
      sorter: (a, b) => a.twSpend - b.twSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.twSpend)}</span>;
      },
    },
    {
      title: "SPEND CHG",
      width: "140px",
      align: "center",
      sorter: (a, b) => a.spendChange - b.spendChange,
      render: (text) => {
        return (
          <span style={{ color: text.spendChange < 0 ? "red" : "green" }}>
            {percentageFormat(text?.spendChange)}
          </span>
        );
      },
    },
    {
      title: "AD REVENUE",
      width: "140px",
      align: "center",
      sorter: (a, b) => a.twRevenue - b.twRevenue,
      render: (text) => {
        return <span>{currencyFormat(text?.twRevenue)}</span>;
      },
    },
    {
      title: "REVENUE CHG",
      width: "140px",
      align: "center",
      sorter: (a, b) => a.adChange - b.adChange,
      render: (text) => {
        return (
          <span style={{ color: text.adChange < 0 ? "red" : "green" }}>
            {percentageFormat(text?.adChange)}
          </span>
        );
      },
    },
    {
      title: "ORGANIC SALES",
      width: "170px",
      align: "center",
      sorter: (a, b) => a.organicSales - b.organicSales,
      render: (text) => {
        return <span>{currencyFormat(text?.organicSales)}</span>;
      },
    },
    {
      title: "ORGANIC CHG",
      width: "150px",
      align: "center",
      sorter: (a, b) => a.organicSalesChange - b.organicSalesChange,
      render: (text) => {
        return (
          <span
            style={{ color: text.organicSalesChange < 0 ? "red" : "green" }}
          >
            {percentageFormat(text?.organicSalesChange)}
          </span>
        );
      },
    },
    {
      title: "TOTAL SALES",
      width: "140px",
      align: "center",
      sorter: (a, b) => a.totalSales - b.totalSales,
      render: (text) => {
        return <span>{currencyFormat(text?.totalSales)}</span>;
      },
    },
    {
      title: "TOTAL ACOS",
      width: "130px",
      align: "center",
      sorter: (a, b) => a.ACoS_percentage - b.ACoS_percentage,
      render: (text) => {
        return <span>{percentageFormat(text?.ACoS_percentage)}</span>;
      },
    },
    {
      title: "PPC SPEND",
      width: "130px",
      align: "center",
      sorter: (a, b) => a.PPCSpend - b.PPCSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.PPCSpend)}</span>;
      },
    },
    {
      title: "PPC SPEND CHG",
      width: "160px",
      align: "center",
      sorter: (a, b) => a.PPCSpendChange - b.PPCSpendChange,
      render: (text) => {
        return (
          <span style={{ color: text.PPCSpendChange < 0 ? "red" : "green" }}>
            {percentageFormat(text?.PPCSpendChange)}
          </span>
        );
      },
    },
    {
      title: "PPC SALES",
      width: "130px",
      align: "center",
      sorter: (a, b) => a.PPCSales - b.PPCSales,
      render: (text) => {
        return <span>{currencyFormat(text?.PPCSales)}</span>;
      },
    },
    {
      title: "PPC SALES CHG",
      width: "160px",
      align: "center",
      sorter: (a, b) => a.PPCSalesChange - b.PPCSalesChange,
      render: (text) => {
        return (
          <span style={{ color: text.PPCSalesChange < 0 ? "red" : "green" }}>
            {percentageFormat(text?.PPCSalesChange)}
          </span>
        );
      },
    },
    ...(showDSP
      ? [
          {
            title: "DSP SPEND",
            width: "200px",
            align: "center",
            sorter: (a, b) => a.dsp_spend - b.dsp_spend,
            render: (text) => {
              return <span>{currencyFormat(text?.dsp_spend)}</span>;
            },
          },
          {
            title: "DSP SPEND CHANGE",
            width: "200px",
            align: "center",
            sorter: (a, b) => a.dsp_spend_change - b.dsp_spend_change,
            render: (text) => {
              return (
                <span
                  style={{ color: text.dsp_spend_change < 0 ? "red" : "green" }}
                >
                  {percentageFormat(text?.dsp_spend_change)}
                </span>
              );
            },
          },
          {
            title: "DSP SALES",
            width: "200px",
            align: "center",
            sorter: (a, b) => a.dsp_revenue - b.dsp_revenue,
            render: (text) => {
              return <span>{currencyFormat(text?.dsp_revenue)}</span>;
            },
          },
          {
            title: "DSP SALES CHANGE",
            width: "200px",
            align: "center",
            sorter: (a, b) => a.dsp_revenue_change - b.dsp_revenue_change,
            render: (text) => {
              return (
                <span
                  style={{
                    color: text.dsp_revenue_change < 0 ? "red" : "green",
                  }}
                >
                  {percentageFormat(text?.dsp_revenue_change)}
                </span>
              );
            },
          },
        ]
      : []),
    {
      title: "SPONSORED PRODUCTS AD SPEND",
      width: "280px",
      align: "center",
      sorter: (a, b) => a.sponsoredProductAdSpend - b.sponsoredProductAdSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredProductAdSpend)}</span>;
      },
    },
    {
      title: "SPONSORED PRODUCTS AD SALES",
      width: "280px",
      align: "center",
      sorter: (a, b) => a.sponsoredProductAdSales - b.sponsoredProductAdSales,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredProductAdSales)}</span>;
      },
    },
    {
      title: "SPONSORED BRAND AD SPEND",
      width: "250px",
      align: "center",
      sorter: (a, b) => a.sponsoredBrandAdSpend - b.sponsoredBrandAdSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredBrandAdSpend)}</span>;
      },
    },
    {
      title: "SPONSORED BRAND AD SALES",
      width: "260px",
      align: "center",
      sorter: (a, b) => a.sponsoredBrandSales - b.sponsoredBrandSales,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredBrandSales)}</span>;
      },
    },
    {
      title: "SPONSORED DISPLAY AD SPEND",
      width: "260px",
      align: "center",
      sorter: (a, b) => a.sponsoredDisplayAdSpend - b.sponsoredDisplayAdSpend,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredDisplayAdSpend)}</span>;
      },
    },
    {
      title: "SPONSORED DISPLAY AD SALES",
      width: "260px",
      align: "center",
      sorter: (a, b) => a.sponsoredDisplayAdSales - b.sponsoredDisplayAdSales,
      render: (text) => {
        return <span>{currencyFormat(text?.sponsoredDisplayAdSales)}</span>;
      },
    },
    {
      title: "IMPRESSIONS",
      width: "150px",
      align: "center",
      sorter: (a, b) => a.impressions - b.impressions,
      render: (text) => {
        return <span>{numberFormat(text?.impressions)}</span>;
      },
    },
    {
      title: "CLICKS",
      width: "120px",
      align: "center",
      sorter: (a, b) => a.clicks - b.clicks,
      render: (text) => {
        return <span>{numberFormat(text?.clicks)}</span>;
      },
    },
    {
      title: "TOTAL UNIT ORDERS",
      width: "200px",
      align: "center",
      sorter: (a, b) => a.totalUnitOrder - b.totalUnitOrder,
      render: (text) => {
        return <span>{numberFormat(text?.totalUnitOrder)}</span>;
      },
    },
    {
      title: "BRANDED SPEND",
      width: "170px",
      align: "center",
      sorter: (a, b) => a.brandedSpends - b.brandedSpends,
      render: (text) => {
        return <span>{currencyFormat(text?.brandedSpends)}</span>;
      },
    },
    {
      title: "BRANDED SALES",
      width: "170px",
      align: "center",
      sorter: (a, b) => a.brandedSales - b.brandedSales,
      render: (text) => {
        return <span>{currencyFormat(text?.brandedSales)}</span>;
      },
    },
    {
      title: "BRANDED ROAS",
      width: "160px",
      align: "center",
      sorter: (a, b) => a.brandedRoAS - b.brandedRoAS,
      render: (text) => {
        return <span>{numberFormat(text?.brandedRoAS)}</span>;
      },
    },
    {
      title: "NON BRANDED SPEND",
      width: "210px",
      align: "center",
      sorter: (a, b) => a.nonBrandedSpends - b.nonBrandedSpends,
      render: (text) => {
        return <span>{currencyFormat(text?.nonBrandedSpends)}</span>;
      },
    },
    {
      title: "NON BRANDED SALES",
      width: "200px",
      align: "center",
      sorter: (a, b) => a.nonBrandedSales - b.nonBrandedSales,
      render: (text) => {
        return <span>{currencyFormat(text?.nonBrandedSales)}</span>;
      },
    },
    {
      title: "NON BRANDED ROAS",
      width: "200px",
      align: "center",
      sorter: (a, b) => a.nonBrandedRoAS - b.nonBrandedRoAS,
      render: (text) => {
        return <span>{numberFormat(text?.nonBrandedRoAS)}</span>;
      },
    },
  ];

  useEffect(() => {
    const list = columns.slice(0).map((d) => d.title);
    setColumnsList(list);
  }, [showDSP]);

  useEffect(() => {
    const list = columns.slice(0).map((d) => d.title);

    setColumnsList(list);
    setTableColumnConfig(["TOTAL SALES"]);
    setGraphColumnConfig(["TOTAL SALES"]);

    fetchConfigurations(configurationTableKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setTableColumnConfig(res.data);
          setTableColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });

    fetchConfigurations(configurationGraphKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setGraphColumnConfig(res.data);
          setGraphColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  }, []);

  useEffect(() => {
    if (tableColumnConfigLoaded && tableColumnConfig.length > 0) {
      updateConfigurations(configurationTableKey, tableColumnConfig);
    }
  }, [tableColumnConfig]);

  useEffect(() => {
    if (graphColumnConfigLoaded && graphColumnConfig.length > 0) {
      updateConfigurations(configurationGraphKey, graphColumnConfig);
    }
  }, [graphColumnConfig]);

  const validColumns = columns.filter(
    (c) => c.title == "ROW WEEK" || tableColumnConfig.includes(c.title)
  );
  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          {TopBarFilter(filter, setFilter, "Week", {
            loading: false,
            data: advertisementsData,
            year_mode: "multiple",
            newUI: true,
          })}

          <div className="mt-5 col-lg-12">
            <div className="card mb-7 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-end">
                  <button
                    onClick={() => setGraphConfigOpen(true)}
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                  >
                    Configuration
                  </button>
                </div>
                <Graph
                  loading={loading}
                  showDSP={showDSP}
                  chartData={advertisementsData}
                  columnConfig={graphColumnConfig}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 col-lg-12">
            <div className="card mb-4 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-end">
                  <button
                    onClick={() => setTableConfigOpen(true)}
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                  >
                    Configuration
                  </button>
                </div>

                {loading ? (
                  <Loading />
                ) : (
                  <ASINTable
                    columns={validColumns}
                    dataSource={advertisementsData}
                    ellipsis
                    rowKey="key"
                    loading={loading}
                    pagination={false}
                    scroll={{
                      y:
                        typeof window !== "undefined"
                          ? window.innerHeight - 310
                          : undefined,
                      x:
                        validColumns
                          ?.map((d) => parseInt(d.width))
                          .reduce((a, b) => a + b, 0) + 300,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {tableConfigOpen && (
          <Drawers
            columnsList={columnsList.slice(1)}
            defaultConfig={[
              "SPEND",
              "SPEND CHG",
              "AD REVENUE",
              "AD CHG",
              "TOTAL SALES",
              "TOTAL ACOS",
            ]}
            columnConfig={tableColumnConfig}
            setColumnConfig={setTableColumnConfig}
            open={tableConfigOpen}
            onHide={() => setTableConfigOpen(false)}
          />
        )}
        {graphConfigOpen && (
          <Drawers
            columnsList={columnsList.slice(1)}
            defaultConfig={["TOTAL SALES"]}
            columnConfig={graphColumnConfig}
            setColumnConfig={setGraphColumnConfig}
            open={graphConfigOpen}
            onHide={() => setGraphConfigOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

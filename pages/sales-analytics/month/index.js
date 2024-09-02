import dynamic from "next/dynamic";
import _ from "lodash";
import { useEffect, useState, useMemo } from "react";
import { Select, Skeleton, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DotChartOutlined } from "@ant-design/icons";
import Details from "@/src/components/Details";
import { defaultYear, defaultMonth } from "@/src/config";
import {
  getSalesByMonthData,
  getSalesByMonthDetail,
  getSalesByMonthGraph,
  getSalesMonthGraphAsinList,
} from "@/src/services/salesByMonth.services";

import { TopBarFilter } from "@/src/components/sales-analytics/sales";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import {
  selectSalesByMonthData,
  selectSalesByMonthDetail,
  selectSalesByMonthGraph,
  selectSalesMonthGraphAsinList,
} from "@/src/store/slice/salesByMonth.slice";
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
import { SalesByMonthTable } from "@/src/components/sales-analytics/monthly";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const configurationGraphKey = "sales-by-month-graph";

export default function SalesByMonth() {
  const dispatch = useDispatch();

  const [calculatePercentage, setCalculatePercentage] = useState(false);

  const [filter, setFilter] = useState({
    month: _.range(0, defaultMonth() + 1),
    year: [defaultYear()],
  });

  useEffect(() => {
    const { month, year } = filter;

    dispatch(
      getSalesMonthGraphAsinList({
        search_year: year?.sort()?.join(","),
        search_months: month?.sort()?.join(","),
      })
    );
  }, [filter]);

  const [graphFilter, setGraphFilter] = useState("parent_asins");
  const [graphSelected, setGraphSelected] = useState([]);

  const [salesByMonthData, setSalesByMonthData] = useState({});
  const [salesByMonthDataLoading, setSalesByMonthDataLoading] = useState(true);

  const [salesByMonthDetailLoading, setSalesByMonthDetailLoading] =
    useState(true);
  const [salesByMonthGraphLoading, setSalesByMonthGraphLoading] =
    useState(true);
  const [salesByMonthGraph, setSalesByMonthGraph] = useState({
    series: [],
    label: [],
  });

  const SalesByMonthDataRes = useSelector(selectSalesByMonthData);
  const SalesByMonthDetailRes = useSelector(selectSalesByMonthDetail);
  const SalesByMonthGraphRes = useSelector(selectSalesByMonthGraph);

  const [graphConfigOpen, setGraphConfigOpen] = useState(false);
  const [graphColumnConfig, setGraphColumnConfig] = useState([]);
  const [graphColumnConfigLoaded, setGraphColumnConfigLoaded] = useState(false);
  const [showDSP, setShowDSP] = useState(false);

  const SalesByMonthGraphAsinListRes = useSelector(
    selectSalesMonthGraphAsinList
  );

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setShowDSP(!!(brand.advertiser_id && brand.advertiser_id.length > 0));
  }, []);

  const columns = [
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
    ...(showDSP ? ["DSP Spend", "DSP Sales"] : []),
    "Sponsored Product Spend",
    "Sponsored Product Sales",
    "Sponsored Brand Spend",
    "Sponsored Brand Sales",
    "Sponsored Display Spend",
    "Sponsored Display Sales",
  ];

  const replacements = {
    "Sum of Ordered Product Sales": "Ordered Product Sales",
    "Sum of Sessions": "Total Sessions",
    "Sum of Page Views": "Page Views",
    "Sum of Units Ordered": "Units Ordered",
    "Sum of Ad Spend": "Ad Spend",
    "Sum of Ad Sales": "Ad Sales",
    "Sum of Unit Session Percentage": "Conversion Rate",
    "Sum of Total Order Items": "Total Orders",
    "Average of Buy Box Percentage": "Buy Box %",
  };

  const graphColumns = columns.filter((s) => !s.includes("Sponsored"));

  const graphAsinList = SalesByMonthGraphAsinListRes?.data;

  const astrChildAsin = useMemo(
    () =>
      graphAsinList?.astr_child_asin.map((item) => ({
        label: item,
        value: item,
      })),
    [graphAsinList]
  );

  const astrParentAsin = useMemo(
    () =>
      graphAsinList?.astr_parent_asin.map((item) => ({
        label: item,
        value: item,
      })),
    [graphAsinList]
  );

  const astrSkuList = useMemo(
    () =>
      graphAsinList?.astr_listing_sku.map((item) => ({
        label: item,
        value: item,
      })),
    [graphAsinList]
  );

  const graphOptions =
    graphFilter === "parent_asins"
      ? astrParentAsin
      : graphFilter === "child_asins"
      ? astrChildAsin
      : astrSkuList;

  const isPercentageField = (name) => {
    return (
      name.includes("Percentage") ||
      name.includes("Rate") ||
      name.includes("ACOS") ||
      name.includes("%")
    );
  };

  const checkCalculatePercentage = (series) => {
    setCalculatePercentage(
      series.length == 2 ||
        (series.length == 3 &&
          series.filter((s) => isPercentageField(s)).length == 1)
    );
  };

  useEffect(() => {
    setGraphColumnConfig(columns);

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
    if (graphColumnConfigLoaded && graphColumnConfig.length > 0) {
      checkCalculatePercentage(graphColumnConfig);
      updateConfigurations(configurationGraphKey, graphColumnConfig);
    }
  }, [graphColumnConfig]);

  useEffect(() => {
    if (SalesByMonthDataRes?.status === true) {
      setSalesByMonthData(SalesByMonthDataRes?.data || {});
      setSalesByMonthDataLoading(false);
    } else if (SalesByMonthDataRes?.status === false) {
      setSalesByMonthData({});
      setSalesByMonthDataLoading(false);
    }
  }, [SalesByMonthDataRes]);

  useEffect(() => {
    setSalesByMonthDetailLoading(false);
  }, [SalesByMonthDetailRes]);

  useEffect(() => {
    const { month, year } = filter;
    if (month.length > 0 && year.length > 0) {
      setSalesByMonthDataLoading(true);
      setSalesByMonthGraphLoading(true);
      setSalesByMonthDetailLoading(true);
      setGraphSelected([]);

      const time = setTimeout(() => {
        dispatch(
          getSalesByMonthData({
            search_year: year?.join(","),
            search_month: month?.join(","),
          })
        );
        dispatch(
          getSalesByMonthDetail({
            search_year: year?.join(","),
            search_month: month?.join(","),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [filter]);

  useEffect(() => {
    if (filter.month.length > 0 && filter.year.length > 0) {
      setSalesByMonthGraphLoading(true);

      const time = setTimeout(() => {
        dispatch(
          getSalesByMonthGraph({
            search_year: filter?.year?.join(","),
            search_month: filter?.month?.map((m) => m + 1)?.join(","),
            graph_filter_type: "month",
            [graphFilter]: graphSelected.join(","),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [graphSelected]);

  useEffect(() => {
    if (SalesByMonthGraphRes?.status === true) {
      const series_ = [];
      let labels_ = [];
      if (SalesByMonthGraphRes?.data?.length !== 0) {
        labels_ = SalesByMonthGraphRes?.data?.map(
          (d) => `${d?.year}-${d?.label.substring(0, 3)}`
        );
        const name_ = Object.keys(SalesByMonthGraphRes?.data?.[0])?.filter(
          (d) => d?.includes("_label")
        );
        name_?.forEach((name) => {
          const name__ = name;
          series_.push({
            name:
              replacements[SalesByMonthGraphRes?.data?.[0]?.[name]] ||
              SalesByMonthGraphRes?.data?.[0]?.[name],
            data: SalesByMonthGraphRes?.data?.map(
              (d) => d?.[name__?.replace("_label", "")]
            ),
            type: "area",
          });
        });

        series_.push({
          name: "Ad Spend",
          data: SalesByMonthGraphRes?.data?.map((d) => d?.spend),
          type: "area",
        });

        series_.push({
          name: "Ad Sales",
          data: SalesByMonthGraphRes?.data?.map((d) => d?.revenue),
          type: "area",
        });

        series_.push({
          name: "Total ACOS",
          data: SalesByMonthGraphRes?.data?.map((d) => d?.tacos),
          type: "area",
        });

        if (showDSP) {
          series_.push({
            name: "DSP Spend",
            data: SalesByMonthGraphRes?.data?.map((d) => d?.dsp_spend),
            type: "line",
          });

          series_.push({
            name: "DSP Sales",
            data: SalesByMonthGraphRes?.data?.map((d) => d?.dsp_revenue),
            type: "line",
          });
        }
      }
      setSalesByMonthGraph({
        series: series_ || [],
        label: labels_ || [],
      });
      setSalesByMonthGraphLoading(false);
    } else if (SalesByMonthGraphRes?.status === false) {
      setSalesByMonthGraphLoading(false);
      setSalesByMonthGraph({
        series: [],
        label: [],
      });
    }
  }, [SalesByMonthGraphRes]);

  let graphSeries = useMemo(() => {
    const calculatePercentage =
      graphColumnConfig.length == 2 ||
      (graphColumnConfig.length == 3 &&
        graphColumnConfig.filter((s) => isPercentageField(s)).length == 1);

    if (!calculatePercentage || salesByMonthGraph?.series.length == 0) {
      return salesByMonthGraph?.series.filter((c) =>
        graphColumnConfig.includes(c.name)
      );
    }

    const filteredSeries = salesByMonthGraph?.series.filter((c) =>
      graphColumnConfig.includes(c.name)
    );
    const numberFields = filteredSeries.filter(
      (d) => !isPercentageField(d.name)
    );
    const percentageField = filteredSeries.find((d) =>
      isPercentageField(d.name)
    );

    const max1 =
      numberFields.length > 0
        ? _.max(numberFields[0].data.map((d) => parseFloat(d)))
        : 0;
    const max2 =
      numberFields.length > 1
        ? _.max(numberFields[1].data.map((d) => parseFloat(d)))
        : 0;

    if (numberFields.length > 1) {
      if (max2 > max1) {
        return [numberFields[1], percentageField, numberFields[0]].filter(
          (elm) => elm
        );
      } else {
        return [numberFields[0], percentageField, numberFields[1]].filter(
          (elm) => elm
        );
      }
    }

    return [
      ...(numberFields.length > 0 ? numberFields : [filteredSeries[1]]),
      percentageField,
    ];
  }, [salesByMonthGraph, graphColumnConfig]);

  let options = useMemo(
    () => ({
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      labels: salesByMonthGraph?.label || [],
      xaxis: {
        line: {
          show: false,
        },
        labels: {
          trim: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
        },
      },
      yaxis: calculatePercentage
        ? [
            {
              opposite: false,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: "#e86c86",
              },
              labels: {
                style: {
                  colors: "#e86c86",
                },
                formatter: (value) => {
                  return isPercentageField(graphSeries[0]?.name || "")
                    ? percentageFormat(value.toFixed(2))
                    : numberFormat(value.toFixed(2));
                },
              },
            },
            {
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: "#0abdd5",
              },
              labels: {
                style: {
                  colors: "#0abdd5",
                },
                formatter: (value) => {
                  return isPercentageField(graphSeries[1]?.name || "")
                    ? percentageFormat(value.toFixed(2))
                    : numberFormat(value.toFixed(2));
                },
              },
            },
          ]
        : {
            labels: {
              formatter: (value) => {
                return value.toFixed(0);
              },
            },
          },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            const heading = w?.config?.series[seriesIndex]?.name || "";
            if (heading.includes("Sales") || heading.includes("Spend")) {
              return currencyFormat(val);
            }
            if (isPercentageField(heading)) {
              return percentageFormat(val);
            }
            return numberFormat(val);
          },
        },
      },
      colors: [
        "#e86c86",
        "#0abdd5",
        "#0cb774",
        "#f55420",
        "#29d07b",
        "#bdc0e7",
        "#3cbea1",
        "#108a9c",
        "#16050f",
      ],
    }),
    [graphColumnConfig, salesByMonthGraph, calculatePercentage]
  );

  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          {TopBarFilter(filter, setFilter, "Month", {
            year_mode: "multiple",
          })}
          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-body py-3 pt-5">
                  <div className="row g-3">
                    <Details
                      loading={salesByMonthDataLoading}
                      data={[
                        {
                          title: "Ordered Product Sales",
                          value: currencyFormat(
                            salesByMonthData?.totalOrderedProductSales
                          ),
                        },
                        {
                          title: "Total Sessions",
                          value: numberFormat(salesByMonthData?.totalSession),
                        },
                        {
                          title: "Page Views",
                          value: numberFormat(salesByMonthData?.totalPageViews),
                        },
                        {
                          title: "Buy Box %",
                          value: percentageFormat(salesByMonthData?.avgBuyBox),
                        },
                        {
                          title: "Units Ordered",
                          value: numberFormat(
                            salesByMonthData?.totalUnitOrdered
                          ),
                        },
                        {
                          title: "Conversion Rate",
                          value: percentageFormat(
                            salesByMonthData?.conversionRate
                          ),
                        },
                        {
                          title: "Total Orders",
                          value: numberFormat(
                            salesByMonthData?.totalOrderItems
                          ),
                        },
                        {
                          title: "Ad Spend",
                          value: currencyFormat(salesByMonthData?.spend),
                        },
                        {
                          title: "Ad Sales",
                          value: currencyFormat(salesByMonthData?.revenue),
                        },
                        ...(showDSP
                          ? [
                              {
                                title: "DSP Spend",
                                value: currencyFormat(
                                  salesByMonthData?.dsp_spend
                                ),
                              },
                              {
                                title: "DSP Sales",
                                value: currencyFormat(
                                  salesByMonthData?.dsp_revenue
                                ),
                              },
                            ]
                          : []),
                        {
                          title: "PPC Spend",
                          value: currencyFormat(salesByMonthData?.ppcSpend),
                        },
                        {
                          title: "PPC Sales",
                          value: currencyFormat(salesByMonthData?.ppcRevenue),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-header min-h-55px p-0">
                  <div className="container mt-2 gap-4">
                    <div className="row">
                      <div className="col-2">
                        <Select
                          style={{ width: "100%" }}
                          onChange={(e) => {
                            setGraphFilter(e);
                            setGraphSelected([]);
                          }}
                          value={graphFilter || null}
                          options={[
                            {
                              label: "Parent ASINs",
                              value: "parent_asins",
                            },
                            {
                              label: "Child ASINs",
                              value: "child_asins",
                            },
                            {
                              label: "SKUs",
                              value: "sku",
                            },
                          ]}
                        />
                      </div>
                      <div className="col-8">
                        <Select
                          mode="multiple"
                          allowClear
                          style={{
                            width: "100%",
                          }}
                          size="large"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          options={graphOptions}
                          value={graphSelected}
                          onChange={(e) => setGraphSelected(e)}
                        />
                      </div>
                      <div className="col-2">
                        <button
                          onClick={() => setGraphConfigOpen(true)}
                          className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3 float-end"
                        >
                          Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body px-4 py-4">
                  {salesByMonthGraphLoading ? (
                    <div className="h-225px">
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          margin: "auto",
                          width: "fit-content",
                          height: "fit-content",
                        }}
                      >
                        <Skeleton.Node active>
                          <DotChartOutlined
                            style={{
                              fontSize: 40,
                              color: "#bfbfbf",
                            }}
                          />
                        </Skeleton.Node>
                      </div>
                    </div>
                  ) : (
                    <Chart
                      options={options}
                      series={graphSeries}
                      type="area"
                      height={300}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <SalesByMonthTable
            loading={salesByMonthDetailLoading}
            showDSP={showDSP}
          />
        </div>

        {graphConfigOpen && (
          <Drawer
            columnsList={graphColumns}
            columnConfig={graphColumnConfig}
            setColumnConfig={setGraphColumnConfig}
            defaultConfig={graphColumns}
            open={graphConfigOpen}
            onHide={() => {
              setGraphConfigOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

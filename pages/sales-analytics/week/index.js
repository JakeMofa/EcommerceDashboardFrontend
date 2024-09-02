import dynamic from "next/dynamic";
import _ from "lodash";
import { message, Select, Skeleton } from "antd";
import { useState, useEffect, useMemo } from "react";
import { DotChartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { defaultWeek, defaultYear } from "@/src/config";
import { TopBarFilter } from "@/src/components/sales-analytics/sales";
import Details from "@/src/components/Details";
import {
  getSalesWeekData,
  getSalesWeekDetailList,
  getSalesWeekGraph,
  getSalesWeekGraphAsinList,
} from "@/src/services/salesByWeek.services";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import {
  selectSalesWeekData,
  selectSalesWeekDetail,
  selectSalesWeekGraph,
  selectSalesWeekGraphAsinList,
  selectSalesSelectedWeekDetail,
} from "@/src/store/slice/salesByWeek.slice";
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
import { SalesByWeekTable } from "@/src/components/sales-analytics/weekly";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const configurationGraphKey = "sales-by-week-graph";

export default function SalesByWeek() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    week: _.range(1, defaultWeek() + 1),
    year: [defaultYear()],
  });
  const [calculatePercentage, setCalculatePercentage] = useState(false);

  const [graphFilter, setGraphFilter] = useState("parent_asins");
  const [graphSelected, setGraphSelected] = useState([]);

  const [graphLoading, setGraphLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);

  const [isGraph, setIsGraph] = useState({ series: [] });
  const [isWeekList, setIsWeekList] = useState({});

  const SalesWeekDetailsListRes = useSelector(selectSalesWeekDetail);
  const SalesWeekGraphRes = useSelector(selectSalesWeekGraph);
  const SalesByWeekDataRes = useSelector(selectSalesWeekData);
  const SalesByWeekGraphAsinListRes = useSelector(selectSalesWeekGraphAsinList);
  const [showDSP, setShowDSP] = useState(false);

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
    "Average of Buy Box Percentage": "Buy Box %",
    "Sum of Units Ordered": "Units Ordered",
    "Sum of Unit Session Percentage": "Conversion Rate",
    "Sum of Total Order Items": "Total Orders",
    "Sum of Ad Spend": "Ad Spend",
    "Sum of Ad Sales": "Ad Sales",
  };

  const graphColumns = columns.filter((s) => !s.includes("Sponsored"));

  const graphAsinList = SalesByWeekGraphAsinListRes?.data;

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

  const [graphConfigOpen, setGraphConfigOpen] = useState(false);
  const [graphColumnConfig, setGraphColumnConfig] = useState([]);
  const [graphColumnConfigLoaded, setGraphColumnConfigLoaded] = useState(false);

  useEffect(() => {
    setGraphColumnConfig(columns);

    fetchConfigurations(configurationGraphKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setGraphColumnConfig(res.data);
          checkCalculatePercentage(res.data);
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
      updateConfigurations(configurationGraphKey, graphColumnConfig);
      checkCalculatePercentage(graphColumnConfig);
    }
  }, [graphColumnConfig]);

  useEffect(() => {
    if (SalesByWeekDataRes?.status === true) {
      setIsWeekList(SalesByWeekDataRes?.data || {});
      setTableLoading(false);
    } else if (SalesByWeekDataRes?.status === false) {
      setTableLoading(false);
      setIsWeekList({});
    }
  }, [SalesByWeekDataRes]);

  const checkCalculatePercentage = (series) => {
    const list = _.intersection(graphColumns, series);

    setCalculatePercentage(
      list.length == 2 ||
        (list.length == 3 &&
          list.filter((s) => isPercentageField(s)).length == 1)
    );
  };

  useEffect(() => {
    if (SalesWeekDetailsListRes?.status === true) {
      setDetailsLoading(false);
    } else if (SalesWeekDetailsListRes?.status === false) {
      setDetailsLoading(false);
    }
  }, [SalesWeekDetailsListRes]);

  useEffect(() => {
    const { week, year } = filter;
    if (week.length > 0 && year.length > 0) {
      setGraphLoading(true);
      setTableLoading(true);
      setDetailsLoading(true);
      setGraphSelected([]);

      const time = setTimeout(() => {
        dispatch(
          getSalesWeekDetailList({
            search_year: year?.sort()?.join(","),
            search_week: week?.sort()?.join(","),
          })
        );
        dispatch(
          getSalesWeekData({
            search_week: week?.join(","),
            search_year: year?.join(","),
          })
        );
      }, 600);

      return () => {
        clearTimeout(time);
      };
    }
  }, [filter]);

  useEffect(() => {
    const { week, year } = filter;
    if (week.length > 0 && year.length > 0) {
      setGraphLoading(true);

      const time = setTimeout(() => {
        dispatch(
          getSalesWeekGraph({
            search_year: year?.sort()?.join(","),
            search_week: week?.sort()?.join(","),
            graph_filter_type: "week",
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
    const { week, year } = filter;
    setGraphLoading(true);

    dispatch(
      getSalesWeekGraphAsinList({
        search_year: year,
        search_week: week?.sort()?.join(","),
      })
    );
    setGraphLoading(false);
  }, [filter]);

  useEffect(() => {
    if (SalesWeekGraphRes?.status === true) {
      const series_ = [];
      let labels_ = [];
      if (SalesWeekGraphRes?.data?.length !== 0) {
        labels_ = SalesWeekGraphRes?.data?.map((d) => `${d?.year}-${d?.label}`);
        const name_ = Object.keys(SalesWeekGraphRes?.data?.[0])?.filter((d) =>
          d?.includes("_label")
        );
        name_?.forEach((name) => {
          const name__ = name;
          series_.push({
            name:
              replacements[SalesWeekGraphRes?.data?.[0]?.[name]] ||
              SalesWeekGraphRes?.data?.[0]?.[name],
            data: SalesWeekGraphRes?.data?.map(
              (d) => d?.[name__?.replace("_label", "")]
            ),
            type: "line",
          });
        });

        series_.push({
          name: "Ad Spend",
          data: SalesWeekGraphRes?.data?.map((d) => d?.spend),
          type: "line",
        });

        series_.push({
          name: "Ad Sales",
          data: SalesWeekGraphRes?.data?.map((d) => d?.revenue),
          type: "line",
        });
        series_.push({
          name: "Total ACOS",
          data: SalesWeekGraphRes?.data?.map((d) => d?.tacos),
          type: "line",
        });

        if (showDSP) {
          series_.push({
            name: "DSP Spend",
            data: SalesWeekGraphRes?.data?.map((d) => d?.dsp_spend),
            type: "line",
          });
          series_.push({
            name: "DSP Sales",
            data: SalesWeekGraphRes?.data?.map((d) => d?.dsp_revenue),
            type: "line",
          });
        }
      }
      setIsGraph({
        series: series_ || [],
        label: labels_ || [],
      });
      setGraphLoading(false);
    } else if (SalesWeekGraphRes?.status === false) {
      setIsGraph({});
      setGraphLoading(false);
    }
  }, [SalesWeekGraphRes]);

  let options = useMemo(
    () => ({
      chart: {
        height: 300,
        type: "line",
        stacked: false,
        toolbar: { show: false },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      plotOptions: {
        bar: {
          // columnWidth: '50%'
        },
      },

      fill: {
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          stops: [0, 100, 100, 100],
        },
      },
      labels: isGraph?.label || [],
      markers: {
        size: 0,
      },
      xaxis: {
        line: {
          show: false,
        },
        tickPlacement: "on",
        tickAmount: 30,
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
              formatter: (value, amy) => {
                return numberFormat(value);
              },
            },
          },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex, w }) {
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
      grid: {
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.3,
        },
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
      },
    }),
    [isGraph, graphColumnConfig, calculatePercentage]
  );

  const isPercentageField = (name) => {
    return (
      name.includes("Percentage") ||
      name.includes("Rate") ||
      name.includes("ACOS") ||
      name.includes("%")
    );
  };

  let graphSeries = useMemo(() => {
    const calculatePercentage =
      graphColumnConfig.length == 2 ||
      (graphColumnConfig.length == 3 &&
        graphColumnConfig.filter((s) => isPercentageField(s)).length == 1);

    if (!calculatePercentage || isGraph?.series.length == 0) {
      return isGraph?.series.filter((c) => graphColumnConfig.includes(c.name));
    }

    const filteredSeries = isGraph?.series.filter((c) =>
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
  }, [isGraph, graphColumnConfig]);

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid" id="kt_content_container">
          {TopBarFilter(filter, setFilter, "Week", {
            year_mode: "multiple",
          })}
          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-body py-3 pt-5">
                  <div className="row g-3">
                    <Details
                      loading={tableLoading}
                      data={[
                        {
                          title: "Ordered Product Sales",
                          value: currencyFormat(
                            isWeekList?.totalOrderedProductSales
                          ),
                        },
                        {
                          title: "Total Sessions",
                          value: numberFormat(isWeekList?.totalSession),
                        },
                        {
                          title: "Page Views",
                          value: numberFormat(isWeekList?.totalPageViews),
                        },
                        {
                          title: "Buy Box %",
                          value: percentageFormat(isWeekList?.avgBuyBox),
                        },
                        {
                          title: "Units Ordered",
                          value: numberFormat(isWeekList?.totalUnitOrdered),
                        },
                        {
                          title: "Conversion Rate",
                          value: percentageFormat(isWeekList?.conversionRate),
                        },
                        {
                          title: "Total Orders",
                          value: numberFormat(isWeekList?.totalOrderItems),
                        },
                        {
                          title: "Ad Spend",
                          value: currencyFormat(isWeekList?.spend),
                        },
                        {
                          title: "Ad Sales",
                          value: currencyFormat(isWeekList?.revenue),
                        },
                        ...(showDSP
                          ? [
                              {
                                title: "DSP Spend",
                                value: currencyFormat(isWeekList?.dsp_spend),
                              },
                              {
                                title: "DSP Sales",
                                value: currencyFormat(isWeekList?.dsp_revenue),
                              },
                            ]
                          : []),
                        {
                          title: "PPC Spend",
                          value: currencyFormat(isWeekList?.ppcSpend),
                        },
                        {
                          title: "PPC Sales",
                          value: currencyFormat(isWeekList?.ppcRevenue),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gx-5 gx-xl-5">
            {/*begin::Col*/}
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-header min-h-55px p-0">
                  <div className="container mt-2 gap-4">
                    <div className="row">
                      <div className="col-2 bg-red">
                        <Select
                          onChange={(e) => {
                            setGraphFilter(e);
                            setGraphSelected([]);
                          }}
                          className="py-1"
                          value={graphFilter}
                          style={{ width: "100%" }}
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
                <div
                  className="card-body px-4 py-4"
                  style={{ position: "relative" }}
                >
                  {graphLoading ? (
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
                    <ReactApexChart
                      options={options}
                      series={graphSeries}
                      type="line"
                      height={300}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <SalesByWeekTable loading={detailsLoading} showDSP={showDSP} />
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

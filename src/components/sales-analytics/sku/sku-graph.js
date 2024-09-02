import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import Drawer from "@/src/components/sales-analytics/product/drawer";
import dynamic from "next/dynamic";
import {
  numberFormat,
  percentageFormat,
  currencyFormat,
} from "@/src/helpers/formatting.helpers";

import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";

import { selectSalesBySkuGraphData } from "@/src/store/slice/salesBySku.slice";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const configurationGraphKey = "sale-by-sku-graph";

const columnsList = [
  {
    label: "Ordered Revenue",
    value: "sum_ordered_product_sales",
  },
  {
    label: "Total Sessions",
    value: "sum_astr_sessions",
  },
  {
    label: "Session Percentage",
    value: "avg_astr_session_percentage",
  },
  {
    label: "Total Page Views",
    value: "sum_astr_page_views",
  },
  {
    label: "Page View Percentage",
    value: "sum_astr_page_view_percentage",
  },
  {
    label: "Average Buy Box Percentage",
    value: "avg_astr_buy_box_percentage",
  },
  {
    label: "Units Ordered",
    value: "sum_astr_units_ordered",
  },
  {
    label: "Conversion Rate",
    value: "avg_unit_session_percentage",
  },
  {
    label: "Total Orders",
    value: "sum_total_order_items",
  },
  {
    label: "Ad Spend",
    value: "spend",
  },
  {
    label: "Ad Revenue",
    value: "revenue",
  },
  {
    label: "TACOS",
    value: "tacos",
  },
];

export default function SkuGraph({ loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [columnConfig, setColumnConfig] = useState([]);
  const [columnConfigLoaded, setColumnConfigLoaded] = useState(false);
  const [isGraph, setIsGraph] = useState({ series: [] });

  const [calculatePercentage, setCalculatePercentage] = useState(false);

  const salesBySKUGraph = useSelector(selectSalesBySkuGraphData);

  const graphOptions = isGraph?.label?.map((name, index) => {
    return { label: name, value: index };
  });

  const isPercentageField = (name) => {
    return (
      name.includes("Percentage") ||
      name == "TACOS" ||
      name == "Conversion Rate"
    );
  };

  const checkCalculatePercentage = (series) => {
    setCalculatePercentage(
      series.length == 2 ||
        (series.length == 3 &&
          series.filter((s) => isPercentageField(s.label)).length == 1)
    );
  };

  useEffect(() => {
    setColumnConfig(columnsList);

    fetchConfigurations(configurationGraphKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setColumnConfig(res.data);
          checkCalculatePercentage(res.data);
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
      checkCalculatePercentage(columnConfig);
      updateConfigurations(configurationGraphKey, columnConfig);
    }
  }, [columnConfig]);

  useEffect(() => {
    if (salesBySKUGraph?.status === true) {
      const series_ = [];
      if (salesBySKUGraph?.data?.length !== 0) {
        columnsList?.forEach((col) => {
          series_.push({
            name: col.label,
            data: salesBySKUGraph?.data?.map((d) => d?.[col.value]),
            type: "line",
          });
        });
      }
      setIsGraph({
        series: series_ || [],
        label: columnsList.map((c) => c.label),
      });
    } else if (salesBySKUGraph?.status === false) {
      setIsGraph({});
    }
  }, [salesBySKUGraph]);

  let graphSeries = useMemo(() => {
    const calculatePercentage =
      columnConfig.length == 2 ||
      (columnConfig.length == 3 &&
        columnConfig.filter((s) => isPercentageField(s.label)).length == 1);

    if (!calculatePercentage || isGraph?.series.length == 0) {
      return isGraph?.series.filter((c) =>
        columnConfig.map((c) => c.label).includes(c.name)
      );
    }

    const filteredSeries = isGraph?.series.filter((c) =>
      columnConfig.map((c) => c.label).includes(c.name)
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
  }, [isGraph, columnConfig]);

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
      xaxis: {
        categories: salesBySKUGraph?.data?.map((d) => d?.label?.split("T")[0]),
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
                color: "#0cb774",
              },
              labels: {
                style: {
                  colors: "#0cb774",
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
                color: "#e86c86",
              },
              labels: {
                style: {
                  colors: "#e86c86",
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
          formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            const heading = w?.config?.series[seriesIndex]?.name || "";
            if (
              heading.includes("Percentage") ||
              heading == "TACOS" ||
              heading == "Conversion Rate"
            ) {
              return percentageFormat(val);
            }
            if (
              [
                "Sum Of Ordered Product Sales",
                "Ad Spend",
                "Ad Revenue",
              ].includes(heading)
            ) {
              return currencyFormat(val);
            }
            return numberFormat(val);
          },
        },
      },
      colors: [
        "#0cb774",
        "#e86c86",
        "#0abdd5",
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
    [salesBySKUGraph, columnConfig, calculatePercentage]
  );

  return (
    <div className="row gx-5 gx-xl-5">
      {/*begin::Col*/}
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-header min-h-55px p-0">
            <div className="container mt-2 gap-4">
              <div className="row">
                <div className="col-10"></div>
                <div className="col-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3 float-end"
                  >
                    Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body px-4 py-4" style={{ position: "relative" }}>
            {loading ? (
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
      {isOpen && (
        <Drawer
          columnsList={columnsList}
          columnConfig={columnConfig}
          setColumnConfig={setColumnConfig}
          open={isOpen}
          onHide={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

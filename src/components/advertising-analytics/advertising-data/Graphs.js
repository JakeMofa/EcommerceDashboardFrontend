import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import Drawer from "@/src/components/sales-analytics/product/drawer";
import dynamic from "next/dynamic";
import { numberFormat } from "@/src/helpers/formatting.helpers";

import { selectAdvertisementGraphData } from "@/src/store/slice/advertising.slice";
import _ from "lodash";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const columnsList = [
  {
    label: "Impression",
    value: "impression",
  },
  {
    label: "Clicks",
    value: "clicks",
  },
  {
    label: "Conversions",
    value: "conversions",
  },
  {
    label: "Unit Ordered",
    value: "unit_ordered",
  },
  {
    label: "Revenue",
    value: "revenue",
  },
  {
    label: "Spend",
    value: "spend",
  },
];

const Graphs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnConfig, setColumnConfig] = useState(columnsList);
  const [isGraph, setIsGraph] = useState({});
  const graphData = useSelector(selectAdvertisementGraphData);

  const dates = useMemo(
    () => graphData?.data?.dates || {},
    [graphData?.data?.dates]
  );

  const loading = graphData.status;

  useEffect(() => {
    if (!loading) {
      if (dates.length !== 0) {
        const data = columnsList.reduce((acc, item) => {
          acc.push({
            name: item.label,
            data: dates.map((el) => ({ x: el.date, y: el[item.value] })),
            type: "line",
          });
          return acc;
        }, []);

        setIsGraph({
          series: data || [],
          label: columnsList.map((c) => c.label),
        });
      }
    }
  }, [dates, loading]);

  let options = {
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
    yaxis: [
      {
        labels: {
          formatter: function (val, opt) {
            return numberFormat(val);
          },
        },
      },
    ],
    tooltip: {
      y: {
        // formatter: function (val, { seriesIndex, w }) {
        //   const heading = w?.config?.series[seriesIndex]?.name || "";
        //   if (heading.includes("Percentage") || heading.includes("TACOS")) {
        //     return percentageFormat(val);
        //   }
        //   if (
        //     [
        //       "Sum Of Ordered Product Sales",
        //       "Total Spend",
        //       "Total Revenue",
        //     ].includes(heading)
        //   ) {
        //     return currencyFormat(val);
        //   }
        //   return numberFormat(val);
        // },
      },
    },
    colors: ["#0cb774", "#e86c86", "#0abdd5", "#f55420", "#000", "#bdc0e7"],
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.3,
      },
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
  };
  const columnList = columnConfig.map((item) => item.label);

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
              <div className="h-300px">
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
                series={
                  isGraph?.series?.filter((fid) =>
                    columnList.includes(fid.name)
                  ) || []
                }
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
};
export default Graphs;

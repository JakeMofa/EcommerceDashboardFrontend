import { DotChartOutlined } from "@ant-design/icons";
import { Drawer, Modal, Select, Skeleton } from "antd";
import { cloneElement, useState, useEffect, useMemo } from "react";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
  calculateNumber,
} from "@/src/helpers/formatting.helpers";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesGraph(loading, chartData, weeklyView) {
  const [open, setOpen] = useState(false);
  const [graphSelected, setGraphSelected] = useState(
    "sum_of_ordered_product_sales"
  );

  useEffect(() => {
    setGraphSelected("sum_of_ordered_product_sales");
  }, [weeklyView]);

  const options = [
    {
      value: "sum_of_ordered_product_sales",
      label: "Sales by",
      formatter: currencyFormat,
    },
    {
      value: "sum_of_units_ordered",
      label: "Units by",
      formatter: numberFormat,
    },
    {
      value: "sum_of_sessions",
      label: "Sessions by",
      formatter: numberFormat,
    },
    {
      value: "conversion_rate",
      label: "Conversion By",
      formatter: percentageFormat,
    },
    {
      value: "average_of_buy_box_percentage",
      label: "Buy Box % By",
      formatter: percentageFormat,
    },
  ];

  const selectOptions = useMemo(() => {
    return options.map((o) => ({
      value: o.value,
      label: `${o.label} ${weeklyView ? "Week" : "Month"}`,
    }));
  }, [weeklyView]);

  return (
    <div className="card card-flush h-xl-100 fadeInRight">
      <div className="card-header min-h-55px ">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder text-dark">
            {options.find((fid) => fid.value === graphSelected).label}{" "}
            {weeklyView ? "Week" : "Month"}
          </span>
        </h3>
        <div className="card-toolbar">
          <Select
            key={weeklyView ? "weekly-graph" : "monthly-graph"}
            defaultValue="sum_of_ordered_product_sales"
            loading={loading}
            style={{ width: 200 }}
            onChange={(e) => setGraphSelected(e)}
            options={selectOptions}
          />
        </div>
      </div>
      <div
        className="card-body px-4 py-4 chart-area"
        style={{ position: "relative" }}
      >
        {loading ? (
          <div className="h-200px">
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
          (() => {
            const chart = (
              <Chart
                options={{
                  chart: {
                    id: "sales-by-week",
                    toolbar: {
                      show: true,
                      tools: {
                        customIcons: [
                          {
                            icon: '<img src="/assets/fullscreen.svg" width="20">',
                            index: 4,
                            title: "Fullscreen",
                            class:
                              "apexcharts-reset-icon apexcharts-reset-icon apexcharts-reset-icon",
                            click: function (chart, options, e) {
                              setOpen(true);
                            },
                          },
                        ],
                      },
                    },
                  },
                  selection: {
                    enabled: true,
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  xaxis: {
                    categories: Object.values(chartData || [])?.map(
                      (d) => d?.label
                    ),
                    tickPlacement: "on",
                    tickAmount: 20,
                  },
                  yaxis: {
                    labels: {
                      formatter: (value) => {
                        const formatBy = options.find(
                          (fid) => fid.value === graphSelected
                        )?.formatter;
                        return formatBy?.(value) || value;
                      },
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: function (val) {
                        return options
                          .find((l) => l?.value == graphSelected)
                          ?.formatter(val);
                      },
                    },
                  },
                  colors: ["#000", "#1BC5BD"],
                }}
                series={[
                  {
                    name: selectOptions.find((l) => l?.value == graphSelected)
                      ?.label,
                    data: Object.values(chartData || [])?.map((d) =>
                      calculateNumber(d?.[graphSelected])
                    ),
                  },
                ]}
                type="area"
                height={300}
              />
            );
            return (
              <>
                {chart}
                <Drawer
                  title={"Sales By Week Chart"}
                  placement="top"
                  onClose={() => setOpen(false)}
                  open={open}
                  forceRender
                  height={"100vh"}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginBottom: 16,
                    }}
                  >
                    <Select
                      defaultValue="Sales by week"
                      style={{ width: 200 }}
                      onChange={(e) => setGraphSelected(e)}
                      options={options}
                    />
                  </div>
                  {cloneElement(chart, {
                    height: (window.outerWidth / window.outerHeight) * 300,
                  })}
                </Drawer>
              </>
            );
          })()
        )}
        <div className="resize-triggers">
          <div className="expand-trigger">
            <div style={{ width: "535px", height: "327px" }} />
          </div>
          <div className="contract-trigger" />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "antd";
import dynamic from "next/dynamic";
import { DotChartOutlined } from "@ant-design/icons";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Graph({ loading, showDSP, chartData, columnConfig }) {
  const [seriesData, setSeriesData] = useState([]);
  const [calculatePercentage, setCalculatePercentage] = useState(false);

  const isPercentageField = (name) => {
    return (
      name.includes("CHG") ||
      name.includes("ACOS") ||
      name.includes("Change") ||
      name.includes("ACoS")
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
    checkCalculatePercentage(columnConfig);
  }, [columnConfig]);

  useEffect(() => {
    setSeriesData([
      {
        name: "Spend",
        title: "SPEND",
        data: Object.values(chartData || {})?.map((d) => d?.twSpend || 0),
      },
      {
        name: "Spend Change",
        title: "SPEND CHG",
        data: Object.values(chartData || {})?.map((d) => d?.spendChange || 0),
      },
      {
        name: "Ad Revenue",
        title: "AD REVENUE",
        data: Object.values(chartData || {})?.map((d) => d?.twRevenue || 0),
      },
      {
        name: "Revenue Change",
        title: "REVENUE CHG",
        data: Object.values(chartData || {})?.map((d) => d?.adChange || 0),
      },
      {
        name: "Organic Sales",
        title: "ORGANIC SALES",
        data: Object.values(chartData || {})?.map((d) => d?.organicSales || 0),
      },
      {
        name: "Organic Change",
        title: "ORGANIC CHG",
        data: Object.values(chartData || {})?.map(
          (d) => d?.organicSalesChange || 0
        ),
      },
      {
        name: "Total Sales",
        title: "TOTAL SALES",
        data: Object.values(chartData || {})?.map((d) => d?.totalSales || 0),
      },
      {
        name: "Total ACoS",
        title: "TOTAL ACOS",
        data: Object.values(chartData || {})?.map(
          (d) => d?.ACoS_percentage || 0
        ),
      },
      {
        name: "PPC Spend",
        title: "PPC SPEND",
        data: Object.values(chartData || {})?.map((d) => d?.PPCSpend || 0),
      },
      {
        name: "PPC Spend Change",
        title: "PPC SPEND CHANGE",
        data: Object.values(chartData || {})?.map(
          (d) => d?.PPCSpendChange || 0
        ),
      },
      {
        name: "PPC Sales",
        title: "PPC SALES",
        data: Object.values(chartData || {})?.map((d) => d?.PPCSales || 0),
      },
      {
        name: "PPC SALES CHANGE",
        title: "PPC SALES CHANGE",
        data: Object.values(chartData || {})?.map(
          (d) => d?.PPCSalesChange || 0
        ),
      },
      ...(showDSP
        ? [
            {
              name: "DSP SALES",
              title: "DSP SALES",
              data: Object.values(chartData || {})?.map(
                (d) => d?.dsp_revenue || 0
              ),
            },
            {
              name: "DSP SALES CHANGE",
              title: "DSP SALES CHANGE",
              data: Object.values(chartData || {})?.map(
                (d) => d?.dsp_revenue_change || 0
              ),
            },
            {
              name: "DSP SPEND",
              title: "DSP SPEND",
              data: Object.values(chartData || {})?.map(
                (d) => d?.dsp_spend || 0
              ),
            },
            {
              name: "DSP SPEND CHANGE",
              title: "DSP SPEND CHANGE",
              data: Object.values(chartData || {})?.map(
                (d) => d?.dsp_spend_change || 0
              ),
            },
          ]
        : []),
      {
        name: "Sponsored Products Ad Spend",
        title: "SPONSORED PRODUCTS AD SPEND",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredProductAdSpend || 0
        ),
      },
      {
        name: "Sponsored Products Ad Sales",
        title: "SPONSORED PRODUCTS AD SALES",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredProductAdSales || 0
        ),
      },
      {
        name: "Sponsored Brand Ad Spend",
        title: "SPONSORED BRAND AD SPEND",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredBrandAdSpend || 0
        ),
      },
      {
        name: "Sponsored Brand Ad Sales",
        title: "SPONSORED BRAND AD SALES",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredBrandSales || 0
        ),
      },
      {
        name: "Sponsored Display Ad Spend",
        title: "SPONSORED DISPLAY AD SPEND",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredDisplayAdSpend || 0
        ),
      },
      {
        name: "Sponsored Display Ad Sales",
        title: "SPONSORED DISPLAY AD SALES",
        data: Object.values(chartData || {})?.map(
          (d) => d?.sponsoredDisplayAdSales || 0
        ),
      },
      {
        name: "Impressions",
        title: "IMPRESSIONS",
        data: Object.values(chartData || {})?.map((d) => d?.impressions || 0),
      },
      {
        name: "Clicks",
        title: "CLICKS",
        data: Object.values(chartData || {})?.map((d) => d?.clicks || 0),
      },
      {
        name: "Total Unit Orders",
        title: "TOTAL UNIT ORDERS",
        data: Object.values(chartData || {})?.map(
          (d) => d?.totalUnitOrder || 0
        ),
      },
      {
        name: "Branded Spend",
        title: "BRANDED SPEND",
        data: Object.values(chartData || {})?.map((d) => d?.brandedSpends || 0),
      },
      {
        name: "Branded Sales",
        title: "BRANDED SALES",
        data: Object.values(chartData || {})?.map((d) => d?.brandedSales || 0),
      },
      {
        name: "Non-Branded Spend",
        title: "NON BRANDED SPEND",
        data: Object.values(chartData || {})?.map(
          (d) => d?.nonBrandedSpends || 0
        ),
      },
      {
        name: "Non-Branded Sales",
        title: "NON BRANDED SALES",
        data: Object.values(chartData || {})?.map(
          (d) => d?.nonBrandedSales || 0
        ),
      },
      {
        name: "Branded ROAS",
        title: "BRANDED ROAS",
        data: Object.values(chartData || {})?.map((d) => d?.brandedRoAS || 0),
      },
      {
        name: "Non-Branded ROAS",
        title: "NON BRANDED ROAS",
        data: Object.values(chartData || {})?.map(
          (d) => d?.nonBrandedRoAS || 0
        ),
      },
    ]);
  }, [chartData]);

  let graphSeries = useMemo(() => {
    const calculatePercentage =
      columnConfig.length == 2 ||
      (columnConfig.length == 3 &&
        columnConfig.filter((s) => isPercentageField(s)).length == 1);

    if (!calculatePercentage || seriesData.length == 0) {
      return seriesData.filter((c) => columnConfig.includes(c.title));
    }

    const filteredSeries = seriesData.filter((c) =>
      columnConfig.includes(c.title)
    );
    const numberFields = filteredSeries.filter(
      (d) => !isPercentageField(d.title)
    );
    const percentageField = filteredSeries.find((d) =>
      isPercentageField(d.title)
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
  }, [seriesData, columnConfig]);

  let options = useMemo(
    () => ({
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: Object.values(chartData || {})?.map(
          (d) => `${d?.year}-WK${d?.week}`
        ),
        tickPlacement: "on",
        tickAmount: 30,
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
                color: "#f55420",
              },
              labels: {
                style: {
                  colors: "#f55420",
                },
                formatter: (value) => {
                  return isPercentageField(graphSeries[1]?.name || "")
                    ? percentageFormat(value.toFixed(2))
                    : numberFormat(value.toFixed(2));
                },
              },
              tooltip: {
                enabled: true,
              },
            },
          ]
        : {
            labels: {
              formatter: (value) => {
                return numberFormat(value.toFixed(0));
              },
            },
          },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            const heading = w?.config?.series[seriesIndex]?.name || "";
            if (isPercentageField(heading)) {
              return percentageFormat(val);
            }
            if (
              heading.includes("Sales") ||
              heading.includes("Spend") ||
              heading.includes("Revenue")
            ) {
              return currencyFormat(val);
            }
            return numberFormat(val);
          },
        },
      },
      colors: [
        "#e86c86",
        "#f55420",
        "#0abdd5",
        "#0cb774",
        "#29d07b",
        "#bdc0e7",
        "#3cbea1",
        "#108a9c",
        "#16050f",
      ],
    }),
    [columnConfig, calculatePercentage, chartData]
  );

  return (
    <div className="card card-flush h-xl-100 fadeInRight">
      <div
        className="card-body px-5 py-5 chart-area"
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
        ) : chartData ? (
          <Chart
            options={options}
            series={graphSeries}
            type="area"
            height={300}
          />
        ) : (
          <h4 className="text-center">Graph data not found</h4>
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

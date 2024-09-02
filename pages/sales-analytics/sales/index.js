/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { defaultMonth, defaultWeek, defaultYear } from "@/src/config";
import {
  getSalesGraphData,
  getSalesTableData,
  getSalesReportCallOuts,
} from "@/src/services/sales.services";
import {
  TopBarFilter,
  SalesGraph,
  ReportCallOuts,
  LSales,
  RSales,
  SalesBySKU,
} from "@/src/components/sales-analytics/sales";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import {
  selectSalesByWeekData,
  selectSalesGraphData,
  selectSalesStats,
  selectSalesByReportCallOuts,
} from "@/src/store/slice/sales.slice";
import { selectReportLogsSummary } from "@/src/store/slice/reportLogs.slice";
import _ from "lodash";
import { Switch } from "antd";
import dayjs from "dayjs";
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

export default function Sales() {
  const dispatch = useDispatch();
  const salesGraphData = useSelector(selectSalesGraphData);
  const salesByWeekData = useSelector(selectSalesByWeekData);
  const salesStats = useSelector(selectSalesStats);
  const reportLogsSummary = useSelector(selectReportLogsSummary);
  const salesReportCallOuts = useSelector(selectSalesByReportCallOuts);

  const [filter, setFilter] = useState({
    week: _.range(1, 54),
    month: _.range(0, 12),
    year: defaultYear(),
  });

  const [chartData, setChartData] = useState({});
  const [tableList, setTableList] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [reportData, setReportData] = useState({});

  const [salesGraphLoading, setSalesGraphLoading] = useState(true);
  const [salesByWeekLoading, setSalesByWeekLoading] = useState(true);
  const [salesStatsLoading, setSalesStatsLoading] = useState(true);
  const [reportCallOutLoading, setReportCallOutLoading] = useState(true);

  const [weeklyView, setWeeklyView] = useState(true);
  const [lastFullPeriod, setLastFullPeriod] = useState(true);
  const [salesLastUpdatedAt, setSalesLastUpdatedAt] = useState({});

  useEffect(() => {
    if (lastFullPeriod) {
      if (salesLastUpdatedAt.week) {
        setSalesGraphLoading(false);
        setChartData(
          salesGraphData?.data?.filter((d) =>
            weeklyView
              ? d.week <= salesLastUpdatedAt.week
              : d.month <= salesLastUpdatedAt.month
          )
        );
      }
    } else {
      setChartData(salesGraphData?.data);
      setSalesGraphLoading(false);
    }
  }, [salesGraphData, lastFullPeriod, salesLastUpdatedAt]);

  useEffect(() => {
    setTableList(Object.values(salesByWeekData?.data || []));
    setSalesByWeekLoading(false);
  }, [salesByWeekData]);

  useEffect(() => {
    setStatsData(salesStats?.data || {});
    setSalesStatsLoading(false);
  }, [salesStats]);

  useEffect(() => {
    setReportData(salesReportCallOuts?.data || {});
    setReportCallOutLoading(false);
  }, [salesReportCallOuts]);

  useEffect(() => {
    if (reportLogsSummary.data.sales) {
      const d = new Date(reportLogsSummary.data.sales);
      const day = dayjs(d);
      setSalesLastUpdatedAt({
        week: day.week() - 1,
        month: day.month(),
      });
    }
  }, [reportLogsSummary]);

  useEffect(() => {
    if (
      filter.year &&
      (weeklyView ? filter.week.length > 0 : filter.month.length > 0)
    ) {
      setSalesByWeekLoading(true);
      dispatch(
        getSalesTableData({
          search_year: filter?.year,
          ...(weeklyView
            ? { search_week: filter?.week?.join(",") }
            : {
                search_month: filter?.month?.map((m) => m + 1)?.join(","),
                graph_filter_type: "month",
              }),
        })
      );
    }
  }, [filter, weeklyView]);

  const createRange = (maxNumber) => {
    return Array.from({ length: maxNumber }, (_, i) => i + 1);
  };

  useEffect(() => {
    setReportCallOutLoading(true);
    dispatch(
      getSalesReportCallOuts({
        lastFullPeriod: lastFullPeriod,
        search_year: defaultYear(),
        ...(weeklyView
          ? {
              search_week: defaultWeek(),
            }
          : {
              search_month: defaultMonth(),
            }),
      })
    );
  }, [weeklyView, lastFullPeriod]);

  useEffect(() => {
    setSalesGraphLoading(true);

    dispatch(
      getSalesGraphData({
        search_year: defaultYear(),
        ...(weeklyView
          ? { search_week: createRange(defaultWeek()).join(",") }
          : {
              search_month: createRange(defaultMonth() + 1).join(","),
              graph_filter_type: "month",
            }),
      })
    );
  }, [weeklyView]);

  const onViewChange = (checked) => {
    setSalesStatsLoading(true);
    setWeeklyView(checked);
  };

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid" id="kt_content_container">
          <div className="row gx-5 gx-xl-5">
            <div className="float-start w-auto">
              {TopBarFilter(filter, setFilter, weeklyView ? "Week" : "Month", {
                showSummary: true,
              })}
            </div>
            <div className="w-auto d-flex card card-flush h-xl-100">
              <div className="card-body px-2 py-7">
                <span>Monthly</span>
                <Switch
                  checked={weeklyView}
                  onChange={onViewChange}
                  className="mx-2"
                />
                <span>Weekly</span>
              </div>
            </div>
          </div>

          <div className="row gx-5 gx-xl-5">
            <div
              className="col-xl-6 mb-5 mb-xl-5"
              data-select2-id="select2-data-17-s07q"
            >
              {SalesGraph(salesGraphLoading, chartData, weeklyView)}
            </div>
            <div className="col-xl-6 mb-5 mb-xl-5">
              {ReportCallOuts(
                statsData?.totalSalesL4wkChange,
                weeklyView,
                reportCallOutLoading,
                reportData,
                lastFullPeriod,
                setLastFullPeriod
              )}
            </div>
          </div>
          <div className="row gx-5 gx-xl-5">
            {LSales(statsData, salesStatsLoading, weeklyView)}
            {RSales(statsData, salesStatsLoading)}
          </div>
          {SalesBySKU(tableList, salesByWeekLoading, weeklyView)}
        </div>
      </div>
    </DashboardLayout>
  );
}

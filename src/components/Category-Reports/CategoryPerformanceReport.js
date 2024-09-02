import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "@/src/components/loading";
import TopBarFilter from "./top-bar-filter-Category";
import _ from "lodash";
import { defaultWeek, defaultMonth, defaultYear } from "@/src/config";
import { getCategoryPerformanceList } from "@/src/services/categoryPerformance.services";
import ImportFileModal from "@/src/modals/importFile.modal";
import { selectCategoryPerformanceList } from "@/src/store/slice/categoryPerformanceReport.slice";
import NoData from "@/src/components/no-data";
import moment from "moment";

import { currencyFormat } from "@/src/helpers/formatting.helpers";
import { percentageFormat } from "@/src/helpers/formatting.helpers";
import { getCategoryList } from "@/src/services/categoryList.services";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import { CustomDrawer } from "../modal";
import ASINTable from "@/src/components/table";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { Switch } from "antd";

export default function CategoryPerformanceReport() {
  const dispatch = useDispatch();

  const CategoryPerformanceListRes = useSelector(selectCategoryPerformanceList);

  const [modalOpen, setModalOpen] = useState(false);

  const [tableLoading, setTableLoading] = useState(true);
  const [list, setList] = useState([]);
  const CategoryListRes = useSelector(selectCategoryList);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [weeklyView, setWeeklyView] = useState(true);

  const onChange = (checked) => {
    setWeeklyView(checked);
    setTableLoading(true);
  };

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    if (brand.subcategories_enabled) {
      const data = {};
      CategoryListRes.data?.map((item) => {
        item.subcategories.map((c) => {
          data[c.name] = item.name;
        });
      });
      setCategoryMapping(data);
    }
  }, [CategoryListRes.data]);

  const [filter, setFilter] = useState({
    week: _.range(1, Math.max(defaultWeek(), 2)),
    month: _.range(0, defaultMonth() + 1),
    year: [defaultYear()],
    category: [],
  });

  useEffect(() => {
    dispatch(getCategoryList({ limit: 9999 }));
  }, []);

  useEffect(() => {
    const { year, week, month, category } = filter;
    if (
      year.length > 0 &&
      ((weeklyView && week.length > 0) || (!weeklyView && month.length > 0))
    ) {
      const time = setTimeout(() => {
        dispatch(
          getCategoryPerformanceList({
            search_year: year?.join(","),
            category: category.join(","),
            ...(weeklyView
              ? { search_week: week?.join(",") }
              : { search_month: month?.map((m) => m + 1).join(",") }),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, weeklyView]);

  useEffect(() => {
    if (CategoryPerformanceListRes.status) {
      setList(CategoryPerformanceListRes.categories);
      setTableLoading(false);
    } else if (CategoryPerformanceListRes.status === false) {
      setTableLoading(false);
    }
  }, [CategoryPerformanceListRes]);

  const findIntervalCount = useMemo(() => {
    return _(
      CategoryPerformanceListRes.intervalTotal.map((item) =>
        weeklyView ? item.year * 54 + item.week : item.year * 12 + item.month
      )
    ).sortBy();
  }, [list, filter]);

  const columns = useMemo(
    () => [
      {
        title: "Row Labels",
        width: 150,
        key: "name",
        fixed: "left",
        render: (text) => {
          return text.heading ? (
            <span>
              <b>{text.name}</b>
            </span>
          ) : (
            <span>{text.name}</span>
          );
        },
      },
      ...(findIntervalCount.map((key, index) => ({
        title: weeklyView
          ? `${parseInt(key / 54)}-WK${key % 54}`
          : `${parseInt((key - 1) / 12)}-${moment
              .months()
              [(key - 1) % 12].substring(0, 3)}`,
        dataIndex: `interval${key}`,
        key: `interval${key}`,
        width: 110,
        id: `cat-interval${key}-resiable`,
        className: index % 2 ? "" : "bg-light",
      })) || []),
      {
        title: "Total",
        width: 130,
        dataIndex: "total",
        key: "total",
      },
      {
        title: `% Change ${weeklyView ? "week over week" : "month over month"}`,
        width: 180,
        dataIndex: "cwow",
        key: "cwow",
      },
    ],
    [findIntervalCount, filter, weeklyView]
  );

  const res = useMemo(
    () =>
      list?.reduce((acc, item, key) => {
        const { change_interval_over_interval, total, interval_report } = item;

        const intervals = (type, formatter = (val) => val) =>
          interval_report.reduce((wacc, witem) => {
            wacc[
              `interval${
                weeklyView
                  ? witem.year * 54 + witem.week
                  : witem.year * 12 + witem.month
              }`
            ] = formatter(witem[type]);
            return wacc;
          }, {});

        const row1 = {
          name: item.category,
          heading: true,
        };
        const row2 = {
          name: "Shipped Revenue",
          ...intervals("shipped_revenue", currencyFormat),
          total: currencyFormat(total?.shipped_revenue),
          cwow: percentageFormat(change_interval_over_interval.shipped_revenue),
        };
        const row3 = {
          name: "TACoS",
          ...intervals("TACoS", percentageFormat),
          total: percentageFormat(total?.TACoS),
          cwow: percentageFormat(change_interval_over_interval.TACoS),
        };
        const row4 = {
          name: "Ad Sales",
          ...intervals("ad_sales", currencyFormat),
          total: currencyFormat(total?.ad_sales),
          cwow: percentageFormat(change_interval_over_interval.ad_sales),
        };
        const row5 = {
          name: "Ad Spend",
          ...intervals("ad_spend", currencyFormat),
          total: currencyFormat(total?.ad_spend),
          cwow: percentageFormat(change_interval_over_interval.ad_spend),
        };
        acc.push(row1);
        acc.push(row2);
        acc.push(row3);
        acc.push(row4);
        acc.push(row5);

        return acc;
      }, []) || [],
    [list, filter]
  );

  const totalColumn = [
    ...(weeklyView
      ? [
          {
            title: "Week",
            width: 90,
            dataIndex: "week",
            key: "week",
            fixed: "left",
          },
        ]
      : [
          {
            title: "Month",
            width: 90,
            dataIndex: "month",
            key: "month",
            fixed: "left",
          },
        ]),
    {
      title: "Shipped Revenue Total",
      width: 90,
      dataIndex: "shippedRevenue",
      key: "shippedRevenue",
    },
    {
      title: "TACoS Average",
      width: 90,
      dataIndex: "tACoS",
      key: "tACoS",
    },
    {
      title: "Ad Sales Total",
      width: 90,
      dataIndex: "adSales",
      key: "adSales",
    },
    {
      title: "Ad Spend Total",
      width: 90,
      dataIndex: "adSpend",
      key: "adSpend",
    },
  ];

  const intervalTotal = CategoryPerformanceListRes.intervalTotal.map(
    (item) => ({
      ...(weeklyView
        ? { week: item.week_name }
        : { month: moment.months()[item.month - 1] }),
      shippedRevenue: currencyFormat(item.shipped_revenue),
      tACoS: percentageFormat(item.TACoS),
      adSales: currencyFormat(item.ad_sales),
      adSpend: currencyFormat(item.ad_spend),
    })
  );

  return (
    <>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n                            /* .table th, .table td{\n                                border:1px solid red\n                            } */\n                        ",
            }}
          />
          <div className="row gx-5 gx-xl-5">
            <div className="float-start w-auto">
              {TopBarFilter(filter, setFilter, weeklyView ? "Week" : "Month")}
            </div>
            <div className="w-auto d-flex card card-flush h-xl-100">
              <div className="card-body px-8 py-7">
                <span>Monthly</span>
                <Switch
                  checked={weeklyView}
                  onChange={onChange}
                  className="mx-4"
                />
                <span>Weekly</span>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card mb-1">
                <div className="card-header border-bottom border-bottom-dashed">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-0">
                      Category Performance Report
                    </span>
                  </h3>
                  <div className="card-toolbar gap-3">
                    <CustomDrawer
                      width={"100vw"}
                      height={"100vh"}
                      title={
                        weeklyView
                          ? "Week by Week Total"
                          : "Month by Month Total"
                      }
                      placement={"right"}
                      opener={
                        <button
                          disabled={tableLoading}
                          className="btn btn-light-danger btn-sm fw-bolder"
                        >
                          {weeklyView ? "Week by Week" : "Month by Month"} Total
                        </button>
                      }
                    >
                      {({}) => {
                        return (
                          <>
                            {TopBarFilter(
                              filter,
                              setFilter,
                              weeklyView ? "Week" : "Month"
                            )}
                            <ASINTable
                              pagination={false}
                              columns={totalColumn}
                              dataSource={intervalTotal}
                              loading={tableLoading}
                              scroll={{
                                y:
                                  typeof window !== "undefined"
                                    ? window.innerHeight - 250
                                    : undefined,
                                x:
                                  totalColumn
                                    ?.map((d) => d.width)
                                    .reduce((a, b) => a + b, 0) + 300,
                              }}
                              size={"small"}
                            />
                          </>
                        );
                      }}
                    </CustomDrawer>

                    {/* <button
                      className="btn btn-light-danger btn-sm fw-bolder"
                      onClick={() => setModalOpen(true)}
                    >
                      Import Data
                    </button> */}
                    <ExportToExcel
                      columns={columns.map((item) => item.title) || []}
                      rows={res.map((r) => {
                        const val = {};
                        Object.keys(r)
                          .filter((k) => k !== "heading")
                          .map((k) => {
                            val[k] = r[k];
                          });
                        return val;
                      })}
                      fileName={"category-performance-report"}
                      loading={tableLoading}
                    >
                      <button className="btn btn-light-danger btn-sm fw-bolder">
                        Export Data
                      </button>
                    </ExportToExcel>
                  </div>
                </div>
                <div className="card-body pt-2 table-responsive">
                  <div className="table-responsive">
                    {tableLoading ? (
                      <Loading />
                    ) : list?.length != 0 ? (
                      <>
                        <ASINTable
                          pagination={false}
                          columns={totalColumn.slice(1)}
                          dataSource={[
                            {
                              shippedRevenue: currencyFormat(
                                CategoryPerformanceListRes.grandTotal
                                  .shipped_revenue
                              ),
                              tACoS: percentageFormat(
                                ((CategoryPerformanceListRes.grandTotal
                                  .ad_spend || 0.0000001) /
                                  (CategoryPerformanceListRes.grandTotal
                                    .shipped_revenue || 1)) *
                                  100
                              ),
                              adSales: currencyFormat(
                                CategoryPerformanceListRes.grandTotal.ad_sales
                              ),
                              adSpend: currencyFormat(
                                CategoryPerformanceListRes.grandTotal.ad_spend
                              ),
                            },
                          ]}
                          size={"small"}
                        />
                        <ASINTable
                          pagination={false}
                          columns={columns}
                          dataSource={res}
                          loading={tableLoading}
                          resizable
                          id={"category-performance-report"}
                          scroll={{
                            y:
                              typeof window !== "undefined"
                                ? window.innerHeight - 310
                                : undefined,
                            x:
                              columns?.reduce((acc, item) => {
                                if (item.children) {
                                  const childTotals = item.children.reduce(
                                    (childAcc, child) => {
                                      if (child.width) {
                                        childAcc += child.width;
                                      }
                                      return childAcc;
                                    },
                                    0
                                  );

                                  acc += childTotals;
                                } else {
                                  acc += item.width;
                                }

                                return acc;
                              }, 0) + 300,
                          }}
                          size={"small"}
                        />
                      </>
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ImportFileModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
      </div>
    </>
  );
}

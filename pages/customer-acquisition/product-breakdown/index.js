import { useEffect, useState, useMemo } from "react";
import { TopBarFilter } from "@/src/components/sales-analytics/sales";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { defaultYear, defaultMonth, defaultWeek } from "@/src/config";
import {
  getCustomerAcquisitionBreakdownMonthly,
  getCustomerAcquisitionBreakdownWeekly,
} from "@/src/services/customerAcquisition.services";
import NoData from "@/src/components/no-data";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomerAcquisitionBreakdownMonthly } from "@/src/store/slice/customerAcquisitionBreakdownMonthly.slice";
import { selectCustomerAcquisitionBreakdownWeekly } from "@/src/store/slice/customerAcquisitionBreakdownWeekly.slice";
import _ from "lodash";
import {
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { exportToExcel } from "@/src/hooks/Excelexport";
import VendoTooltip from "@/src/components/tooltip";
import moment from "moment";
import { Tooltip, Table, Checkbox, Switch, message } from "antd";
import {
  fetchCustomerAcquisitionBreakdownMonthly,
  fetchCustomerAcquisitionBreakdownWeekly,
} from "@/src/api/customerAcquisition.api";
import Pagination from "@/src/components/pagination";
import { DefaultPerPage } from "@/src/config";

const calculatePercentage = (val1, val2) => {
  if (!val1 || !val2) {
    return 0;
  }

  return (parseFloat(val1) / (parseFloat(val1) + parseFloat(val2))) * 100;
};

const columnToggleInitialValues = ["new_customer", "repeat_customer"];

const columnToggleOptions = [
  { label: "New Customers", value: "new_customer" },
  { label: "Repeat Customer", value: "repeat_customer" },
];

export default function ProductBreakdown() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [percentageView, setPercentageView] = useState(false);
  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);
  const [weeklyView, setWeeklyView] = useState(false);
  const [sorter, setSorter] = useState({});
  const [pageSize, setPageSize] = useState(DefaultPerPage);

  const onViewChange = (checked) => {
    setWeeklyView(checked);
    setLoading(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(
        localStorage.getItem("product-breakdown-columns") || "[]"
      );
      if (data.length !== 0) {
        setColumnToggle(data);
      }
    }
  }, [setColumnToggle]);

  const onChange = (checkedValues) => {
    const data =
      checkedValues.length > 0 ? checkedValues : columnToggleInitialValues;
    localStorage.setItem("product-breakdown-columns", JSON.stringify(data));
    setColumnToggle(data);
  };

  const [filter, setFilter] = useState({
    month: _.range(0, defaultMonth() + 1),
    week: _.range(1, Math.max(defaultWeek(), 2)),
    year: [defaultYear()],
    searchText: "",
  });

  const CustomerAcquisitionBreakdownRes = useSelector(
    weeklyView
      ? selectCustomerAcquisitionBreakdownWeekly
      : selectCustomerAcquisitionBreakdownMonthly
  );

  useEffect(() => {
    if (CustomerAcquisitionBreakdownRes.status) {
      const rows = CustomerAcquisitionBreakdownRes?.items?.map((d) => {
        const data = weeklyView
          ? d.weeks.reduce((acc, item) => {
              acc[`new${item.year * 54 + item.week}`] = item.unique_buyer;
              acc[`repeat${item.year * 54 + item.week}`] = item.returned_buyer;

              acc[`p-new${item.year * 54 + item.week}`] = calculatePercentage(
                item.unique_buyer,
                item.returned_buyer
              );
              acc[`p-repeat${item.year * 54 + item.week}`] =
                calculatePercentage(item.returned_buyer, item.unique_buyer);
              return acc;
            }, {})
          : d.months.reduce((acc, item) => {
              acc[`new${item.year * 12 + item.month}`] = item.unique_buyer;
              acc[`repeat${item.year * 12 + item.month}`] = item.returned_buyer;

              acc[`p-new${item.year * 12 + item.month}`] = calculatePercentage(
                item.unique_buyer,
                item.returned_buyer
              );
              acc[`p-repeat${item.year * 12 + item.month}`] =
                calculatePercentage(item.returned_buyer, item.unique_buyer);

              return acc;
            }, {});

        return {
          asin: d.asin,
          name: d.product_name,
          ytd_unique_buyer: d.ytd_unique_buyer,
          ytd_returned_buyer: d.ytd_returned_buyer,
          "p-ytd_unique_buyer": calculatePercentage(
            d.ytd_unique_buyer,
            d.ytd_returned_buyer
          ),
          "p-ytd_returned_buyer": calculatePercentage(
            d.ytd_returned_buyer,
            d.ytd_unique_buyer
          ),
          ...data,
        };
      });

      setList(rows);
      setTotalData(CustomerAcquisitionBreakdownRes.total);
      setLoading(false);
    } else if (CustomerAcquisitionBreakdownRes?.status === false) {
      setList([]);
      setLoading(false);
    }
  }, [CustomerAcquisitionBreakdownRes]);

  useEffect(() => {
    const { year, month, week, searchText } = filter;
    if (year.length && (weeklyView ? week.length : month.length)) {
      setSorter({});
      setLoading(true);
      const time = setTimeout(() => {
        dispatch(
          weeklyView
            ? getCustomerAcquisitionBreakdownWeekly({
                search_year: year,
                search_week: week?.join(","),
                perPage: pageSize,
                searchText: searchText,
              })
            : getCustomerAcquisitionBreakdownMonthly({
                search_year: year,
                search_month: month?.map((m) => m + 1).join(","),
                perPage: pageSize,
                searchText: searchText,
              })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [filter, weeklyView]);

  const pageChange = (page, perPage) => {
    setLoading(true);
    const { year, month, week, searchText } = filter;
    const params = {
      search_year: year,
      page: page,
      orderBy:
        sorter?.columnKey && sorter.columnKey.includes("repeat")
          ? "returned_buyer"
          : "unique_buyer",
      order: sorter?.order?.slice(0, -3),
      perPage: perPage,
      searchText: searchText,
    };

    dispatch(
      weeklyView
        ? getCustomerAcquisitionBreakdownWeekly({
            ...params,
            search_week: week?.join(","),
          })
        : getCustomerAcquisitionBreakdownMonthly({
            ...params,
            search_month: month?.map((m) => m + 1).join(","),
          })
    );
  };

  const onPageNo = (e) => {
    pageChange(e, CustomerAcquisitionBreakdownRes.limit);
  };

  const onPerPage = (e) => {
    setPageSize(e);
    setLoading(true);
    pageChange(1, e);
  };

  const handleChange = (_pagination, _filters, sorter) => {
    const { year, month, week, searchText } = filter;
    setLoading(true);
    setSorter(sorter);

    const params = {
      search_year: year,
      page: 1,
      orderBy:
        sorter?.columnKey && sorter.columnKey.includes("repeat")
          ? "returned_buyer"
          : "unique_buyer",
      order: sorter?.order?.slice(0, -3),
      perPage: pageSize,
      searchText: searchText,
    };

    dispatch(
      weeklyView
        ? getCustomerAcquisitionBreakdownWeekly({
            ...params,
            search_week: week?.join(","),
          })
        : getCustomerAcquisitionBreakdownMonthly({
            ...params,
            search_month: month?.map((m) => m + 1).join(","),
          })
    );
  };

  const findIntervalsCount = useMemo(
    () =>
      _.uniqBy(
        CustomerAcquisitionBreakdownRes?.items?.reduce((acc, item) => {
          const interval = weeklyView
            ? item.weeks.map((item) => item.year * 54 + item.week)
            : item.months.map((item) => item.year * 12 + item.month);
          acc = acc.concat(interval);
          return acc;
        }, [])
      ).sort((a, b) => a - b),
    [list, filter]
  );

  const intervalGroupColumn =
    findIntervalsCount.map((item) => ({
      title: weeklyView
        ? `${parseInt(item / 54)}-WK${item % 54}`
        : `${parseInt((item - 1) / 12)}-${moment
            .months()
            [(item - 1) % 12].substring(0, 3)}`,
      key: `Interval${item}`,
      children: [
        columnToggle.includes("new_customer") && {
          title: "New Customer",
          key: `new${item}`,
          width: 110,
          sorter: (a, b) =>
            percentageView
              ? (a[`p-new${item}`] || 0) - (b[`p-new${item}`] || 0)
              : (a[`new${item}`] || 0) - (b[`new${item}`] || 0),
          render: (text) => (
            <span>
              <Tooltip
                title={
                  percentageView
                    ? numberFormat(text[`new${item}`] || 0)
                    : percentageFormat(text[`p-new${item}`])
                }
              >
                {percentageView
                  ? percentageFormat(text[`p-new${item}`])
                  : numberFormat(text[`new${item}`] || 0)}
              </Tooltip>
            </span>
          ),
        },
        columnToggle.includes("repeat_customer") && {
          title: "Repeat Customer",
          key: `repeat${item}`,
          width: 110,
          sorter: (a, b) =>
            percentageView
              ? (a[`p-repeat${item}`] || 0) - (b[`p-repeat${item}`] || 0)
              : (a[`repeat${item}`] || 0) - (b[`repeat${item}`] || 0),
          render: (text) => (
            <Tooltip
              title={
                percentageView
                  ? numberFormat(text[`repeat${item}`] || 0)
                  : percentageFormat(text[`p-repeat${item}`])
              }
            >
              {percentageView
                ? percentageFormat(text[`p-repeat${item}`])
                : numberFormat(text[`repeat${item}`] || 0)}
            </Tooltip>
          ),
        },
      ].filter(Boolean),
    })) || [];

  const columns = useMemo(
    () =>
      [
        {
          title: "Row Labels",
          width: 350,
          ellipsis: true,
          key: "name",
          fixed: "left",
          render: (text) => {
            return (
              <span>
                <VendoTooltip title={text.name} placement="top" row={3}>
                  <a
                    className="text-dark mb-2"
                    style={{ fontWeight: 600 }}
                    href={`https://amazon.com/dp/${text.asin}`}
                    title="Click to view on Amazon"
                    target="_blank"
                  >
                    <span className="one min-w-350px">{text.name || "-"}</span>
                  </a>
                </VendoTooltip>
                <span className="d-flex mt-1">
                  <b className="fw-boldest me-2 text-dark">Child ASIN:</b>{" "}
                  <a
                    href={`https://amazon.com/dp/${text.asin}`}
                    target="_blank"
                  >
                    {text.asin || "-"}
                  </a>
                </span>
              </span>
            );
          },
        },
        {
          title: "Total",
          key: `total`,
          children: [
            columnToggle.includes("new_customer") && {
              title: "New Customer",
              key: `ytd-new-customer`,
              width: 110,
              sorter: (a, b) =>
                percentageView
                  ? (a["ytd_unique_buyer"] || 0) - (b["ytd_unique_buyer"] || 0)
                  : (a["ytd_unique_buyer"] || 0) - (b["ytd_unique_buyer"] || 0),
              render: (text) => (
                <Tooltip
                  title={
                    percentageView
                      ? numberFormat(text["ytd_unique_buyer"] || 0)
                      : percentageFormat(text["p-ytd_unique_buyer"])
                  }
                >
                  {percentageView
                    ? percentageFormat(text["p-ytd_unique_buyer"])
                    : numberFormat(text["ytd_unique_buyer"])}
                </Tooltip>
              ),
            },
            columnToggle.includes("repeat_customer") && {
              title: "Repeat Customer",
              key: `ytd-repeat-customer`,
              width: 110,
              sorter: (a, b) =>
                percentageView
                  ? (a["ytd_returned_buyer"] || 0) -
                    (b["ytd_returned_buyer"] || 0)
                  : (a["ytd_returned_buyer"] || 0) -
                    (b["ytd_returned_buyer"] || 0),
              render: (text) => (
                <Tooltip
                  title={
                    percentageView
                      ? numberFormat(text["ytd_returned_buyer"] || 0)
                      : percentageFormat(text["p-ytd_returned_buyer"])
                  }
                >
                  {percentageView
                    ? percentageFormat(text["p-ytd_returned_buyer"])
                    : numberFormat(text["ytd_returned_buyer"])}
                </Tooltip>
              ),
            },
          ],
        },
        ...intervalGroupColumn,
      ].filter(Boolean),
    [list, filter, intervalGroupColumn]
  );

  const exportData = () => {
    message.loading("Loading...");
    const { year, month, week } = filter;

    const params = {
      search_year: year,
      page: 1,
      perPage: 999999,
      orderBy: "unique_buyer",
      order: "desc",
    };

    (weeklyView
      ? fetchCustomerAcquisitionBreakdownWeekly({
          ...params,
          search_week: week?.join(","),
        })
      : fetchCustomerAcquisitionBreakdownMonthly({
          ...params,
          search_month: month?.map((m) => m + 1).join(","),
        })
    )
      .then((res) => {
        if (res.status === 200 && res.data) {
          const expData = res.data?.items?.map((d) => {
            const row = weeklyView
              ? d.weeks.reduce((acc, item) => {
                  if (percentageView) {
                    acc[`new${item.year * 54 + item.week}`] = percentageFormat(
                      calculatePercentage(
                        item.unique_buyer,
                        item.returned_buyer
                      )
                    );
                    acc[`repeat${item.year * 54 + item.week}`] =
                      percentageFormat(
                        calculatePercentage(
                          item.returned_buyer,
                          item.unique_buyer
                        )
                      );
                  } else {
                    acc[`new${item.year * 54 + item.week}`] = numberFormat(
                      item.unique_buyer
                    );
                    acc[`repeat${item.year * 54 + item.week}`] = numberFormat(
                      item.returned_buyer
                    );
                  }

                  return acc;
                }, {})
              : d.months.reduce((acc, item) => {
                  if (percentageView) {
                    acc[`new${item.year * 12 + item.month}`] = percentageFormat(
                      calculatePercentage(
                        item.unique_buyer,
                        item.returned_buyer
                      )
                    );
                    acc[`repeat${item.year * 12 + item.month}`] =
                      percentageFormat(
                        calculatePercentage(
                          item.returned_buyer,
                          item.unique_buyer
                        )
                      );
                  } else {
                    acc[`new${item.year * 12 + item.month}`] = numberFormat(
                      item.unique_buyer
                    );
                    acc[`repeat${item.year * 12 + item.month}`] = numberFormat(
                      item.returned_buyer
                    );
                  }

                  return acc;
                }, {});

            const obj = {
              asin: d.asin,
              name: d.product_name,
              ...(percentageView
                ? {
                    ytd_unique_buyer: percentageFormat(
                      calculatePercentage(
                        d.ytd_unique_buyer,
                        d.ytd_returned_buyer
                      )
                    ),
                    ytd_returned_buyer: percentageFormat(
                      calculatePercentage(
                        d.ytd_returned_buyer,
                        d.ytd_unique_buyer
                      )
                    ),
                  }
                : {
                    ytd_unique_buyer: d.ytd_unique_buyer,
                    ytd_returned_buyer: d.ytd_returned_buyer,
                  }),
            };

            findIntervalsCount.map((index) => {
              obj[`new${index}`] = row[`new${index}`] || 0;
              obj[`repeat${index}`] = row[`repeat${index}`] || 0;
            });

            return obj;
          });

          exportToExcel({
            columns: [
              "ASIN",
              "Product Name",
              "Total New Customers",
              "Total Repeat Customers",
            ].concat(
              findIntervalsCount
                .map((a) => {
                  const label = weeklyView
                    ? `${parseInt(a / 54)}-WK${a % 54}`
                    : `${parseInt(a / 12)}-${moment
                        .months()
                        [(a - 1) % 12].substring(0, 3)}`;
                  return [
                    `${label} New Customers`,
                    `${label} Repeat Customers`,
                  ];
                })
                .flat()
            ),
            fileName: `product-breakdown${weeklyView ? "weekly" : "monthly"}`,
            rows: expData,
          });
        } else {
          message.error("No Sales data details available yet.");
        }
        message.destroy();
      })
      .catch((err) => {
        console.log(err);
        message.destroy();
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };

  const summary = useMemo(() => {
    const ytd_unique_buyer = totalData.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.total_unique_buyer),
      0
    );

    const ytd_returned_buyer = totalData.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.total_returned_buyer),
      0
    );

    const obj = {
      [percentageView ? "ytd_unique_buyer-tooltip" : "ytd_unique_buyer"]:
        numberFormat(ytd_unique_buyer),
      [percentageView ? "ytd_unique_buyer" : "ytd_unique_buyer-tooltip"]:
        percentageFormat(
          calculatePercentage(ytd_unique_buyer, ytd_returned_buyer)
        ),

      [percentageView ? "ytd_returned_buyer-tooltip" : "ytd_returned_buyer"]:
        numberFormat(ytd_returned_buyer),
      [percentageView ? "ytd_returned_buyer" : "ytd_returned_buyer-tooltip"]:
        percentageFormat(
          calculatePercentage(ytd_returned_buyer, ytd_unique_buyer)
        ),
    };

    totalData.forEach((data) => {
      const interval = weeklyView
        ? data.year * 54 + data.week
        : data.year * 12 + data.month;

      obj[`new${percentageView ? "" : "-tooltip"}${interval}`] =
        percentageFormat(
          calculatePercentage(
            data.total_unique_buyer,
            data.total_returned_buyer
          )
        );
      obj[`repeat${percentageView ? "" : "-tooltip"}${interval}`] =
        percentageFormat(
          calculatePercentage(
            data.total_returned_buyer,
            data.total_unique_buyer
          )
        );
      obj[`new${percentageView ? "-tooltip" : ""}${interval}`] = numberFormat(
        data.total_unique_buyer || 0
      );
      obj[`repeat${percentageView ? "-tooltip" : ""}${interval}`] =
        numberFormat(data.total_returned_buyer || 0);
    });

    return obj;
  }, [totalData, percentageView]);

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="float-start w-auto">
              {TopBarFilter(filter, setFilter, weeklyView ? "Week" : "Month", {
                year_mode: "multiple",
                showSearchBar: true,
              })}
            </div>
            <div className="w-auto d-flex card card-flush h-xl-100">
              <div className="card-body px-8 py-7">
                <span>Monthly</span>
                <Switch
                  checked={weeklyView}
                  onChange={onViewChange}
                  className="mx-4"
                />
                <span>Weekly</span>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card mb-7 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-end">
                  <div className="card-toolbar gap-3 pt-2">
                    <Checkbox.Group
                      options={columnToggleOptions}
                      value={columnToggle}
                      onChange={onChange}
                    />
                  </div>
                  <button
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                    onClick={() => setPercentageView(!percentageView)}
                  >
                    {percentageView ? "Percentage" : "Number"} View
                  </button>
                  <button
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={exportData}
                  >
                    Export
                  </button>
                </div>
                <div>
                  {list.length == 0 ? (
                    <NoData />
                  ) : (
                    <ASINTable
                      columns={columns}
                      dataSource={list}
                      rowKey="key"
                      loading={loading}
                      pagination={false}
                      onChange={handleChange}
                      scroll={{
                        y:
                          typeof window !== "undefined"
                            ? window.innerHeight - 310
                            : undefined,
                      }}
                      summary={() => (
                        <Table.Summary fixed className="aaa">
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                              <b>Total</b>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                              {columnToggle.includes("new_customer") && (
                                <Tooltip
                                  title={summary["ytd_unique_buyer-tooltip"]}
                                >
                                  <b>{summary["ytd_unique_buyer"]}</b>
                                </Tooltip>
                              )}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              {columnToggle.includes("repeat_customer") && (
                                <Tooltip
                                  title={summary["ytd_returned_buyer-tooltip"]}
                                >
                                  <b>{summary["ytd_returned_buyer"]}</b>
                                </Tooltip>
                              )}
                            </Table.Summary.Cell>
                            {findIntervalsCount
                              .map((k) => [
                                columnToggle.includes("new_customer") && (
                                  <Table.Summary.Cell key={k + 3}>
                                    <Tooltip title={summary[`new-tooltip${k}`]}>
                                      <b>{summary[`new${k}`]}</b>
                                    </Tooltip>
                                  </Table.Summary.Cell>
                                ),
                                columnToggle.includes("repeat_customer") && (
                                  <Table.Summary.Cell key={k + 222}>
                                    <Tooltip
                                      title={summary[`repeat-tooltip${k}`]}
                                    >
                                      <b>{summary[`repeat${k}`]}</b>
                                    </Tooltip>
                                  </Table.Summary.Cell>
                                ),
                              ])
                              .flat()}
                          </Table.Summary.Row>
                        </Table.Summary>
                      )}
                    />
                  )}
                  <div className="row pt-2">
                    <Pagination
                      loading={
                        loading || CustomerAcquisitionBreakdownRes.count == 0
                      }
                      pageSize={CustomerAcquisitionBreakdownRes.limit}
                      page={CustomerAcquisitionBreakdownRes.page}
                      totalPage={CustomerAcquisitionBreakdownRes.count}
                      onPerPage={onPerPage}
                      onPageNo={onPageNo}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

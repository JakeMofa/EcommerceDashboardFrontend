import { useEffect, useState, useMemo } from "react";
import TopBarFilter from "@/src/components/customer-acquisition/category-breakdown-filter";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { defaultYear, defaultMonth, defaultWeek } from "@/src/config";
import {
  getCustomerAcquisitionCategoryBreakdownMonthly,
  getCustomerAcquisitionCategoryBreakdownWeekly,
} from "@/src/services/customerAcquisition.services";
import NoData from "@/src/components/no-data";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomerAcquisitionCategoryBreakdownMonthly } from "@/src/store/slice/customerAcquisitionCategoryBreakdownMonthly.slice";
import { selectCustomerAcquisitionCategoryBreakdownWeekly } from "@/src/store/slice/customerAcquisitionCategoryBreakdownWeekly.slice";
import _ from "lodash";
import {
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import moment from "moment";
import { Tooltip, Table, Checkbox, Switch } from "antd";

const calculatePercentage = (val1, val2) => {
  if (!val1 || !val2) {
    return 0;
  }

  return (val1 / (val1 + val2)) * 100;
};

const columnToggleInitialValues = ["new_customer", "repeat_customer"];

const columnToggleOptions = [
  { label: "New Customers", value: "new_customer" },
  { label: "Repeat Customer", value: "repeat_customer" },
];

export default function CategoryBreakdown() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [percentageView, setPercentageView] = useState(false);
  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);
  const [weeklyView, setWeeklyView] = useState(false);

  const onViewChange = (checked) => {
    setWeeklyView(checked);
    setLoading(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(
        localStorage.getItem("category-breakdown-columns") || "[]"
      );
      if (data.length !== 0) {
        setColumnToggle(data);
      }
    }
  }, [setColumnToggle]);

  const onChange = (checkedValues) => {
    const data =
      checkedValues.length > 0 ? checkedValues : columnToggleInitialValues;
    localStorage.setItem("category-breakdown-columns", JSON.stringify(data));
    setColumnToggle(data);
  };

  const [filter, setFilter] = useState({
    month: _.range(0, defaultMonth() + 1),
    year: [defaultYear()],
    week: _.range(1, Math.max(defaultWeek(), 2)),
    categories: [],
  });

  const CustomerAcquisitionBreakdownRes = useSelector(
    weeklyView
      ? selectCustomerAcquisitionCategoryBreakdownWeekly
      : selectCustomerAcquisitionCategoryBreakdownMonthly
  );

  useEffect(() => {
    if (CustomerAcquisitionBreakdownRes.status) {
      const total = { ytd_unique_buyer: 0, ytd_returned_buyer: 0 };

      const rows = CustomerAcquisitionBreakdownRes?.data?.map((d) => {
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

              total[`new${item.year * 54 + item.week}`] =
                (total[`new${item.year * 54 + item.week}`] || 0) +
                item.unique_buyer;
              total[`repeat${item.year * 54 + item.week}`] =
                (total[`repeat${item.year * 54 + item.week}`] || 0) +
                item.returned_buyer;
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

              total[`new${item.year * 12 + item.month}`] =
                (total[`new${item.year * 12 + item.month}`] || 0) +
                item.unique_buyer;
              total[`repeat${item.year * 12 + item.month}`] =
                (total[`repeat${item.year * 12 + item.month}`] || 0) +
                item.returned_buyer;
              return acc;
            }, {});

        total["ytd_unique_buyer"] =
          total["ytd_unique_buyer"] + d.total_unique_buyer;
        total["ytd_returned_buyer"] =
          total["ytd_returned_buyer"] + d.total_returned_buyer;

        return {
          category: d.category,
          ytd_unique_buyer: d.total_unique_buyer,
          ytd_returned_buyer: d.total_returned_buyer,
          "p-ytd_unique_buyer": calculatePercentage(
            d.total_unique_buyer,
            d.total_returned_buyer
          ),
          "p-ytd_returned_buyer": calculatePercentage(
            d.total_returned_buyer,
            d.total_unique_buyer
          ),

          ...data,
        };
      });

      setList(rows);
      setTotalData(total);
      setLoading(false);
    } else if (CustomerAcquisitionBreakdownRes?.status === false) {
      setList([]);
      setLoading(false);
    }
  }, [CustomerAcquisitionBreakdownRes]);

  useEffect(() => {
    const { year, month, week, categories } = filter;
    if (year.length && (weeklyView ? week.length : month.length)) {
      setLoading(true);
      const time = setTimeout(() => {
        dispatch(
          weeklyView
            ? getCustomerAcquisitionCategoryBreakdownWeekly({
                search_category: categories.join(","),
                search_year: year,
                search_week: week?.join(","),
              })
            : getCustomerAcquisitionCategoryBreakdownMonthly({
                search_category: categories.join(","),
                search_year: year,
                search_month: month?.map((m) => m + 1).join(","),
              })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [filter, weeklyView]);

  const findIntervalsCount = useMemo(
    () =>
      _.uniqBy(
        CustomerAcquisitionBreakdownRes?.data?.reduce((acc, item) => {
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
          width: 250,
          ellipsis: true,
          key: "name",
          fixed: "left",
          render: (text) => {
            return <span>{text.category}</span>;
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

  const summary = useMemo(() => {
    const obj = {
      category: "Total",
      [percentageView ? "ytd_unique_buyer-tooltip" : "ytd_unique_buyer"]:
        numberFormat(totalData.ytd_unique_buyer),
      [percentageView ? "ytd_unique_buyer" : "ytd_unique_buyer-tooltip"]:
        percentageFormat(
          calculatePercentage(
            totalData.ytd_unique_buyer,
            totalData.ytd_returned_buyer
          )
        ),

      [percentageView ? "ytd_returned_buyer-tooltip" : "ytd_returned_buyer"]:
        numberFormat(totalData.ytd_returned_buyer),
      [percentageView ? "ytd_returned_buyer" : "ytd_returned_buyer-tooltip"]:
        percentageFormat(
          calculatePercentage(
            totalData.ytd_returned_buyer,
            totalData.ytd_unique_buyer
          )
        ),
    };
    findIntervalsCount.map((index) => {
      obj[`new${percentageView ? "" : "-tooltip"}${index}`] = percentageFormat(
        calculatePercentage(
          totalData[`new${index}`],
          totalData[`repeat${index}`]
        )
      );
      obj[`repeat${percentageView ? "" : "-tooltip"}${index}`] =
        percentageFormat(
          calculatePercentage(
            totalData[`repeat${index}`],
            totalData[`new${index}`]
          )
        );
      obj[`new${percentageView ? "-tooltip" : ""}${index}`] = numberFormat(
        totalData[`new${index}`] || 0
      );
      obj[`repeat${percentageView ? "-tooltip" : ""}${index}`] = numberFormat(
        totalData[`repeat${index}`] || 0
      );
    });

    return obj;
  }, [totalData, percentageView]);

  const exportList = useMemo(
    () =>
      list
        .map((row) => {
          const obj = _.pick(row, ["category"]);
          if (percentageView) {
            obj["ytd_unique_buyer"] = percentageFormat(
              row["p-ytd_unique_buyer"]
            );
            obj["ytd_returned_buyer"] = percentageFormat(
              row["p-ytd_returned_buyer"]
            );
          } else {
            obj["ytd_unique_buyer"] = numberFormat(row["ytd_unique_buyer"]);
            obj["ytd_returned_buyer"] = numberFormat(row["ytd_returned_buyer"]);
          }
          findIntervalsCount.map((index) => {
            if (percentageView) {
              obj[`new${index}`] = percentageFormat(row[`p-new${index}`] || 0);
              obj[`repeat${index}`] = percentageFormat(
                row[`p-repeat${index}`] || 0
              );
            } else {
              obj[`new${index}`] = numberFormat(row[`new${index}`] || 0);
              obj[`repeat${index}`] = numberFormat(row[`repeat${index}`] || 0);
            }
          });

          return obj;
        })
        .concat([
          _.pick(
            summary,
            Object.keys(summary).filter((k) => !k.includes("-tooltip"))
          ),
        ]),
    [list, percentageView]
  );

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="float-start w-auto">
              {TopBarFilter(filter, setFilter, weeklyView ? "Week" : "Month", {
                year_mode: "multiple",
              })}
            </div>
            <div className="w-auto d-flex card card-flush h-xl-100">
              <div className="card-body px-2 py-7">
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
                  <ExportToExcel
                    columns={[
                      "Category",
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
                    )}
                    rows={exportList}
                    fileName={`category-breakdown-${
                      weeklyView ? "weekly" : "monthly"
                    }`}
                    loading={loading}
                  >
                    <button className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3">
                      Export Data
                    </button>
                  </ExportToExcel>
                </div>

                {loading ? (
                  <Loading />
                ) : list?.length != 0 ? (
                  <ASINTable
                    columns={columns}
                    dataSource={list}
                    rowKey="key"
                    loading={loading}
                    pagination={false}
                    scroll={{
                      y:
                        typeof window !== "undefined"
                          ? window.innerHeight - 310
                          : undefined,
                    }}
                    summary={() => (
                      <Table.Summary fixed>
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
                                <Table.Summary.Cell key={k + 2}>
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
                ) : (
                  <NoData />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState, useMemo } from "react";
import { TopBarFilter } from "@/src/components/sales-analytics/sales";
import Details from "@/src/components/Details";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { defaultYear } from "@/src/config";
import {
  getCustomerAcquisitionMonthly,
  getCustomerAcquisitionWeekly,
} from "@/src/services/customerAcquisition.services";
import NoData from "@/src/components/no-data";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomerAcquisitionMonthly } from "@/src/store/slice/customerAcquisitionMonthly.slice";
import { selectCustomerAcquisitionWeekly } from "@/src/store/slice/customerAcquisitionWeekly.slice";

import _ from "lodash";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
  weekDateRange,
} from "@/src/helpers/formatting.helpers";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import { Tooltip, Switch, Table, message } from "antd";
import moment from "moment";

import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";
import Drawer from "@/src/components/drawer";

const calculateChange = (val1, val2) => {
  if (!val1 || !val2) {
    return 0;
  }

  return ((val1 - val2) / val2) * 100;
};

const configurationMonthlyKey = "new-vs-repeat-monthly";
const configurationWeeklyKey = "new-vs-repeat-weekly";

const configColumnList = [
  "CUSTOMERS",
  "NEW CUSTOMER",
  "REPEAT CUSTOMER",
  "NEW CUSTOMERS TOTAL REVENUE",
  "REPEAT CUSTOMERS TOTAL REVENUE",
  "NEW CUSTOMERS AOV",
  "REPEAT CUSTOMERS AOV",
  "AD SPEND",
  "CAC",
];

export default function CustomerAcquisitionNewVSRepeat() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [weeklyView, setWeeklyView] = useState(false);
  const [list, setList] = useState([]);
  const [percentageView, setPercentageView] = useState(false);

  const [weeklyConfigOpen, setWeeklyConfigOpen] = useState(false);
  const [monthlyConfigOpen, setMonthlyConfigOpen] = useState(false);
  const [weeklyColumnConfig, setWeeklyColumnConfig] = useState([]);
  const [weeklyColumnConfigLoaded, setWeeklyColumnConfigLoaded] =
    useState(false);
  const [monthlyColumnConfig, setMonthlyColumnConfig] = useState([]);
  const [monthlyColumnConfigLoaded, setMonthlyColumnConfigLoaded] =
    useState(false);

  const [filter, setFilter] = useState({
    month: _.range(0, 12),
    week: _.range(1, 54),
    year: [defaultYear()],
  });

  const CustomerAcquisitionRes = useSelector(
    weeklyView
      ? selectCustomerAcquisitionWeekly
      : selectCustomerAcquisitionMonthly
  );

  const totalCustomers = CustomerAcquisitionRes.data.list.reduce(
    (a, b) => a + parseFloat(b.customer_count),
    0
  );
  const repeatingCustomers = CustomerAcquisitionRes.data.list.reduce(
    (a, b) => a + parseFloat(b.old_customer_count),
    0
  );
  const newCustomers = CustomerAcquisitionRes.data.list.reduce(
    (a, b) => a + parseFloat(b.new_customer_count),
    0
  );

  const newCustomersSale = CustomerAcquisitionRes.data.list.reduce(
    (a, b) => a + (parseFloat(b.new_customer_sale) || 0),
    0
  );

  const repeatCustomersSale = CustomerAcquisitionRes.data.list.reduce(
    (a, b) => a + (parseFloat(b.old_customer_sale) || 0),
    0
  );

  const CustomerAcquisitionResTotal = CustomerAcquisitionRes.data.total;

  useEffect(() => {
    const { year, month, week } = filter;
    if (
      year.length > 0 &&
      ((!weeklyView && month.length > 0) || (weeklyView && week.length > 0))
    ) {
      setLoading(true);
      const time = setTimeout(() => {
        dispatch(
          weeklyView
            ? getCustomerAcquisitionWeekly({
                search_year: year?.join(","),
                search_week: week?.join(","),
              })
            : getCustomerAcquisitionMonthly({
                search_year: year,
                search_month: month?.join(","),
              })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [weeklyView, filter]);

  const calculatePercentage = (val, total) => {
    if (!val || !total) {
      return 0;
    }

    return (val / total) * 100;
  };

  useEffect(() => {
    if (CustomerAcquisitionRes.status) {
      setList(
        CustomerAcquisitionRes.data.list
          ?.map((d) => ({
            old_customer_percentage: calculatePercentage(
              d.old_customer_count,
              d.customer_count
            ),
            new_customer_percentage: calculatePercentage(
              d.new_customer_count,
              d.customer_count
            ),
            row_label: weeklyView
              ? "WK" + d.week + "-" + d.year
              : d.month_name.substring(0, 3) + "-" + d.year,
            row_label_sort: d.year * 100 + (weeklyView ? d.week : d.month),
            ...d,
          }))
          .sort((a, b) => a.row_label_sort - b.row_label_sort) || []
      );
      setLoading(false);
    } else if (CustomerAcquisitionRes?.status === true) {
      setList([]);
      setLoading(false);
    }
  }, [weeklyView, CustomerAcquisitionRes]);

  const columns = useMemo(
    () =>
      [
        {
          title: "ROW LABEL",
          width: "120px",
          align: "center",
          sorter: (a, b) => a.row_label_sort - b.row_label_sort,
          render: (text) => {
            return weeklyView ? (
              <Tooltip title={weekDateRange(text.year, text.week)}>
                {text.row_label}
              </Tooltip>
            ) : (
              text.row_label
            );
          },
        },
        {
          title: "CUSTOMERS",
          width: "120px",
          align: "center",
          sorter: (a, b) => a.customer_count - b.customer_count,
          render: (text) => {
            return numberFormat(text?.customer_count);
          },
        },
        {
          title: "NEW CUSTOMER",
          width: "150px",
          align: "center",
          sorter: (a, b) => a.new_customer_count - b.new_customer_count,
          render: (text) => {
            return (
              <span>
                <Tooltip
                  title={
                    percentageView
                      ? numberFormat(text?.new_customer_count)
                      : percentageFormat(text?.new_customer_percentage)
                  }
                >
                  {percentageView
                    ? percentageFormat(text?.new_customer_percentage)
                    : numberFormat(text?.new_customer_count)}
                </Tooltip>
              </span>
            );
          },
        },
        {
          title: "REPEAT CUSTOMER",
          width: "160px",
          align: "center",
          sorter: (a, b) => a.old_customer_count - b.old_customer_count,
          render: (text) => {
            return (
              <span>
                <Tooltip
                  title={
                    percentageView
                      ? numberFormat(text?.old_customer_count)
                      : percentageFormat(text?.old_customer_percentage)
                  }
                >
                  {percentageView
                    ? percentageFormat(text?.old_customer_percentage)
                    : numberFormat(text?.old_customer_count)}
                </Tooltip>
              </span>
            );
          },
        },
        {
          title: "NEW CUSTOMERS TOTAL REVENUE",
          width: "250px",
          align: "center",
          sorter: (a, b) => a.new_customer_sale - b.new_customer_sale,
          render: (text) => {
            return currencyFormat(text?.new_customer_sale);
          },
        },
        {
          title: "REPEAT CUSTOMERS TOTAL REVENUE",
          width: "270px",
          align: "center",
          sorter: (a, b) => a.old_customer_sale - b.old_customer_sale,
          render: (text) => {
            return currencyFormat(text?.old_customer_sale);
          },
        },
        {
          title: "NEW CUSTOMERS AOV",
          width: "180px",
          align: "center",
          sorter: (a, b) =>
            a.new_customer_purchase_aov - b.new_customer_purchase_aov,
          render: (text) => {
            return currencyFormat(text?.new_customer_purchase_aov, 2);
          },
        },
        {
          title: "REPEAT CUSTOMERS AOV",
          width: "200px",
          align: "center",
          sorter: (a, b) =>
            a.old_customer_purchase_aov - b.old_customer_purchase_aov,
          render: (text) => {
            return currencyFormat(text?.old_customer_purchase_aov, 2);
          },
        },
        {
          title: "AD SPEND",
          width: "120px",
          align: "center",
          sorter: (a, b) => (a.spend || 0) - (b.spend || 0),
          render: (text) => {
            return currencyFormat(text?.spend);
          },
        },
        {
          title: "CAC",
          width: "100px",
          align: "center",
          render: (text) => {
            return currencyFormat(text?.spend / text?.new_customer_count, 2);
          },
        },
      ].filter(
        (c) =>
          (weeklyView ? weeklyColumnConfig : monthlyColumnConfig).includes(
            c.title
          ) || c.title === "ROW LABEL"
      ),
    [weeklyView, percentageView, weeklyColumnConfig, monthlyColumnConfig]
  );

  const summary = useMemo(() => {
    const [secondLastRow, lastRow] = (
      list.sort((a, b) => a.row_label_sort - b.row_label_sort) || []
    ).slice(list.length - 2, list.length);

    const lastRowCAC = lastRow?.spend / (lastRow?.new_customer_count || 1);
    const secondLastRowCAS =
      secondLastRow?.spend / (secondLastRow?.new_customer_count || 1);

    const effectiveConfig = weeklyView
      ? weeklyColumnConfig
      : monthlyColumnConfig;

    const mapping = {
      customer_count: "CUSTOMERS",
      new_customer_count: "NEW CUSTOMER",
      old_customer_count: "REPEAT CUSTOMER",
      new_customer_sale: "NEW CUSTOMERS TOTAL REVENUE",
      old_customer_sale: "REPEAT CUSTOMERS TOTAL REVENUE",
      new_customer_purchase_aov: "NEW CUSTOMERS AOV",
      old_customer_purchase_aov: "REPEAT CUSTOMERS AOV",
      spend: "AD SPEND",
    };

    return Object.keys(mapping)
      .filter((k) => effectiveConfig.includes(mapping[k]))
      .map((col) =>
        percentageFormat(calculateChange(lastRow?.[col], secondLastRow?.[col]))
      )
      .concat(
        effectiveConfig.includes("CAC")
          ? [percentageFormat(calculateChange(lastRowCAC, secondLastRowCAS))]
          : []
      );
  }, [list, weeklyView, weeklyColumnConfig, monthlyColumnConfig]);

  const onChange = (checked) => {
    setWeeklyView(checked);
  };

  useEffect(() => {
    setMonthlyColumnConfig(configColumnList);
    setWeeklyColumnConfig(configColumnList);

    fetchConfigurations(configurationMonthlyKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setMonthlyColumnConfig(res.data);
          setMonthlyColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });

    fetchConfigurations(configurationWeeklyKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setWeeklyColumnConfig(res.data);
          setWeeklyColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  }, []);

  useEffect(() => {
    if (monthlyColumnConfigLoaded && monthlyColumnConfig.length > 0) {
      updateConfigurations(configurationMonthlyKey, monthlyColumnConfig);
    }
  }, [monthlyColumnConfig]);

  useEffect(() => {
    if (weeklyColumnConfigLoaded && weeklyColumnConfig.length > 0) {
      updateConfigurations(configurationWeeklyKey, weeklyColumnConfig);
    }
  }, [weeklyColumnConfig]);

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
          </div>
          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-body py-3 pt-5">
                  <div className="row g-3">
                    <Details
                      loading={loading}
                      data={[
                        {
                          title: "Customers",
                          value: totalCustomers,
                        },
                        {
                          title: "Repeat Customer",
                          value: repeatingCustomers,
                        },
                        {
                          title: "New Customer",
                          value: newCustomers,
                        },

                        {
                          title: "New Customer AOV",
                          value: currencyFormat(
                            CustomerAcquisitionResTotal.new_customers_average_aov,
                            2
                          ),
                        },
                        {
                          title: "Repeat Customer AOV",
                          value: currencyFormat(
                            CustomerAcquisitionResTotal.old_customers_average_aov,
                            2
                          ),
                        },
                        {
                          title: "Total AOV",
                          value: currencyFormat(
                            CustomerAcquisitionResTotal.totalAov,
                            2
                          ),
                        },
                        {
                          title: "New Customer Sale",
                          value: currencyFormat(newCustomersSale),
                        },
                        {
                          title: "Repeat Customer Sale",
                          value: currencyFormat(repeatCustomersSale),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card mb-7 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-end">
                  <button
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                    onClick={() => setPercentageView(!percentageView)}
                  >
                    {percentageView ? "Percentage" : "Number"} View
                  </button>
                  <ExportToExcel
                    columns={[
                      "month",
                      ...columns
                        .slice(1)
                        .map((item) => item.title.toLowerCase()),
                    ]}
                    rows={list.map((text) => [
                      text.row_label,
                      numberFormat(text?.customer_count),
                      percentageView
                        ? percentageFormat(text?.new_customer_percentage)
                        : numberFormat(text?.new_customer_count),
                      percentageView
                        ? percentageFormat(text?.old_customer_percentage)
                        : numberFormat(text?.old_customer_count),
                      currencyFormat(text?.new_customer_sale),
                      currencyFormat(text?.old_customer_sale),
                      currencyFormat(text?.new_customer_purchase_aov, 2),
                      currencyFormat(text?.old_customer_purchase_aov, 2),
                      currencyFormat(text?.spend),
                      currencyFormat(text?.spend / text?.new_customer_count),
                    ])}
                    fileName={"new-vs-repeat"}
                    loading={loading}
                  >
                    <button className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3">
                      Export Data
                    </button>
                  </ExportToExcel>

                  <button
                    onClick={() =>
                      weeklyView
                        ? setWeeklyConfigOpen(true)
                        : setMonthlyConfigOpen(true)
                    }
                    className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                    id="kt_drawer_example_basic_button"
                  >
                    {" "}
                    Configuration{" "}
                  </button>
                </div>

                {loading ? (
                  <Loading />
                ) : list?.length != 0 ? (
                  <ASINTable
                    columns={columns}
                    dataSource={list}
                    ellipsis
                    rowKey="key"
                    loading={loading}
                    pagination={false}
                    scroll={{
                      x:
                        columns
                          ?.map((d) => Number(d.width.replace("px", "")))
                          .reduce((a, b) => a + b, 0) + 300,
                      y:
                        typeof window !== "undefined"
                          ? window.innerHeight - 310
                          : undefined,
                    }}
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row className="text-center">
                          <Table.Summary.Cell key={0}>
                            <b>{weeklyView ? "WoW" : "MoM"} CHG</b>
                          </Table.Summary.Cell>

                          {summary.map((v, i) => (
                            <Table.Summary.Cell key={i}>
                              <b className="number-font">{v}</b>
                            </Table.Summary.Cell>
                          ))}
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

        {monthlyConfigOpen && (
          <Drawer
            columnsList={configColumnList}
            columnConfig={monthlyColumnConfig}
            setColumnConfig={setMonthlyColumnConfig}
            defaultConfig={configColumnList}
            open={monthlyConfigOpen}
            onHide={() => {
              setMonthlyConfigOpen(false);
            }}
          />
        )}

        {weeklyConfigOpen && (
          <Drawer
            columnsList={configColumnList}
            columnConfig={weeklyColumnConfig}
            setColumnConfig={setWeeklyColumnConfig}
            defaultConfig={configColumnList}
            open={weeklyConfigOpen}
            onHide={() => {
              setWeeklyConfigOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

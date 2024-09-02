import { useEffect, useMemo, useState } from "react";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  getCustomerAcquisitionLTV,
  getCustomerAcquisitionPredictiveLTV,
} from "@/src/services/customerAcquisition.services";
import {
  selectCustomerAcquisitionLTV,
  selectCustomerAcquisitionPredictiveLTV,
} from "@/src/store/slice/customerAcquisitionLTV.slice";
import moment from "moment";
import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { numberFormat } from "@/src/helpers/formatting.helpers";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import { Tooltip, Checkbox, Select } from "antd";

const columnToggleInitialValues = ["ltv", "customer_lifespan"];

const columnToggleOptions = [
  { label: "LTV", value: "ltv" },
  { label: "Customer Lifespan", value: "customer_lifespan" },
];

export default function SalesByMonth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [percentageView, setPercentageView] = useState(false);
  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);

  const [filter, setFilter] = useState({
    month: _.range(0, 12),
    year: _.range(2020, 2026),
  });

  const [predictiveLtvMonths, setPredictiveLtvMonths] = useState(0);

  const CustomerAcquisitionLTVRes = useSelector(selectCustomerAcquisitionLTV);
  const CustomerAcquisitionPredictiveLTVRes = useSelector(
    selectCustomerAcquisitionPredictiveLTV
  );

  const { year, month } = filter;

  useEffect(() => {
    if (month.length > 0 && year) {
      let time = setTimeout(() => {
        dispatch(
          getCustomerAcquisitionLTV({
            search_year: year?.join(","),
            search_month: month?.join(","),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [year, month]);

  useEffect(() => {
    let time = setTimeout(() => {
      dispatch(
        getCustomerAcquisitionPredictiveLTV({
          months: predictiveLtvMonths,
        })
      );
    }, 600);
    return () => {
      clearTimeout(time);
    };
  }, [predictiveLtvMonths]);

  useEffect(() => {
    if (CustomerAcquisitionLTVRes.status) {
      setList(CustomerAcquisitionLTVRes.data.list || []);
      setLoading(false);
    } else if (CustomerAcquisitionLTVRes?.status === false) {
      setList([]);
      setLoading(false);
    }
  }, [CustomerAcquisitionLTVRes]);

  const calculatePercentage = (val, total) => {
    if (!val || !total) {
      return 0;
    }

    return (val / total) * 100;
  };

  const listContent = list
    .map((item) => {
      const months = item.otherMonths.reduce((acc, m) => {
        acc[`m-${m.index}`] = m.newCustomerSalesTotal;
        if (m.index) {
          acc[`m-p-${m.index}`] = calculatePercentage(
            m.newCustomerSalesTotal,
            item.otherMonths[0].newCustomerSalesTotal
          );
        }
        return acc;
      }, {});
      return {
        row_id: item.index,
        row_label: `${moment().month(item.month).format("MMM")}-${item.year}`,
        customers: numberFormat(item.newCustomerCount),
        ltv: currencyFormat(
          item.otherMonths.reduce(
            (a, b) => a + parseFloat(b.newCustomerSalesTotal),
            0
          ) / item.newCustomerCount,
          2
        ),
        lifespan: percentageFormat(
          Object.keys(months).reduce(
            (sum, key) => sum + (key.startsWith("m-p-") ? months[key] : 0),
            0
          )
        ),
        ...months,
      };
    })
    .sort((a, b) => a.row_id - b.row_id);

  const columns = useMemo(() => {
    return [
      {
        title: "CUSTOMER MADE FIRST ORDER AT",
        width: 200,
        align: "center",
        fixed: true,
        render: (text) => {
          return <b>{text?.row_label}</b>;
        },
      },
      {
        title: "NUMBER OF NEW CUSTOMERS",
        width: 110,
        align: "center",
        render: (text) => {
          return text?.customers;
        },
      },
      ...(columnToggle.includes("ltv")
        ? [
            {
              title: "LTV",
              width: 110,
              align: "center",
              render: (text) => {
                return text?.ltv;
              },
            },
          ]
        : []),

      ...(columnToggle.includes("customer_lifespan")
        ? [
            {
              title: "CUSTOMER LIFESPAN",
              width: 110,
              align: "center",
              render: (text) => {
                return text?.lifespan;
              },
            },
          ]
        : []),
      ...list.slice().map((item, key) => {
        return {
          title: `Month ${key}`,
          width: 100,
          align: "center",
          index: item.index,
          render: (text) => {
            return item.index && text[`m-${item.index}`] ? (
              <span>
                <Tooltip
                  title={
                    percentageView
                      ? currencyFormat(text[`m-${item.index}`])
                      : percentageFormat(text[`m-p-${item.index}`])
                  }
                >
                  {percentageView
                    ? percentageFormat(text[`m-p-${item.index}`])
                    : currencyFormat(text[`m-${item.index}`])}
                </Tooltip>
              </span>
            ) : text[`m-${item.index}`] ? (
              currencyFormat(text[`m-${item.index}`])
            ) : null;
          },
        };
      }),
    ];
  }, [list, percentageView, columnToggle]);

  const exportMonthColumn = (index, text) => {
    return index && text[`m-${index}`]
      ? percentageView
        ? percentageFormat(text[`m-p-${index}`])
        : currencyFormat(text[`m-${index}`])
      : text[`m-${index}`]
      ? currencyFormat(text[`m-${index}`])
      : null;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("ltv-columns") || "[]");
      if (data.length !== 0) {
        setColumnToggle(data);
      }
    }
  }, [setColumnToggle]);

  const onChange = (checkedValues) => {
    localStorage.setItem("ltv-columns", JSON.stringify(checkedValues));
    setColumnToggle(checkedValues);
  };

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-12 mb-5 mb-xl-5">
              <div className="card card-flush h-xl-100">
                <div className="card-body py-3 pt-5">
                  <div className="row g-3">
                    <div className="gap-3">
                      <h6 className="float-start text-violet fw-bold fs-5 me-5 pt-3">
                        Average new customer value through
                      </h6>
                      <div className="float-start pe-4">
                        <Select
                          size="large"
                          style={{ width: 100 }}
                          value={predictiveLtvMonths}
                          placeholder="Months"
                          onChange={(e) => {
                            setPredictiveLtvMonths(e);
                          }}
                          options={[...Array(list.length || 0)].map((_, i) => ({
                            value: i,
                            label: i,
                          }))}
                        />
                      </div>
                      <h6 className="float-start text-violet fw-bold fs-5 me-5 pt-3">
                        months
                      </h6>
                      <h4 className="float-start fw-boldest d-flex align-items-center pt-3 me-5">
                        {CustomerAcquisitionPredictiveLTVRes.status
                          ? currencyFormat(
                              CustomerAcquisitionPredictiveLTVRes.data,
                              2
                            )
                          : "Loading..."}
                      </h4>
                    </div>
                  </div>
                </div>
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
                    columns={columns.map((item) => item.title)}
                    rows={listContent.map((item) => {
                      return columns.reduce((acc, col) => {
                        acc[col.title] =
                          col.title === "CUSTOMER MADE FIRST ORDER AT"
                            ? item.row_label
                            : col.title === "NUMBER OF NEW CUSTOMERS"
                            ? item.customers
                            : col.title === "LTV"
                            ? item.ltv
                            : col.title === "CUSTOMER LIFESPAN"
                            ? item.lifespan
                            : exportMonthColumn(col.index, item);
                        return acc;
                      }, {});
                    })}
                    loading={loading}
                    fileName={"customer-acquisition-ltv"}
                  />
                </div>

                {loading ? (
                  <Loading months={month} />
                ) : (
                  <>
                    <ASINTable
                      columns={columns}
                      dataSource={listContent}
                      // ellipsis
                      rowKey="key"
                      loading={loading}
                      pagination={false}
                      scroll={{
                        y:
                          typeof window !== "undefined"
                            ? window.innerHeight - 310
                            : undefined,
                        x:
                          columns
                            ?.map((d) => d.width)
                            .reduce((a, b) => a + b, 0) + 900,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

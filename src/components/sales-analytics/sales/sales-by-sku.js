import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { Empty, Skeleton } from "antd";
import NoData from "../../no-data";
import { ExportToExcel } from "@/src/hooks/Excelexport";
import moment from "moment";
import { useMemo } from "react";

export default function SalesBySKU(tableList, loading, weeklyView) {
  const exportColumns = useMemo(() => {
    return weeklyView
      ? [
          "WK",
          "Week Date Range",
          "TW Sales",
          "TW Sales Change",
          "TW Sales Change (%)",
          "TW Units",
          "TW Units Change",
          "TW Units Change (%)",
          "LY Sales",
          "LY Sales Change",
          "LY Sales Change (%)",
          "LY Units",
          "LY Units Change",
          "LY Units Change (%)",
        ]
      : [
          "Month",
          "TM Sales",
          "TM Sales Change",
          "TM Sales Change (%)",
          "TM Units",
          "TM Units Change",
          "TM Units Change (%)",
          "LY Sales",
          "LY Sales Change",
          "LY Sales Change (%)",
          "LY Units",
          "LY Units Change",
          "LY Units Change (%)",
        ];
  }, [weeklyView]);

  return (
    <div className="row fadeInRight">
      <div className="col-lg-12">
        <div className="card" style={{}}>
          <div className="card-header">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bolder fs-3 mb-1">
                Sales by {weeklyView ? "Week" : "Month"}
              </span>
            </h3>
            <div className="card-toolbar">
              <div className="dropdown">
                <ExportToExcel
                  columns={exportColumns}
                  rows={tableList.map((d) => [
                    ...(weeklyView
                      ? [
                          `WK${d?.week}`,
                          `${d?.startdate || ""} to ${d?.enddate || ""}`,
                        ]
                      : [moment.months()[d?.month - 1]]),
                    currencyFormat(
                      d?.this_week_total_sales || d?.this_month_total_sales
                    ),
                    currencyFormat(
                      d?.this_week_sales_diff || d?.this_month_sales_diff
                    ),
                    percentageFormat(
                      d?.this_week_sales_change || d?.this_month_sales_change
                    ),
                    numberFormat(
                      d?.this_week_total_units || d?.this_month_total_units
                    ),
                    numberFormat(
                      d?.this_week_units_diff || d?.this_month_units_diff
                    ),
                    percentageFormat(
                      d?.this_week_units_change || d?.this_month_units_change
                    ),
                    currencyFormat(d?.last_year_total_sales),
                    currencyFormat(d?.last_year_sales_diff),
                    percentageFormat(d?.last_year_sales_change),
                    numberFormat(d?.last_year_total_units),
                    numberFormat(d?.last_year_units_diff),
                    percentageFormat(d?.last_year_units_change),
                  ])}
                  fileName={"sales-data-by-week"}
                  loading={loading}
                >
                  <button
                    className="btn btn-light-danger fs-7 px-10"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Export
                  </button>
                </ExportToExcel>
              </div>
            </div>
          </div>
          <div className="card-body pt-0 px-4" style={{}}>
            <div
              className="table-responsive"
              style={{
                maxHeight:
                  typeof window !== "undefined"
                    ? window.innerHeight - 310
                    : 600,
              }}
            >
              <table className="table fs-7 position-relative table-row-gray-300 align-middle gx-4 gy-4">
                <thead className="sticky-top bg-white">
                  <tr className="text-start text-gray-800 fw-boldest fs-7 ">
                    <th rowSpan={2} style={{}} className="min-w-75px">
                      {loading ? (
                        <Skeleton.Input />
                      ) : weeklyView ? (
                        "Week"
                      ) : (
                        "Month"
                      )}
                    </th>
                    {weeklyView && (
                      <th rowSpan={2} className="min-w-200px">
                        {loading ? <Skeleton.Input /> : "Week Date Range"}
                      </th>
                    )}
                    <th colSpan={3} className="text-center">
                      {loading ? title2Loading() : "Sales"}
                    </th>
                    <th colSpan={3} className="text-center">
                      {loading ? title2Loading() : "Units"}
                    </th>
                    <th colSpan={3} className="text-center">
                      {loading ? title2Loading() : "Sales"}
                    </th>
                    <th colSpan={3} className="text-center">
                      {loading ? title2Loading() : "Units"}
                    </th>
                  </tr>
                  <tr
                    className="text-start text-gray-800 fw-boldest fs-7 "
                    style={{ background: "#f8f8f8" }}
                  >
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "Total"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG %"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "Total"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG %"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "LY"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG %"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "LY"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG"}
                    </th>
                    <th className="min-w-75px">
                      {loading ? title2Loading() : "CHG %"}
                    </th>
                  </tr>
                </thead>
                <tbody className="fw-bold text-gray-800 ">
                  {loading ? (
                    <tr>
                      <td>{title4Loading()}</td>
                      {weeklyView && <td>{title4Loading()}</td>}
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                      <td>{title4Loading()}</td>
                    </tr>
                  ) : tableList.length === 0 ? (
                    <tr>
                      <td colSpan={14}>
                        <NoData />
                      </td>
                    </tr>
                  ) : (
                    tableList?.map((d, i) => (
                      <tr key={i} className="number-font">
                        <td>
                          <a className="fw-boldest text-dark fs13">
                            {weeklyView
                              ? `WK${d?.week}`
                              : moment.months()[d?.month - 1]}
                          </a>
                        </td>
                        {weeklyView && (
                          <td>
                            {d?.startdate || ""} to {d?.enddate || ""}
                          </td>
                        )}
                        <td>
                          {currencyFormat(
                            d?.this_week_total_sales ||
                              d?.this_month_total_sales
                          )}
                        </td>
                        <td>
                          {currencyFormat(
                            d?.this_week_sales_diff || d?.this_month_sales_diff
                          )}
                        </td>
                        <td
                          className={`${
                            (d?.this_week_sales_change ||
                              d?.this_month_sales_change) < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {percentageFormat(
                            d?.this_week_sales_change ||
                              d?.this_month_sales_change
                          )}
                        </td>
                        <td>
                          {numberFormat(
                            d?.this_week_total_units ||
                              d?.this_month_total_units
                          )}
                        </td>
                        <td>
                          {numberFormat(
                            d?.this_week_units_diff || d?.this_month_units_diff
                          )}
                        </td>
                        <td
                          className={`${
                            (d?.this_week_units_change ||
                              d?.this_month_units_change) < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {percentageFormat(
                            d?.this_week_units_change ||
                              d?.this_month_units_change
                          )}
                        </td>
                        <td>{currencyFormat(d?.last_year_total_sales)}</td>
                        <td>{currencyFormat(d?.last_year_sales_diff)}</td>
                        <td
                          className={`${
                            d?.last_year_sales_change < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {percentageFormat(d?.last_year_sales_change)}
                        </td>
                        <td>{numberFormat(d?.last_year_total_units)}</td>
                        <td>{numberFormat(d?.last_year_units_diff)}</td>
                        <td
                          className={`${
                            d?.last_year_units_change < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {percentageFormat(d?.last_year_units_change)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function title4Loading() {
  return <Skeleton title={false} active={true} />;
}
function title3Loading() {
  return <Skeleton.Button active={true} />;
}
function title2Loading() {
  return <Skeleton.Input size="small" active={true} />;
}

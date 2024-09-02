import { ExportToExcel } from "@/src/hooks/Excelexport";
import { Input, Select } from "antd";
import moment from "moment";
import _ from "lodash";
import { defaultWeek, defaultYear } from "@/src/config";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
  weekDateRange,
} from "@/src/helpers/formatting.helpers";

export default function TopBarFilter(
  filter,
  setFilter,
  type,
  { loading, data, year_mode, newUI = false }
) {
  const selectAllWeeks = () => {
    setFilter({
      ...filter,
      week: _.range(1, defaultYear() === filter.year ? defaultWeek() + 1 : 54),
    });
  };

  return (
    <div className="row gx-5 gx-xl-5 fadeInRight">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body px-4 py-4">
            <div className="d-flex flex-wrap gap-3">
              <div>
                <Select
                  defaultValue={defaultYear()}
                  size="large"
                  style={{ width: year_mode ? 250 : 100 }}
                  value={filter?.year || null}
                  mode={year_mode}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      year: e,
                    });
                  }}
                  options={[...Array(4)].map((_, i) => {
                    const year =
                      parseInt(moment(new Date()).format("YYYY")) +
                      i -
                      [...Array(4)]?.length +
                      1;
                    return { value: year, label: year };
                  })}
                />
              </div>
              <div>
                <Select
                  style={{ width: 300 }}
                  size="large"
                  placeholder={`Select ${type}`}
                  mode="multiple"
                  maxTagCount="responsive"
                  value={filter?.[type?.toLowerCase()] || null}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      [type.toLowerCase()]: e,
                    });
                  }}
                  options={
                    type === "Week"
                      ? [...Array(53)].map((_, i) => {
                          return {
                            value: i + 1,
                            label: `WK${
                              i.toString()?.length === 1 ? 0 + i + 1 : i + 1
                            }`,
                          };
                        })
                      : moment.months()?.map((d, i) => {
                          return { label: d, value: i + 1 };
                        })
                  }
                  allowClear
                />
              </div>
              {type === "Week" && (
                <div>
                  <button
                    className="btn btn-secondary ml-auto mr-10px"
                    onClick={selectAllWeeks}
                  >
                    Select All Weeks
                  </button>
                </div>
              )}
              <div style={{ marginLeft: "auto" }}>
                <ExportToExcel
                  rows={
                    loading
                      ? []
                      : data?.map((r) => {
                          return {
                            Year: r?.year,
                            Week: r?.week,
                            ...(newUI
                              ? {
                                  SPEND: currencyFormat(r?.twSpend),
                                  "SPEND CHG": percentageFormat(r?.spendChange),
                                  "AD REVENUE": currencyFormat(r?.twRevenue),
                                  "REVENUE CHG": percentageFormat(r?.adChange),
                                  "ORGANIC SALES": currencyFormat(
                                    r?.organicSales
                                  ),
                                  "ORGANIC CHG": percentageFormat(
                                    r?.organicSalesChange
                                  ),
                                  "TOTAL SALES": currencyFormat(r?.totalSales),
                                  "TOTAL ACOS": percentageFormat(
                                    r?.ACoS_percentage == "NaN"
                                      ? 0
                                      : r?.ACoS_percentage
                                  ),
                                  "PPC SPEND": currencyFormat(r?.PPCSpend),
                                  "PPC SPEND CHG": percentageFormat(r?.a),
                                  "PPC SALES": currencyFormat(r?.PPCSales),
                                  "PPC SALES CHG": percentageFormat(
                                    r?.PPCSalesChange
                                  ),
                                  "DSP SPEND": currencyFormat(r?.dsp_spend),
                                  "DSP SPEND CHANGE": percentageFormat(
                                    r?.dsp_spend_change
                                  ),
                                  "DSP SALES": currencyFormat(r?.dsp_revenue),
                                  "DSP SALES CHANGE": percentageFormat(
                                    r?.dsp_revenue_change
                                  ),
                                  "SPONSORED PRODUCTS AD SPEND": currencyFormat(
                                    r?.sponsoredProductAdSpend
                                  ),
                                  "SPONSORED PRODUCTS AD SALES": currencyFormat(
                                    r?.sponsoredProductAdSales
                                  ),
                                  "SPONSORED BRAND AD SPEND": currencyFormat(
                                    r?.sponsoredBrandAdSpend
                                  ),
                                  "SPONSORED BRAND AD SALES": currencyFormat(
                                    r?.sponsoredBrandSales
                                  ),
                                  "SPONSORED DISPLAY AD SPEND": currencyFormat(
                                    r?.sponsoredDisplayAdSpend
                                  ),
                                  "SPONSORED DISPLAY AD SALES": currencyFormat(
                                    r?.sponsoredDisplayAdSales
                                  ),
                                  IMPRESSIONS: numberFormat(r?.impressions),
                                  CLICKS: numberFormat(r?.clicks),
                                  "TOTAL UNIT ORDERS": numberFormat(
                                    r?.totalUnitOrder
                                  ),
                                  "BRANDED SPEND": currencyFormat(
                                    r?.brandedSpends
                                  ),
                                  "BRANDED SALES": currencyFormat(
                                    r?.brandedSales
                                  ),
                                  "BRANDED ROAS": numberFormat(r?.brandedRoAS),
                                  "NON BRANDED SPEND": currencyFormat(
                                    r?.nonBrandedSpends
                                  ),
                                  "NON BRANDED SALES": currencyFormat(
                                    r?.nonBrandedSales
                                  ),
                                  "NON BRANDED ROAS": numberFormat(
                                    r?.nonBrandedRoAS
                                  ),
                                }
                              : {
                                  Revenue: currencyFormat(
                                    r?.revenue || r?.twRevenue
                                  ),
                                  Spend: currencyFormat(r?.spend || r?.twSpend),
                                  CPO: currencyFormat(r?.CPO),
                                  ACos: percentageFormat(r?.ACoS),
                                  "Total Sales": currencyFormat(
                                    r?.total_ordered_product_sales ||
                                      r?.totalSales
                                  ),
                                  "Total ACoS": percentageFormat(
                                    r?.ACoS_percentage
                                  ),
                                }),
                          };
                        })
                  }
                  fileName={"advertising-data-by-week"}
                  loading={loading}
                >
                  <button className="btn btn-light-danger btn-sm fw-bolder ">
                    Export Data
                  </button>
                </ExportToExcel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

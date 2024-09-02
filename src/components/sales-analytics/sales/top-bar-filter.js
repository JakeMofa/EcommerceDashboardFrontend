import { Input, Select } from "antd";
import moment from "moment";
import _ from "lodash";
import { defaultWeek, defaultMonth, defaultYear } from "@/src/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectReportLogsSummary } from "@/src/store/slice/reportLogs.slice";
import { getReportLogsSummary } from "@/src/services/reportLogs.services";
import { timeFormat } from "@/src/helpers/formatting.helpers";

export default function TopBarFilter(filter, setFilter, type, config = {}) {
  const dispatch = useDispatch();

  const selectAll = () => {
    const range =
      type === "Week"
        ? _.range(1, 54)
        : _.range(0, defaultYear() === filter.year ? defaultMonth() + 1 : 12);

    setFilter({
      ...filter,
      [type.toLowerCase()]: range,
    });
  };

  const reportLogsSummary = useSelector(selectReportLogsSummary);

  useEffect(() => {
    if (config.showSummary) {
      dispatch(getReportLogsSummary());
    }
  }, []);

  const lastUpdatedOptions = (data) => {
    const report_types = {
      ads: "Advertising",
      sales: "Sales",
      customer_acquisition: "Customer Acquisition",
    };

    return Object.keys(report_types).map((key) => ({
      value: key,
      label: `${report_types[key]} -> ${
        data[key]
          ? data[key] === 0
            ? "Never"
            : timeFormat(data[key])
          : "Loading..."
      }`,
    }));
  };

  return (
    <div className="row gx-5 gx-xl-5 fadeInRight">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body px-4 py-4">
            <div className="gap-3">
              {config.showSearchBar && (
                <div className="float-start pe-4">
                  <Input
                    placeholder="Search"
                    style={{
                      width: 200,
                    }}
                    size="large"
                    value={filter.searchText || ""}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        searchText: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
              <div className="float-start pe-4">
                <Select
                  defaultValue={defaultYear()}
                  size="large"
                  style={{
                    width: config.year_mode
                      ? config.showSearchBar
                        ? 140
                        : 250
                      : 100,
                  }}
                  value={filter?.year || null}
                  mode={config.year_mode}
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
              <div className="float-start pe-4">
                <Select
                  style={{ width: config.showSearchBar ? 280 : 300 }}
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
                          return { label: d, value: i };
                        })
                  }
                  allowClear
                />
              </div>
              <div className="float-start pe-4">
                <button
                  className="btn btn-secondary ml-auto mr-10px"
                  onClick={selectAll}
                >
                  Select All {type}s
                </button>
              </div>
              {config.showSummary && reportLogsSummary.data && (
                <div className="float-start">
                  {" "}
                  <Select
                    style={{ width: 330 }}
                    size="large"
                    placeholder={`Last Updated`}
                    options={lastUpdatedOptions(reportLogsSummary.data)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

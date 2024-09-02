import { Dropdown, Select, message, theme } from "antd";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSalesByProductList } from "@/src/services/salesByProduct.services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faFileExcel,
  faSortAmountAsc,
  faSortAmountDesc,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/src/components/loading";
import VendoTooltip from "@/src/components/tooltip";
import Drawer from "@/src/components/sales-analytics/product/drawer";
import { TopBarFilter } from "@/src/components/sales-analytics/sales";
import _ from "lodash";
import { defaultWeek, defaultYear } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { selectSalesByProductList } from "@/src/store/slice/salesByProduct.slice";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import NoData from "@/src/components/no-data";
import { exportToExcel } from "@/src/hooks/Excelexport";
import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";
import Pagination from "@/src/components/pagination";
import { DefaultPerPage } from "@/src/config";

import { fetchSalesByProductList } from "@/src/api/salesByProduct.api";

const { useToken } = theme;

const configurationListKey = "sales-by-product-list";
const configurationColumnKey = "sales-by-product-column";

const columnsList = [
  {
    label: "Sum of Ordered Product Sales",
    value: "total_ordered_product_sales",
  },
  {
    label: "Sum of Total Orders",
    value: "total_order_items",
  },
  {
    label: "Sum of Sessions",
    value: "total_session",
  },
  {
    label: "Sum of Sessions - Mobile App",
    value: "mobile_app_sessions",
  },
  {
    label: "Sum of Sessions - Browser",
    value: "browser_sessions",
  },
  {
    label: "Average Traffic %",
    value: "avg_session_percentage",
  },
  {
    label: "Average Traffic % - Mobile App",
    value: "avg_mobile_app_session_percentage",
  },
  {
    label: "Average Traffic % - Browser",
    value: "avg_browser_session_percentage",
  },
  {
    label: "Sum of Page Views",
    value: "total_page_views",
  },
  {
    label: "Sum of Page Views - Mobile App",
    value: "total_mobile_app_page_views",
  },
  {
    label: "Sum of Page Views - Browser",
    value: "total_browser_page_views",
  },
  {
    label: "Average Page Views %",
    value: "avg_page_view_percentage",
  },
  {
    label: "Average Page Views % - Mobile App",
    value: "avg_mobile_app_page_views_percentage",
  },
  {
    label: "Average Page Views % - Browser",
    value: "avg_browser_page_views_percentage",
  },
  {
    label: "Buy Box %",
    value: "avg_buy_box_percentage",
  },
  {
    label: "Sum of Units Ordered",
    value: "total_ordered_units",
  },
  {
    label: "Conversion Rate",
    value: "avg_unit_session_percentage",
  },
  {
    label: "Ad Spend",
    value: "spend",
  },
  {
    label: "Ad Revenue",
    value: "revenue",
  },
  {
    label: "TACOS",
    value: "tacos",
  },
];

export default function SalesByProducts() {
  const { token } = useToken();
  const dispatch = useDispatch();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const salesByProductList = useSelector(selectSalesByProductList);

  const [tableLoading, setTableLoading] = useState(true);
  const [list, setList] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);

  const [columnConfig, setColumnConfig] = useState([]);
  const [columnConfigLoaded, setColumnConfigLoaded] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedColumnLoaded, setSelectedColumnLoaded] = useState(null);

  const [expandedWeek, setExpendedWeek] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState({
    searchText: "",
    week: _.range(1, defaultWeek() + 1),
    year: [defaultYear()],
  });

  const [pageSize, setPageSize] = useState(DefaultPerPage);
  const [sortBy, setSortBy] = useState({ on: null, order: "desc" });

  useEffect(() => {
    setColumnConfig(columnsList);
    setSelectedColumn(columnsList[1].value);

    fetchConfigurations(configurationListKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setColumnConfig(res.data);
          setColumnConfigLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });

    fetchConfigurations(configurationColumnKey)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          res.data?.length > 0 && setSelectedColumn(res.data[0]);
          setSelectedColumnLoaded(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  }, []);

  useEffect(() => {
    if (columnConfigLoaded && columnConfig.length > 0) {
      updateConfigurations(configurationListKey, columnConfig);
    }
  }, [columnConfig]);

  useEffect(() => {
    if (selectedColumnLoaded && selectedColumn.length > 0) {
      updateConfigurations(configurationColumnKey, [selectedColumn]);
    }
  }, [selectedColumn]);

  useEffect(() => {
    if (salesByProductList?.status) {
      const salesByProductListData = {};
      salesByProductList?.items.forEach((rec) => {
        const skuData = rec.data;
        salesByProductListData[rec.child_asin] = Object.keys(skuData).reduce(
          (acc, key) => {
            acc[
              isNaN(key) ? key : skuData[key].year * 100 + skuData[key].week
            ] = skuData[key];
            return acc;
          },
          {}
        );
      });

      let max = [];
      if (salesByProductListData) {
        let getMax = [];
        Object.values(salesByProductListData).map((d, i) => {
          getMax = _.uniq(
            getMax.concat(Object.values(d).map((d) => d.year * 100 + d.week))
          );
        });

        getMax = getMax.filter((a) => !isNaN(a));
        max = getMax
          .map((a) => parseInt(a))
          .sort((a, b) => a - b)
          .concat(["Grand Total"]);
        setTableColumns(max);
      }

      const allKeys = {};
      const data = {};
      max.map((k) => {
        allKeys[k] = {};
      });

      let [column, week] = sortBy?.on?.split("-") || [null, null];
      column = column || selectedColumn || columnsList[1].value;
      // week = week ? Number(week) + 1 : 0;

      const tempData = Object.keys(salesByProductListData).map((key) => ({
        key: key,
        val: Number(salesByProductListData?.[key]?.[week]?.[column]) || 0,
      }));

      const sortedKeys = _.orderBy(tempData, "val", sortBy.order).map(
        (a) => a.key
      );

      sortedKeys.map((a) => {
        const identifiers = _.pick(
          Object.values(salesByProductListData[a])[0],
          "child_asin",
          "parent_asin",
          "sku",
          "title"
        );
        data[a] = {
          ...allKeys,
          [max[0]]: identifiers,
          ..._.pick(salesByProductListData[a], ...max),
        };
      });
      const dataWithGrandTotal = Object.keys(data).map((key) => {
        const grandTotal = selectedColumn?.startsWith("avg")
          ? _.mean(
              Object.values(data[key] || {})
                .map((a) => Number(a?.[selectedColumn] || 0))
                .slice(0, -1)
            )
          : _.sum(
              Object.values(data[key] || {}).map((a) =>
                Number(a?.[selectedColumn] || 0)
              )
            );
        return { ...data[key], "Grand Total": grandTotal };
      });
      if (!sortBy.on) {
        const sortedData = _.orderBy(
          dataWithGrandTotal,
          ["Grand Total"],
          ["desc"]
        );
        setList(sortedData);
      } else {
        setList(_.orderBy(dataWithGrandTotal, sortBy.on, sortBy.order));
      }
      setTableLoading(false);
    }
  }, [salesByProductList]);

  useEffect(() => {
    const { year, week, searchText } = filter;
    if (week.length > 0 && year.length > 0) {
      setTableLoading(true);
      const time = setTimeout(() => {
        dispatch(
          getSalesByProductList({
            search_year: year,
            search_week: week?.join(","),
            orderBy: sortBy?.on
              ? sortBy?.on.split("-")[0]
              : selectedColumn || "total_ordered_product_sales",
            order: sortBy?.on ? sortBy?.order : "desc",
            perPage: pageSize,
            searchText: searchText,
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedColumn]);

  useEffect(() => {
    const { year, week, searchText } = filter;
    if (week.length > 0 && year.length > 0) {
      dispatch(
        getSalesByProductList({
          search_year: year,
          search_week: week?.join(","),
          orderBy: sortBy?.on ? sortBy?.on.split("-")[0] : "total_order_items",
          order: sortBy?.order,
          perPage: pageSize,
          searchText: searchText,
        })
      );
    }
  }, [sortBy]);

  const pageChange = (page, perPage) => {
    setTableLoading(true);
    const { year, week, searchText } = filter;
    dispatch(
      getSalesByProductList({
        search_year: year,
        search_week: week?.join(","),
        page: page,
        perPage: perPage,
        orderBy: sortBy?.on ? sortBy?.on.split("-")[0] : "total_order_items",
        order: sortBy?.order,
        searchText: searchText,
      })
    );
  };

  const onPageNo = (e) => {
    pageChange(e, salesByProductList.limit);
  };

  const onPerPage = (e) => {
    setPageSize(e);
    pageChange(1, e);
  };

  const sortableColumn = (col) => {
    return !["spend", "revenue", "tacos"].includes(col);
  };

  const handleSetSortBy = (key) => {
    setSortBy((s) => {
      if (s.on === key && s.order === "desc") {
        return {
          on: null,
          order: "asc",
        };
      }
      return {
        on: key,
        order: s.on === key ? "desc" : "asc",
      };
    });
  };

  const sortIcon = (key) =>
    sortBy.on === key && (
      <span className="me-sm-1">
        <FontAwesomeIcon
          icon={sortBy.order === "asc" ? faSortAmountDesc : faSortAmountAsc}
          className="w-15px h-15px position-relative"
          style={{ bottom: "4px" }}
        />
      </span>
    );

  const formatter = (field, value, exporter = false) => {
    if (!exporter && value === null) return "-";
    if (field === "total_ordered_product_sales") return currencyFormat(value);
    if (field.startsWith("avg")) return percentageFormat(value);
    if (field.startsWith("spend")) return currencyFormat(value);
    if (field.startsWith("revenue")) return currencyFormat(value);
    if (field.startsWith("tacos")) return percentageFormat(value);
    return numberFormat(value);
  };

  const exportSalesByProduct = (yearWeek) => {
    message.loading("Loading...");
    const { year, week } = filter;

    fetchSalesByProductList({
      search_year: yearWeek ? parseInt(yearWeek / 100) : year,
      search_week: yearWeek ? yearWeek % 100 : week?.join(","),
      perPage: 999999,
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          const salesByProductListData = {};
          let max = [];
          let tableColumns = [];
          res.data.items.forEach((rec) => {
            const skuData = rec.data;
            salesByProductListData[rec.child_asin] = Object.keys(
              skuData
            ).reduce((acc, key) => {
              acc[
                isNaN(key) ? key : skuData[key].year * 100 + skuData[key].week
              ] = skuData[key];
              return acc;
            }, {});
          });

          if (salesByProductListData) {
            let getMax = [];
            Object.values(salesByProductListData).map((d, i) => {
              getMax = _.uniq(
                getMax.concat(
                  Object.values(d).map((d) => d.year * 100 + d.week)
                )
              );
            });

            getMax = getMax.filter((a) => !isNaN(a));
            max = getMax.map((a) => parseInt(a)).sort((a, b) => a - b);
            tableColumns = max;
          }

          const allKeys = {};
          const data = {};
          max.map((k) => {
            allKeys[k] = {};
          });

          let [column, week] = sortBy?.on?.split("-") || [null, null];
          column = column || selectedColumn || columnsList[1].value;

          const tempData = Object.keys(salesByProductListData).map((key) => ({
            key: key,
            val: Number(salesByProductListData?.[key]?.[week]?.[column]) || 0,
          }));

          const sortedKeys = _.orderBy(tempData, "val", sortBy.order).map(
            (a) => a.key
          );

          sortedKeys.map((a) => {
            const identifiers = _.pick(
              Object.values(salesByProductListData[a])[0],
              "child_asin",
              "parent_asin",
              "sku",
              "title"
            );
            data[a] = {
              ...allKeys,
              [max[0]]: identifiers,
              ..._.pick(salesByProductListData[a], ...max),
            };
          });

          const dataList = _.orderBy(data, sortBy.on, sortBy.order);

          exportToExcel({
            columns: ["Title", "Parent ASIN", "Child ASIN", "SKU"].concat(
              ...(yearWeek
                ? columnsList.reduce((acc, cl) => {
                    acc.push(cl.label);
                    return acc;
                  }, [])
                : tableColumns.map((tc) =>
                    columnsList.reduce((acc, cl) => {
                      acc.push(
                        `${parseInt(tc / 100)} WK${tc % 100}-${cl.label}`
                      );
                      return acc;
                    }, [])
                  ))
            ),
            fileName: `sales-by-product${
              yearWeek ? `-${parseInt(yearWeek / 100)}-WK${yearWeek % 100}` : ""
            }`,
            rows: Object.values(dataList || {})?.map((text) => {
              const row = tableColumns.reduce((acc, week) => {
                const data = text[week];
                if (week !== "Grand Total") {
                  const weekDetails = columnsList.reduce((acc, cl) => {
                    acc[`WK${week}-${cl.label}`] = formatter(
                      cl.value,
                      data[cl.value],
                      true
                    );
                    return acc;
                  }, {});
                  acc = {
                    Title: data.title,
                    ...acc,
                    "Parent ASIN": data.parent_asin,
                    "Child ASIN": data.child_asin,
                    SKU: data.sku,
                    ...weekDetails,
                  };
                }
                return acc;
              }, {});
              return row;
            }),
          });
        } else {
          message.error("No Sales data available.");
        }
        message.destroy();
      })
      .catch((err) => {
        message.destroy();
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };

  const [columnWidth, setColumnWidth] = useState(375);
  const resizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = (e) => {
    resizing.current = true;
    startX.current = e.clientX;
    startWidth.current = columnWidth;
  };

  const onMouseMove = (e) => {
    if (resizing.current) {
      const newWidth = startWidth.current + (e.clientX - startX.current);
      setColumnWidth(newWidth > 50 ? newWidth : 50);
    }
  };

  const onMouseUp = () => {
    resizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <DashboardLayout>
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
            {TopBarFilter(filter, setFilter, "Week", {
              year_mode: "multiple",
              showSearchBar: true,
            })}
            <div className="col-lg-12">
              <div className="card mb-1">
                <div className="card-header border-bottom border-bottom-dashed">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-0">
                      Analytics by Product
                    </span>
                  </h3>
                  <div className="card-toolbar">
                    <Dropdown
                      trigger={["click"]}
                      dropdownRender={() => (
                        <div style={contentStyle}>
                          <div>
                            <div className="px-7 py-5">
                              <div className="fs-5 text-dark fw-bold">
                                Change Default Column
                              </div>
                            </div>
                            <div className="separator border-gray-200" />
                            <div className="px-7 py-5 min-w-300px">
                              <Select
                                className="min-w-250px"
                                placeholder="Columns"
                                size="large"
                                onChange={(e) => {
                                  setSelectedColumn(e);
                                }}
                                value={selectedColumn || null}
                                options={columnConfig.map((d) => {
                                  return d;
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    >
                      <button
                        onClick={(e) => e.preventDefault()}
                        type="button"
                        className="btn fs-7 btn-light btn-active-light-dark me-3 btn-sm fw-bolder"
                      >
                        Default Column Setting
                      </button>
                    </Dropdown>

                    <button
                      onClick={() => setIsOpen(true)}
                      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                      id="kt_drawer_example_basic_button"
                    >
                      {" "}
                      Configuration{" "}
                    </button>
                    <button
                      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={() => exportSalesByProduct()}
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div className="card-body pt-2 table-responsive">
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight:
                        typeof window !== "undefined"
                          ? window.innerHeight - 310
                          : 600,
                    }}
                  >
                    {tableLoading ? (
                      <Loading />
                    ) : Object.keys(list || {}).length === 0 ? (
                      <NoData />
                    ) : (
                      <table
                        id="data-table"
                        className="table align-middle table-row-dashed table-row-gray-300 fs-7 gy-4 gx-5 border-top-d"
                      >
                        <thead className="bg-white position-sticky start-0 top-0">
                          <tr className="fw-boldest text-dark">
                            <th
                              style={{ minWidth: `${columnWidth}px` }}
                              className="position-sticky start-0 bg-white"
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Row Labels</span>
                                <div
                                  onMouseDown={onMouseDown}
                                  className="resizable-column"
                                />
                              </div>
                            </th>
                            {tableColumns?.map((d, i) => (
                              <th
                                className="py-1"
                                style={{ padding: "0px", paddingLeft: "5px" }}
                                key={i}
                              >
                                {d === "Grand Total" ? (
                                  <>{d}</>
                                ) : (
                                  <>
                                    <span
                                      className={`px-1 ${
                                        sortableColumn(selectedColumn)
                                          ? "cursor-pointer"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        sortableColumn(selectedColumn) &&
                                        handleSetSortBy(
                                          `${selectedColumn}-${d}`
                                        )
                                      }
                                    >
                                      {`${parseInt(d / 100)} WK${d % 100}`}
                                    </span>
                                    {sortIcon(`${selectedColumn}-${d}`)}
                                    <div
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#kt_accordion_1_body_${
                                        i + 1
                                      }`}
                                      aria-expanded="false"
                                      aria-controls={`kt_accordion_1_body_${
                                        i + 1
                                      }`}
                                      onClick={() => {
                                        expandedWeek === null
                                          ? setExpendedWeek(i)
                                          : expandedWeek === i
                                          ? setExpendedWeek(null)
                                          : setExpendedWeek(i);
                                      }}
                                      className="open-arrow rounded-sm w-20px h-20px d-inline-flex justify-content-center align-items-center bg-light cursor-pointer"
                                    >
                                      <FontAwesomeIcon
                                        icon={
                                          expandedWeek === i ? faMinus : faPlus
                                        }
                                        color="black"
                                        className="w-15px h-15px"
                                      />
                                    </div>
                                    <div
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#kt_accordion_1_body_${
                                        i + 1
                                      }`}
                                      aria-expanded="false"
                                      aria-controls={`kt_accordion_1_body_${
                                        i + 1
                                      }`}
                                      onClick={() => {
                                        exportSalesByProduct(d);
                                      }}
                                      className="open-arrow rounded-sm w-20px h-20px d-inline-flex justify-content-center align-items-center bg-light cursor-pointer"
                                    >
                                      <FontAwesomeIcon
                                        icon={faFileExcel}
                                        color="black"
                                        className="w-15px h-15px"
                                      />
                                    </div>
                                  </>
                                )}
                              </th>
                            ))}
                            {/* <th className='min-w-150px '>Grand Total</th> */}
                          </tr>
                          <tr className="fw-boldest text-dark">
                            <th className="p-0 position-sticky start-0 bg-white">
                              <div
                                onMouseDown={onMouseDown}
                                className="resizable-column"
                              />
                            </th>
                            {tableColumns?.map((d, i) => (
                              <th className="p-0" key={d}>
                                <div
                                  id={`kt_accordion_1_body_${d + 1}`}
                                  className={
                                    expandedWeek !== i
                                      ? "accordion-collapse collapse"
                                      : ""
                                  }
                                  aria-labelledby={`kt_accordion_1_header_${
                                    d + 1
                                  }`}
                                  data-bs-parent="#kt_accordion_1"
                                  style={{}}
                                >
                                  <table className="table mb-0">
                                    <thead
                                      className="thead-light"
                                      style={{
                                        borderRight:
                                          "2px solid #fff !important",
                                      }}
                                    >
                                      <tr>
                                        <th
                                          className={`min-w-300px ${
                                            sortableColumn(selectedColumn)
                                              ? "cursor-pointer"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            sortableColumn(selectedColumn) &&
                                            handleSetSortBy(
                                              `${selectedColumn}-${d}`
                                            )
                                          }
                                        >
                                          {
                                            columnConfig?.find(
                                              (config) =>
                                                config.value == selectedColumn
                                            )?.label
                                          }{" "}
                                          {sortIcon(`${selectedColumn}-${d}`)}
                                        </th>
                                        {columnConfig?.map((t, y) => {
                                          if (selectedColumn === t.value) {
                                            return;
                                          }
                                          return (
                                            <th
                                              className={`min-w-300px ${
                                                sortableColumn(t.value)
                                                  ? "cursor-pointer"
                                                  : ""
                                              }`}
                                              key={y}
                                              onClick={() =>
                                                sortableColumn(t.value) &&
                                                handleSetSortBy(
                                                  `${t.value}-${d}`
                                                )
                                              }
                                            >
                                              {t.label}{" "}
                                              {sortIcon(`${t.value}-${d}`)}
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                  </table>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 fw-bold">
                          {Object.values(list || {})?.map((d, i) => {
                            const defaultWeek = Object.entries(
                              d || {}
                            )?.[0]?.[1];
                            return (
                              <tr key={i}>
                                <td className="w-100 position-sticky start-0 bg-white">
                                  <div className="fs-7">
                                    <VendoTooltip
                                      title={defaultWeek?.title}
                                      placement="top"
                                      row={3}
                                    >
                                      <a
                                        className="text-dark mb-2"
                                        style={{ fontWeight: 600 }}
                                        href={`https://amazon.com/dp/${defaultWeek?.parent_asin}`}
                                        title="Click to view on Amazon"
                                        target="_blank"
                                      >
                                        <span className="one min-w-100">
                                          {defaultWeek?.title || "-"}
                                        </span>
                                      </a>
                                    </VendoTooltip>
                                    <span className="d-flex mt-0">
                                      <b className="fw-boldest me-2 text-dark">
                                        Parent ASIN:
                                      </b>
                                      {defaultWeek?.parent_asin || "-"}
                                    </span>
                                    <span className="d-flex mt-1">
                                      <b className="fw-boldest me-2 text-dark">
                                        Child ASIN:
                                      </b>{" "}
                                      <a
                                        href={`https://amazon.com/dp/${defaultWeek?.child_asin}`}
                                        target="_blank"
                                      >
                                        {defaultWeek?.child_asin || "-"}
                                      </a>
                                    </span>
                                    <span className="d-flex mt-1">
                                      <b className="fw-boldest me-2 text-dark">
                                        SKU:{" "}
                                      </b>
                                      {defaultWeek?.sku || "-"}
                                    </span>
                                  </div>
                                  <div
                                    onMouseDown={onMouseDown}
                                    className="resizable-column"
                                  />
                                </td>
                                {Object.entries(d)?.map((r, t) => {
                                  if (r?.[0] === "Grand Total") {
                                    return;
                                  }
                                  const defaultValue = r?.[1]?.[selectedColumn];
                                  return (
                                    <td key={t}>
                                      <div className="d-flex align-items-center">
                                        <span
                                          className="d-block"
                                          style={{
                                            width:
                                              expandedWeek == t ? 300 : 110,
                                          }}
                                        >
                                          {formatter(
                                            selectedColumn,
                                            defaultValue
                                          )}
                                        </span>
                                        <div
                                          id={`kt_accordion_1_body_${t + 1}`}
                                          className={
                                            expandedWeek !== t &&
                                            "accordion-collapse collapse"
                                          }
                                          aria-labelledby={`kt_accordion_1_header_${
                                            t + 1
                                          }`}
                                          data-bs-parent="#kt_accordion_1"
                                        >
                                          <table className="table mb-0">
                                            <tbody>
                                              <tr>
                                                {columnConfig?.map((h, j) => {
                                                  if (
                                                    selectedColumn === h.value
                                                  ) {
                                                    return;
                                                  }
                                                  return (
                                                    <td
                                                      key={j}
                                                      style={{
                                                        paddingLeft: `${
                                                          1.25 + 0.05 * j
                                                        }rem`,
                                                      }}
                                                      className="min-w-300px"
                                                    >
                                                      {formatter(
                                                        h.value,
                                                        r?.[1]?.[h.value]
                                                      )}
                                                    </td>
                                                  );
                                                })}
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                                <td>
                                  <span
                                    className="d-block"
                                    style={{ width: 100 }}
                                  >
                                    {formatter(
                                      selectedColumn,
                                      d["Grand Total"]
                                    )}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="row">
                    <Pagination
                      loading={tableLoading || salesByProductList.count == 0}
                      pageSize={salesByProductList.limit}
                      page={salesByProductList.page}
                      totalPage={salesByProductList.count}
                      onPerPage={onPerPage}
                      onPageNo={onPageNo}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <Drawer
            columnsList={columnsList}
            columnConfig={columnConfig}
            setColumnConfig={setColumnConfig}
            open={isOpen}
            onHide={() => {
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

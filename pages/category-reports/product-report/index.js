import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import Loading from "@/src/components/loading";
import { defaultWeek, defaultYear, defaultMonth } from "@/src/config";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Switch, message, Tooltip } from "antd";
import ASINTable from "@/src/components/table";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faFileExcel } from "@fortawesome/free-solid-svg-icons";

import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import NoData from "@/src/components/no-data";
import TopBarFilter from "./top-bar-filter-product-report";
import {
  getCategoriesReportList,
  getCategoryProductsReportList,
} from "@/src/services/productReport.services";
import {
  fetchProductReportCategoryDetails,
  fetchProductReportExport,
} from "@/src/api/productReport.api";
import {
  selectCategoriesReportList,
  selectProductsReportList,
} from "@/src/store/slice/productReport.slice";
import { getCategoryList } from "@/src/services/categoryList.services";
import { ExportToExcel, exportToExcel } from "@/src/hooks/Excelexport";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { CustomDrawer } from "@/src/components/modal";
import CategoryProductDetails from "@/src/components/Category-Reports/category-products-details";
import Pagination from "@/src/components/pagination";
import { DefaultPerPage } from "@/src/config";

const columnToggleOptions = [
  { label: "Product Detail", value: "pg", paginated: false },
  { label: "Active status", value: "status", paginated: false },
  { label: "Sales", value: "sales", paginated: true },
  { label: "AD Sales", value: "ad_sales", paginated: true },
  { label: "AD Spend", value: "ad_spend", paginated: true },
];

const columnToggleInitialValues = [
  "status",
  "pg",
  "sales",
  "ad_sales",
  "ad_spend",
];

export default function ProductReportPage() {
  const dispatch = useDispatch();

  const CategoryListRes = useSelector(selectCategoryList);
  const CategoriesReportListRes = useSelector(selectCategoriesReportList);
  const ProductsReportListRes = useSelector(selectProductsReportList);

  const [tableLoading, setTableLoading] = useState(true);
  const [list, setList] = useState([]);
  const [paginated, setPaginated] = useState(false);
  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);
  const [weeklyView, setWeeklyView] = useState(true);
  const [subcategoriesEnabled, setSubcategoriesEnabled] = useState(false);
  const [expand, setExpand] = useState(null);
  const [productsReportLoading, setProductsReportLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DefaultPerPage);

  const onViewChange = (checked) => {
    setWeeklyView(checked);
    setTableLoading(true);
  };

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setSubcategoriesEnabled(brand.subcategories_enabled);
  }, []);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    if (brand.subcategories_enabled) {
      const data = {};
      CategoryListRes.data?.map((item) => {
        item.subcategories.map((c) => {
          data[c.name] = item.name;
        });
      });
    }
  }, [CategoryListRes.data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("cr-pr") || "[]");
      if (data.length !== 0) {
        setColumnToggle(data);
      }
    }
  }, [setColumnToggle]);

  const onChange = (checkedValues) => {
    const valid = checkedValues.some(
      (item) => item === "sales" || item === "ad_spend" || item === "ad_sales"
    );
    const data = valid ? checkedValues : columnToggleInitialValues;
    localStorage.setItem("cr-pr", JSON.stringify(data));
    setColumnToggle(data);
  };

  const [filter, setFilter] = useState({
    week: _.range(1, Math.max(defaultWeek(), 2)),
    month: _.range(0, defaultMonth() + 1),
    year: [defaultYear()],
    asin: "",
    category: [],
  });

  useEffect(() => {
    dispatch(getCategoryList({ limit: 9999 }));
  }, []);

  useEffect(() => {
    setPaginated(CategoriesReportListRes.paginated);
    setList(CategoriesReportListRes.data);
    setTableLoading(false);
  }, [CategoriesReportListRes]);

  useEffect(() => {
    const { year, week, month, asin, category } = filter;
    if (
      year &&
      ((weeklyView && week.length > 0) || (!weeklyView && month.length > 0))
    ) {
      setTableLoading(true);
      const time = setTimeout(() => {
        dispatch(
          getCategoriesReportList({
            search_year: year?.join(","),
            asin,
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
    if (expand !== null) {
      const { year, week, month, asin } = filter;

      message.destroy();
      message.loading("Loading...");
      setProductsReportLoading(true);
      dispatch(
        getCategoryProductsReportList({
          category_id: expand == "Uncategorized" ? null : expand,
          search_year: year?.join(","),
          asin,
          ...(weeklyView
            ? { search_week: week?.join(",") }
            : { search_month: month?.map((m) => m + 1).join(",") }),
          perPage: pageSize,
        })
      );
    }
  }, [expand]);

  const pageChange = (page, perPage) => {
    setProductsReportLoading(true);
    const { year, week, month, asin } = filter;
    dispatch(
      getCategoryProductsReportList({
        page: page,
        perPage: perPage,
        category_id: expand == "Uncategorized" ? null : expand,
        search_year: year?.join(","),
        asin,
        ...(weeklyView
          ? { search_week: week?.join(",") }
          : { search_month: month?.map((m) => m + 1).join(",") }),
      })
    );
  };

  const onPageNo = (e) => {
    pageChange(e, ProductsReportListRes.limit);
  };

  const onPerPage = (e) => {
    setPageSize(e);
    pageChange(1, e);
  };

  useEffect(() => {
    setProductsReportLoading(false);
  }, [ProductsReportListRes]);

  const exportCategoryDetails = (category_id) => {
    message.loading("Loading...");
    const { year, week, month, asin } = filter;
    fetchProductReportCategoryDetails({
      page: 1,
      perPage: 999999,
      category_id: category_id == "Uncategorized" ? null : category_id,
      search_year: year?.join(","),
      asin,
      ...(weeklyView
        ? { search_week: week?.join(",") }
        : { search_month: month?.map((m) => m + 1).join(",") }),
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          const data = res.data.items.reduce((acc, item, key) => {
            const {
              total_sales,
              total_ad_sales,
              total_ad_spend,
              change_interval_over_interval_ad_sales,
              change_interval_over_interval_ad_spend,
              change_interval_over_interval_sales,
              interval_sales,
              asin,
              sku,
              title,
              status,
            } = item;

            const intervals = interval_sales.reduce((wacc, witem, _key) => {
              const identifier = weeklyView
                ? witem.year * 54 + witem.week
                : witem.year * 12 + witem.month;

              wacc[`sales${identifier}`] = witem.sales;
              wacc[`ad_sales${identifier}`] = witem.ad_sales;
              wacc[`ad_spend${identifier}`] = witem.ad_spend;
              return wacc;
            }, {});

            const row1 = {
              key: key + 1,
              indent: 0,
              title: title,
              asin: asin,
              status: status,
              sku: sku,
              ...intervals,
              sales_total: total_sales,
              total_sales,
              ad_sales_total: total_ad_sales,
              ad_spend_total: total_ad_spend,
              sales_change: change_interval_over_interval_sales,
              ad_sales_change: change_interval_over_interval_ad_sales,
              ad_spend_change: change_interval_over_interval_ad_spend,
            };

            acc.push(row1);

            return acc;
          }, []);

          exportToExcel({
            columns: columns.slice(2).reduce(
              (acc, item) => {
                if (item.children) {
                  acc = acc.concat(
                    item.children.map(
                      (child) => `${item.title} - ${child.title}`
                    )
                  );
                } else {
                  acc.push(item.title);
                }
                return acc;
              },
              ["ASIN", "Title", "SKU", "Status"]
            ),
            fileName: `product-report`,
            rows: data.map((item) => [
              item.asin,
              item.title,
              item.sku,
              item.status,
              ...[...findIntervalCount, "_total", "_change"]
                .map((index) =>
                  ["sales", "ad_sales", "ad_spend"].map((key) =>
                    index === "_change"
                      ? percentageFormat(item[`${key}${index}`])
                      : currencyFormat(item[`${key}${index}`])
                  )
                )
                .flat(1),
            ]),
          });
        } else {
          message.error("No Sales data details available yet.");
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

  const exportAllAsinData = () => {
    const columnsList = columns
      .slice(
        2 +
          (paginated
            ? 0
            : _.difference(columnToggle, ["sales", "ad_sales", "ad_spend"])
                .length)
      )
      .reduce(
        (acc, item) => {
          if (item.children) {
            acc = acc.concat(
              item.children.map((child) => `${item.title} - ${child.title}`)
            );
          } else {
            acc.push(item.title);
          }
          return acc;
        },
        [
          "Category",
          // ...(subcategoriesEnabled ? ["Subcategory"] : []),
          "ASIN",
          "Title",
          "SKU",
          "Status",
        ]
      );

    const salesColumnsKeys = ["sales", "ad_sales", "ad_spend"].filter((c) =>
      columnToggle.some((s) => c.startsWith(s))
    );

    if (paginated) {
      message.loading({ content: "Loading...", key: "loading", duration: 0 });
      const { year, week, month, asin, category } = filter;
      const exportData = [];
      const alterProducts = (
        products,
        category_products_total = null,
        category_change_interval_over_interval = null
      ) =>
        Object.values(
          products?.reduce((pacc, pitem, _key) => {
            const identifier = weeklyView
              ? pitem.year * 54 + pitem.week
              : pitem.year * 12 + pitem.month;
            if (pacc[pitem.asin]) {
              pacc[pitem.asin] = {
                ...pacc[pitem.asin],
                [`sales${identifier}`]: pitem.sales,
                [`ad_sales${identifier}`]: pitem.ad_sales,
                [`ad_spend${identifier}`]: pitem.ad_spend,
              };
            } else {
              const total_obj = (
                category_products_total || products_total
              )?.find((fid) => fid.asin === pitem.asin);
              const change_obj = (
                category_change_interval_over_interval ||
                change_interval_over_interval
              )?.find((fid) => fid.asin === pitem.asin);

              pacc[pitem.asin] = {
                asin: pitem.asin,
                title: pitem.title,
                sku: pitem.sku,
                status: pitem.status,
                [`sales${identifier}`]: pitem.sales,
                [`ad_sales${identifier}`]: pitem.ad_sales,
                [`ad_spend${identifier}`]: pitem.ad_spend,
                // products_total
                total_sales: total_obj?.sales || 0,
                sales_total: total_obj?.sales,
                ad_sales_total: total_obj?.ad_sales,
                ad_spend_total: total_obj?.ad_spend,
                sales_change: change_obj?.sales,
                ad_sales_change: change_obj?.ad_sales,
                ad_spend_change: change_obj?.ad_spend,
              };
            }
            return pacc;
          }, {}) || {}
        );

      fetchProductReportExport({
        search_year: year?.join(","),
        asin,
        category: category.join(","),
        ...(weeklyView
          ? { search_week: week?.join(",") }
          : { search_month: month?.map((m) => m + 1).join(",") }),
      })
        .then((res) => {
          if (res.status === 200 && res.data) {
            res.data.map((data) => {
              const {
                category,
                products,
                products_total,
                change_interval_over_interval,
              } = data;

              const productData = alterProducts(
                products,
                products_total,
                change_interval_over_interval
              ).sort((a, b) => b.total_sales - a.total_sales);

              productData.forEach((product) => {
                exportData.push([
                  category,
                  product.asin,
                  product.title,
                  product.sku,
                  product.status,
                  ...[...findIntervalCount, "_total", "_change"]
                    .map((index) =>
                      salesColumnsKeys.map((key) =>
                        index === "_change"
                          ? percentageFormat(product[`${key}${index}`])
                          : currencyFormat(product[`${key}${index}`])
                      )
                    )
                    .flat(1),
                ]);
              });
            });

            exportToExcel({
              columns: columnsList,
              fileName: `product-report`,
              rows: exportData,
            });
          } else {
            message.error("No Sales data details available yet.");
          }
          message.destroy();
        })
        .catch((err) => {
          message.destroy();
          if (err?.response?.status !== 401) {
            message.error(err?.response?.message || "Something Went Wrong.");
          }
        })
        .finally(() => {
          message.destroy("loading");
        });

      // pending
    } else {
      exportToExcel({
        columns: columnsList,
        fileName: `product-report`,
        rows: data.reduce((acc, { children, key, name: category, ...item }) => {
          if (children) {
            children.map(({ name, pd, sku, status, children, ...child }) => {
              const val = [category, name, pd, sku, status];
              [...findIntervalCount, "_total", "_change"].map((index) => {
                salesColumnsKeys.map((key) => {
                  index === "_change"
                    ? val.push(percentageFormat(child[`${key}${index}`]))
                    : val.push(currencyFormat(child[`${key}${index}`]));
                });
              });
              acc.push(val);
            });
          }

          return acc;
        }, []),
      });
    }
  };

  const findIntervalCount = useMemo(
    () =>
      _.uniqBy(
        list.reduce((acc, item) => {
          const intervals = item.interval_sales.map((item) =>
            weeklyView
              ? item.year * 54 + item.week
              : item.year * 12 + item.month
          );
          acc = acc.concat(intervals);
          return acc;
        }, [])
      ).sort((a, b) => a - b),
    [list, filter]
  );

  const intervalGroupColumn =
    findIntervalCount.map((item) => ({
      title: weeklyView
        ? `${parseInt(item / 54)}-WK${item % 54}`
        : `${parseInt((item - 1) / 12)}-${moment
            .months()
            [(item - 1) % 12]?.substring(0, 3)}`,
      key: `interval${item}`,
      width: 300,
      children: [
        columnToggle.includes("sales") && {
          title: "Sales",
          width: 110,
          key: `sales${item}`,
          sorter: (a, b) => (a[`sales${item}`] || 0) - (b[`sales${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`sales${item}`]);
          },
        },
        columnToggle.includes("ad_sales") && {
          title: "AD Sales",
          width: 110,
          key: `ad_sales${item}`,
          sorter: (a, b) =>
            (a[`ad_sales${item}`] || 0) - (b[`ad_sales${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`ad_sales${item}`]);
          },
        },
        columnToggle.includes("ad_spend") && {
          title: "AD Spend",
          width: 110,
          key: `ad_spend${item}`,
          sorter: (a, b) =>
            (a[`ad_spend${item}`] || 0) - (b[`ad_spend${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`ad_spend${item}`]);
          },
        },
      ].filter(Boolean),
    })) || [];

  const columns = useMemo(
    () =>
      [
        {
          title: "",
          width: paginated ? 110 : 60,
          key: "details",
          fixed: "left",
          render: (text) => {
            return (
              <>
                {!paginated || text.children ? (
                  <></>
                ) : (
                  <>
                    <CustomDrawer
                      bodyStyle={{ padding: 0 }}
                      onClose={() => setExpand(null)}
                      title={text.category}
                      opener={
                        <div
                          className="d-inline"
                          onMouseDown={() => {
                            setExpand(text.category_id || "Uncategorized");
                          }}
                        >
                          <FontAwesomeIcon
                            style={{
                              marginRight: "10px",
                            }}
                            icon={faExpand}
                            color="#181C32"
                            className="w-15px h-15px cursor-pointer"
                          />
                        </div>
                      }
                    >
                      {() => {
                        return (
                          <>
                            <div className="card-toolbar gap-3 float-end py-2 px-5">
                              <Checkbox.Group
                                options={columnToggleOptions}
                                value={columnToggle}
                                onChange={onChange}
                              />

                              <button
                                className="btn btn-light-danger btn-sm fw-bolder"
                                onClick={() => {
                                  exportCategoryDetails(expand);
                                }}
                              >
                                Export Data
                              </button>
                            </div>

                            <CategoryProductDetails
                              productsData={ProductsReportListRes.data || []}
                              weeklyView={weeklyView}
                              columnToggle={columnToggle}
                              loading={productsReportLoading}
                            />
                            <div className="row py-3">
                              <Pagination
                                loading={
                                  tableLoading ||
                                  ProductsReportListRes.count == 0
                                }
                                pageSize={ProductsReportListRes.limit}
                                page={ProductsReportListRes.page}
                                totalPage={ProductsReportListRes.count}
                                onPerPage={onPerPage}
                                onPageNo={onPageNo}
                              />
                            </div>
                          </>
                        );
                      }}
                    </CustomDrawer>
                    <Tooltip title={`Export`}>
                      <FontAwesomeIcon
                        icon={faFileExcel}
                        color="#181C32"
                        className="w-15px h-15px cursor-pointer"
                        onClick={() => {
                          exportCategoryDetails(
                            text.category_id || "Uncategorized"
                          );
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </>
            );
          },
        },
        {
          title: "Row Labels",
          width: 250,
          key: "name",
          fixed: "left",
          render: (text) => {
            return (
              <>
                {text.pd ? (
                  <span className="one mb-2">
                    <span style={{ paddingLeft: text.indent * 30 }} />
                    <Link
                      href={`https://amazon.com/dp/${text?.name}`}
                      title="Click to view on Amazon"
                      target="_blank"
                    >
                      {text?.name}
                    </Link>
                  </span>
                ) : (
                  <span>
                    <span style={{ paddingLeft: text.indent * 30 }} />
                    <b>{text.name}</b>
                  </span>
                )}
              </>
            );
          },
        },
        !paginated &&
          columnToggle.includes("pg") && {
            title: "Product Detail",
            width: 221,
            dataIndex: "pd",
            key: "pd",
            fixed: "left",
          },
        !paginated &&
          columnToggle.includes("status") && {
            title: "Active Status",
            width: 129,
            dataIndex: "status",
            key: "status",
            fixed: "left",
          },
        ...intervalGroupColumn,
        {
          title: "Total",
          dataIndex: "total",
          key: "total",
          width: 390,
          children: [
            columnToggle.includes("sales") && {
              title: "Sales",
              width: 130,
              key: `sales_total`,
              sorter: (a, b) => a.sales_total - b.sales_total,
              render: (text) => {
                return currencyFormat(text.sales_total);
              },
            },
            columnToggle.includes("ad_sales") && {
              title: "AD Sales",
              width: 130,
              key: `ad_sales_total`,
              sorter: (a, b) => a.ad_sales_total - b.ad_sales_total,
              render: (text) => {
                return currencyFormat(text.ad_sales_total);
              },
            },
            columnToggle.includes("ad_spend") && {
              title: "AD Spend",
              width: 130,
              key: `ad_spend_total`,
              sorter: (a, b) => a.ad_spend_total - b.ad_spend_total,
              render: (text) => {
                return currencyFormat(text.ad_spend_total);
              },
            },
          ].filter(Boolean),
        },
        {
          title: `Change ${weeklyView ? "Week Over Week" : "Month Over Month"}`,
          dataIndex: "change_interval_over_interval",
          key: "change_interval_over_interval",
          width: 330,
          children: [
            columnToggle.includes("sales") && {
              title: "Sales",
              width: 110,
              key: `sales_change`,
              sorter: (a, b) => a.sales_change - b.sales_change,
              render: (text) => {
                return percentageFormat(text.sales_change);
              },
            },
            columnToggle.includes("ad_sales") && {
              title: "AD Sales",
              width: 110,
              key: `ad_sales_change`,
              sorter: (a, b) => a.ad_sales_change - b.ad_sales_change,
              render: (text) => {
                return percentageFormat(text.ad_sales_change);
              },
            },
            columnToggle.includes("ad_spend") && {
              title: "AD Spend",
              width: 110,
              key: `ad_spend_change`,
              sorter: (a, b) => a.ad_spend_change - b.ad_spend_change,
              render: (text) => {
                return percentageFormat(text.ad_spend_change);
              },
            },
          ].filter(Boolean),
        },
      ].filter(Boolean),
    [list, filter, intervalGroupColumn, columnToggle]
  );

  const data = useMemo(
    () =>
      list
        ?.reduce((acc, item, key) => {
          const {
            total_sales,
            total_ad_sales,
            total_ad_spend,
            change_interval_over_interval_ad_sales,
            change_interval_over_interval_ad_spend,
            change_interval_over_interval_sales,
            interval_sales,
            categories,
            category_id,
            products,
            products_total,
            change_interval_over_interval,
          } = item;

          const alterProducts = (
            products,
            category_products_total = null,
            category_change_interval_over_interval = null
          ) =>
            Object.values(
              products?.reduce((pacc, pitem, key) => {
                const identifier = weeklyView
                  ? pitem.year * 54 + pitem.week
                  : pitem.year * 12 + pitem.month;
                if (pacc[pitem.asin]) {
                  pacc[pitem.asin] = {
                    ...pacc[pitem.asin],
                    [`sales${identifier}`]: pitem.sales,
                    [`ad_sales${identifier}`]: pitem.ad_sales,
                    [`ad_spend${identifier}`]: pitem.ad_spend,
                  };
                } else {
                  const total_obj = (
                    category_products_total || products_total
                  )?.find((fid) => fid.asin === pitem.asin);
                  const change_obj = (
                    category_change_interval_over_interval ||
                    change_interval_over_interval
                  )?.find((fid) => fid.asin === pitem.asin);

                  pacc[pitem.asin] = {
                    name: pitem.asin,
                    key: pitem.asin,
                    indent: 2,
                    pd: `${pitem.title || pitem.sku || "---"} `,
                    status: pitem.status,
                    sku: pitem.sku,
                    [`sales${identifier}`]: pitem.sales,
                    [`ad_sales${identifier}`]: pitem.ad_sales,
                    [`ad_spend${identifier}`]: pitem.ad_spend,
                    // products_total
                    total_sales: total_obj?.sales || 0,
                    sales_total: total_obj?.sales,
                    ad_sales_total: total_obj?.ad_sales,
                    ad_spend_total: total_obj?.ad_spend,
                    sales_change: change_obj?.sales,
                    ad_sales_change: change_obj?.ad_sales,
                    ad_spend_change: change_obj?.ad_spend,
                  };
                }
                return pacc;
              }, {}) || {}
            );

          const intervals = interval_sales.reduce((wacc, witem, key) => {
            const identifier = weeklyView
              ? witem.year * 54 + witem.week
              : witem.year * 12 + witem.month;

            wacc[`sales${identifier}`] = witem.sales;
            wacc[`ad_sales${identifier}`] = witem.ad_sales;
            wacc[`ad_spend${identifier}`] = witem.ad_spend;
            return wacc;
          }, {});

          const categoriesList = (category_id) => {
            if (category_id) {
              return Object.values(
                categories?.reduce((cacc, citem, key) => {
                  const intervals = citem.interval_sales.reduce(
                    (wacc, witem, key) => {
                      const identifier = weeklyView
                        ? witem.year * 54 + witem.week
                        : witem.year * 12 + witem.month;

                      wacc[`sales${identifier}`] = witem.sales;
                      wacc[`ad_sales${identifier}`] = witem.ad_sales;
                      wacc[`ad_spend${identifier}`] = witem.ad_spend;
                      return wacc;
                    },
                    {}
                  );

                  cacc[citem.category_id] = {
                    key: `${citem.parent_category_id}_${citem.category_id}`,
                    name: citem.category,
                    category_id: citem.category_id,
                    indent: 1,
                    ...intervals,
                    sales_total: citem.total_sales,
                    total_sales: citem.total_sales,
                    ad_sales_total: citem.total_ad_sales,
                    ad_spend_total: citem.total_ad_spend,
                    sales_change: citem.change_interval_over_interval_sales,
                    ad_sales_change:
                      citem.change_interval_over_interval_ad_sales,
                    ad_spend_change:
                      citem.change_interval_over_interval_ad_spend,
                    children: paginated
                      ? null
                      : alterProducts(
                          citem.products,
                          citem.products_total,
                          citem.change_interval_over_interval
                        ).sort((a, b) => b.total_sales - a.total_sales),
                  };
                  return cacc;
                }, {}) || {}
              );
            }
            const uncategorized_products_total = _.flattenDeep(
              categories?.map((item) => item.products_total)
            );
            const uncategorized_change_week_over_week = _.flattenDeep(
              categories?.map((item) => item.change_interval_over_interval)
            );

            return _.flattenDeep(
              categories?.map((item) =>
                alterProducts(
                  item.products,
                  uncategorized_products_total,
                  uncategorized_change_week_over_week
                )
              )
            );
          };

          const children = [
            ...alterProducts(products),
            ...categoriesList(category_id),
          ].sort((a, b) => b.total_sales - a.total_sales);
          const row1 = {
            key: key + 1,
            indent: 0,
            name: item.category,
            category_id: category_id,
            ...intervals,
            sales_total: total_sales,
            total_sales,
            ad_sales_total: total_ad_sales,
            ad_spend_total: total_ad_spend,
            sales_change: change_interval_over_interval_sales,
            ad_sales_change: change_interval_over_interval_ad_sales,
            ad_spend_change: change_interval_over_interval_ad_spend,
            children: children.length > 0 ? children : null,
          };

          acc.push(row1);

          return acc;
        }, [])
        .sort((a, b) => b.total_sales - a.total_sales),
    [list, filter]
  );

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
            <div className="float-start w-auto">
              {TopBarFilter(filter, setFilter, weeklyView ? "Week" : "Month")}
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

            <div className="col-lg-12">
              <div className="card mb-1">
                <div className="card-header border-bottom border-bottom-dashed">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-0">
                      Product Report List
                    </span>
                  </h3>
                  <div className="card-toolbar gap-3">
                    <Checkbox.Group
                      options={
                        paginated
                          ? columnToggleOptions.filter((c) => c.paginated)
                          : columnToggleOptions
                      }
                      value={columnToggle}
                      onChange={onChange}
                    />
                    <ExportToExcel
                      fileName={"category-product-report"}
                      loading={tableLoading}
                      buttonText="Export Categories"
                      columns={columns
                        .slice(
                          2 +
                            (paginated
                              ? 0
                              : _.difference(columnToggle, [
                                  "sales",
                                  "ad_sales",
                                  "ad_spend",
                                ]).length)
                        )
                        .reduce(
                          (acc, item) => {
                            if (item.children) {
                              acc = acc.concat(
                                item.children.map(
                                  (child) => `${item.title} - ${child.title}`
                                )
                              );
                            } else {
                              acc.push(item.title);
                            }
                            return acc;
                          },
                          [
                            "Category",
                            ...(subcategoriesEnabled ? ["Subcategory"] : []),
                          ]
                        )}
                      rows={data.reduce(
                        (acc, { children, key, name: category, ...item }) => {
                          const val = [category];
                          if (subcategoriesEnabled) {
                            val.push("");
                          }
                          const keys = ["sales", "ad_sales", "ad_spend"].filter(
                            (c) => columnToggle.some((s) => c.startsWith(s))
                          );
                          [...findIntervalCount, "_total", "_change"].map(
                            (index) => {
                              keys.map((key) => {
                                index === "_change"
                                  ? val.push(
                                      percentageFormat(item[`${key}${index}`])
                                    )
                                  : val.push(
                                      currencyFormat(item[`${key}${index}`])
                                    );
                              });
                            }
                          );

                          acc.push(val);

                          if (children && subcategoriesEnabled) {
                            children.map(({ name, children, ...child }) => {
                              const val = [category, children ? "" : name];
                              [...findIntervalCount, "_total", "_change"].map(
                                (index) => {
                                  keys.map((key) => {
                                    index === "_change"
                                      ? val.push(
                                          percentageFormat(
                                            child[`${key}${index}`]
                                          )
                                        )
                                      : val.push(
                                          currencyFormat(
                                            child[`${key}${index}`]
                                          )
                                        );
                                  });
                                }
                              );
                              acc.push(val);
                            });
                          }

                          return acc;
                        },
                        []
                      )}
                    ></ExportToExcel>
                    {!subcategoriesEnabled && (
                      <button
                        className="btn btn-light-danger btn-sm fw-bolder"
                        disabled={tableLoading}
                        onClick={() => {
                          exportAllAsinData();
                        }}
                      >
                        Export ASINs
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-body pt-0 px-4" style={{}}>
                  {tableLoading ? (
                    <Loading />
                  ) : list?.length != 0 ? (
                    <ASINTable
                      bordered
                      columns={columns}
                      dataSource={data}
                      loading={tableLoading}
                      pagination={false}
                      resizable
                      id={`product-report${paginated ? "-paginated" : ""}`}
                      scroll={{
                        // y:
                        //   typeof window !== "undefined"
                        //     ? window.innerHeight - 310
                        //     : undefined,
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
                          }, 0) + 500,
                      }}
                    />
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

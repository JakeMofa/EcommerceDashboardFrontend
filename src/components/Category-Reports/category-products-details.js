import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ASINTable from "../table";
import { useSelector } from "react-redux";
import moment from "moment";

import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { selectProductsReportList } from "@/src/store/slice/productReport.slice";

const CategoryProductDetails = ({ weeklyView, columnToggle, loading }) => {
  const ProductsReportListRes = useSelector(selectProductsReportList);
  const [list, setList] = useState([]);

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
    [list]
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
          width: 116,
          key: `sales${item}`,
          sorter: (a, b) => (a[`sales${item}`] || 0) - (b[`sales${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`sales${item}`]);
          },
        },
        columnToggle.includes("ad_sales") && {
          title: "AD Sales",
          width: 116,
          key: `ad_sales${item}`,
          sorter: (a, b) =>
            (a[`ad_sales${item}`] || 0) - (b[`ad_sales${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`ad_sales${item}`]);
          },
        },
        columnToggle.includes("ad_spend") && {
          title: "AD Spend",
          width: 116,
          key: `ad_spend${item}`,
          sorter: (a, b) =>
            (a[`ad_spend${item}`] || 0) - (b[`ad_spend${item}`] || 0),
          render: (text) => {
            return currencyFormat(text[`ad_spend${item}`]);
          },
        },
      ].filter(Boolean),
    })) || [];

  useEffect(() => {
    setList(ProductsReportListRes.items);
  }, [ProductsReportListRes]);

  const columns = useMemo(
    () =>
      [
        {
          title: "Row Labels",
          width: 250,
          key: "name",
          fixed: "left",
          render: (text) => {
            return (
              <>
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
              </>
            );
          },
        },
        columnToggle.includes("pg") && {
          title: "Product Detail",
          width: 221,
          dataIndex: "title",
          key: "title",
          fixed: "left",
        },
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
    [list, intervalGroupColumn, columnToggle]
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
            title: title || sku,
            name: asin,
            status: status,
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
        }, [])
        .sort((a, b) => b.total_sales - a.total_sales),
    [list]
  );

  return (
    <>
      <ASINTable
        rowHeight={130}
        columns={columns}
        dataSource={data}
        ellipsis
        rowKey="key"
        loading={loading}
        pagination={false}
        scroll={{
          y:
            typeof window !== "undefined"
              ? window.innerHeight - 220
              : undefined,
          x: columns?.reduce((a, b) => a.width + b.width, 0) + 300,
        }}
      />
    </>
  );
};

export default CategoryProductDetails;

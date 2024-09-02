import Link from "next/link";
import ASINTable from "../table";

import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";

const WeekExpandAsin = (props) => {
  const columns = [
    {
      title: "Week Date Range",
      width: 275,
      render: (r) => {
        if (r.type === "main_row") {
          return (
            <>
              {" "}
              {r?.start_date}
              &nbsp;to&nbsp;
              {r?.end_date}
            </>
          );
        }
        return (
          <>
            <div className="fs-7">
              <b className="one mb-2">
                <Link
                  className="text-dark"
                  href={`https://amazon.com/dp/${r?.child_asin}`}
                  title="Click to view on Amazon"
                  target="_blank"
                >
                  {r?.title}
                </Link>
              </b>
              <span className="d-flex mt-0">
                <b className="fw-boldest me-2 text-dark">Parent ASIN: </b>
                {r?.parent_asin}
              </span>
              <span className="d-flex mt-1">
                <b className="fw-boldest me-2 text-dark">Child ASIN: </b>{" "}
                <Link
                  href={`https://amazon.com/dp/${r?.child_asin}`}
                  target="_blank"
                >
                  {r?.child_asin}
                </Link>
              </span>
              <span className="d-flex mt-1">
                <b className="fw-boldest me-2 text-dark">SKU: </b>
                {r?.sku}
              </span>
            </div>
          </>
        );
      },
    },
    {
      title: "Row Labels",
      width: 150,
      render: (r) => {
        return (
          <>
            {r.type === "main_row" && (
              <span>
                {r?.year}-{r?.week_name}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: "Ordered Product Sales",
      width: 260,
      sorter: (a, b) =>
        a.total_ordered_product_sales - b.total_ordered_product_sales,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{currencyFormat(r?.totalOrderedProductSales)}</>;
        }

        return currencyFormat(r?.total_ordered_product_sales);
      },
    },
    {
      title: "Sum of Sessions",
      width: 160,
      sorter: (a, b) => a.total_session - b.total_session,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{numberFormat(r?.totalSession)}</>;
        }

        return <>{numberFormat(r?.total_session)}</>;
      },
    },
    {
      title: "Average Traffic Percentage",
      width: 250,
      sorter: (a, b) => a.avg_session_percentage - b.avg_session_percentage,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{percentageFormat(r?.totalSessionPercentage)}</>;
        }

        return <>{percentageFormat(r?.avg_session_percentage)}</>;
      },
    },
    {
      title: "Sum of Page Views",
      width: 185,
      sorter: (a, b) => a.total_page_views - b.total_page_views,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{numberFormat(r?.totalPageViews)}</>;
        }

        return <>{numberFormat(r?.total_page_views)}</>;
      },
    },
    {
      title: "Average Page View Percentage",
      width: 260,
      sorter: (a, b) => a.avg_page_view_percentage - b.avg_page_view_percentage,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{percentageFormat(r?.avgPageViewPercentage)}</>;
        }
        return <>{percentageFormat(r?.avg_page_view_percentage)}</>;
      },
    },
    {
      title: "Average of Buy Box",
      width: 185,
      sorter: (a, b) => a.avg_buy_box_percentage - b.avg_buy_box_percentage,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{percentageFormat(r?.avgBuyBox)}</>;
        }
        return <>{percentageFormat(r?.avg_buy_box_percentage)}</>;
      },
    },
    {
      title: "Sum of Units Ordered",
      width: 200,
      sorter: (a, b) => a.total_ordered_units - b.total_ordered_units,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{numberFormat(r?.totalUnitOrdered)}</>;
        }
        return <>{numberFormat(r?.total_ordered_units)}</>;
      },
    },
    {
      title: "Conversion Rate",
      width: 250,
      sorter: (a, b) =>
        a.avg_unit_session_percentage - b.avg_unit_session_percentage,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{percentageFormat(r?.avgUnitSession)}</>;
        }
        return <>{percentageFormat(r?.avg_unit_session_percentage)}</>;
      },
    },
    {
      title: "Sum of Total Order Items",
      width: 250,
      sorter: (a, b) => a.total_order_items - b.total_order_items,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{numberFormat(r?.totalOrderItems)}</>;
        }
        return <>{numberFormat(r?.total_order_items)}</>;
      },
    },
    {
      title: "Sum of Ad Spend",
      width: 250,
      sorter: (a, b) => a.spend - b.spend,
      render: (r) => {
        return <>{currencyFormat(r?.spend)}</>;
      },
    },
    {
      title: "Sum of Ad Sales",
      width: 250,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (r) => {
        return <>{currencyFormat(r?.revenue)}</>;
      },
    },
    {
      title: "Total ACOS",
      width: 250,
      sorter: (a, b) => a.tacos - b.tacos,
      render: (r) => {
        return <>{percentageFormat(r?.tacos || r?.ACoS)}</>;
      },
    },
    {
      title: "Sum of Sponsored Product Spend",
      width: 260,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{currencyFormat(r?.product_spend)}</>;
        }
        return <>{currencyFormat(r?.spend)}</>;
      },
    },
    {
      title: "Sum of Sponsored Product Sales",
      width: 260,
      render: (r) => {
        if (r.type === "main_row") {
          return <>{currencyFormat(r?.product_revenue)}</>;
        }
        return <>{currencyFormat(r?.revenue)}</>;
      },
    },
  ];
  return (
    <>
      <ASINTable
        virtual
        rowHeight={130}
        columns={columns}
        dataSource={[
          { type: "main_row", ...props.dataSource },
          ...props.asinData,
        ]}
        ellipsis
        rowKey="key"
        pagination={false}
        scroll={{
          y:
            typeof window !== "undefined"
              ? window.innerHeight - 160
              : undefined,
          x: columns?.reduce((a, b) => a.width + b.width, 0),
        }}
      />
    </>
  );
};

export default WeekExpandAsin;

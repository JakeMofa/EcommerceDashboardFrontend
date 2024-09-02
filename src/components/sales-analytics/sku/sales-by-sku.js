import { useState, useEffect } from "react";
import { Tooltip } from "antd";
import Loading from "../../loading";
import ASINTable from "../../table";
import Image from "rc-image";
import NoData from "@/src/components/no-data";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import Drawer from "@/src/components/drawer";
import {
  fetchConfigurations,
  updateConfigurations,
} from "@/src/api/configurations.api";
import { useSelector } from "react-redux";
import { selectSalesBySkuDetailsList } from "@/src/store/slice/salesBySku.slice";
import _ from "lodash";
import Pagination from "@/src/components/pagination";

const configurationTableKey = "sales-by-sku-table";

export default function SalesBySkuTable({
  loading,
  onPageNo,
  onPerPage,
  handleChange,
  exportSalesBySKU,
  showDSP,
}) {
  const salesSKUDetailsList = useSelector(selectSalesBySkuDetailsList);

  const [isOpen, setIsOpen] = useState(false);
  const [columnConfig, setColumnConfig] = useState([]);
  const [columnConfigLoaded, setColumnConfigLoaded] = useState(false);

  useEffect(() => {
    setColumnConfig(columns.slice(1).map((d) => d.title));

    fetchConfigurations(configurationTableKey)
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
  }, []);

  useEffect(() => {
    if (columnConfigLoaded && columnConfig.length > 0) {
      updateConfigurations(configurationTableKey, columnConfig);
    }
  }, [columnConfig]);

  const columns = [
    {
      title: "Row Labels",
      width: 320,
      fixed: "left",
      align: "left",
      ellipsis: true,
      render: (text) => {
        return (
          <div className="d-flex align-items-center position-relative">
            <div className="symbol symbol-75px me-5">
              <Image
                src={text?.image_urls || "/images/no-product-image.png"}
                onError={(ev) =>
                  (ev.target.src = "/images/no-product-image.png")
                }
                loading="lazy"
                style={{ objectFit: "contain" }}
                alt="product image"
                width={50}
                height={50}
              />
            </div>
            <div className="d-flex justify-content-start flex-column">
              <span className="text-dark fw-boldest fs-6 mb-1">
                <Tooltip row={2} rule title={text?.title} placement="topLeft">
                  {text?.title || ""}
                </Tooltip>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">Child ASIN:</b>{" "}
                  <a
                    className
                    href={`https://amazon.com/dp/${text?.child_asin}`}
                    title="View on Amazon"
                    target="_blank"
                  >
                    {text?.child_asin}
                  </a>
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">Parent ASIN:</b>{" "}
                  {text?.parent_asin}
                </div>
              </span>
              <span className="text-muted font-weight-bold  fs-12 d-flex mt-1">
                <div className="text-dark">
                  <b className="text-dark fw-boldest">SKU:</b> {text?.sku}
                </div>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Ordered Revenue",
      width: 150,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "ordered_product_sales_sum",
      render: (text) => {
        return currencyFormat(text?.ordered_product_sales_sum);
      },
    },
    {
      title: "Total Sessions",
      width: 140,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_sessions_sum",
      render: (text) => {
        return numberFormat(text?.astr_sessions_sum);
      },
    },
    {
      title: "Session Percentage",
      width: 160,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_session_percentage_avg",
      render: (text) => {
        return percentageFormat(text?.astr_session_percentage_avg);
      },
    },
    {
      title: "Total Page Views",
      width: 150,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_page_views_sum",
      render: (text) => {
        return numberFormat(text?.astr_page_views_sum);
      },
    },
    {
      title: "Page View Percentage",
      width: 180,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_page_view_percentage_avg",
      render: (text) => {
        return percentageFormat(text?.astr_page_view_percentage_avg);
      },
    },
    {
      title: "Average Of Buy Box",
      width: 170,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_buy_box_percentage_avg",
      render: (text) => {
        return percentageFormat(text?.astr_buy_box_percentage_avg);
      },
    },
    {
      title: "Units Ordered",
      width: 130,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "astr_units_ordered_sum",
      render: (text) => {
        return numberFormat(text?.astr_units_ordered_sum);
      },
    },
    {
      title: "Conversion Rate",
      width: 150,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "unit_session_percentage_avg",
      render: (text) => {
        return percentageFormat(text?.unit_session_percentage_avg);
      },
    },
    {
      title: "Total Orders",
      width: 130,
      align: "left",
      ellipsis: true,
      sorter: true,
      key: "total_order_items_sum",
      render: (text) => {
        return numberFormat(text?.total_order_items_sum);
      },
    },
    {
      title: "Ad Spend",
      width: 100,
      align: "left",
      ellipsis: true,
      key: "spend",
      render: (text) => {
        return currencyFormat(text?.spend);
      },
    },
    {
      title: "Ad Sales",
      width: 100,
      align: "left",
      ellipsis: true,
      key: "revenue",
      render: (text) => {
        return currencyFormat(text?.revenue);
      },
    },
    {
      title: "TACOS",
      width: 100,
      align: "left",
      ellipsis: true,
      key: "tacos",
      render: (text) => {
        return percentageFormat(text?.tacos);
      },
    },
  ];

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bolder fs-3 mb-1">
                Sales by SKU
              </span>
            </h3>

            <div className="card-toolbar">
              <button
                onClick={() => setIsOpen(true)}
                className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                id="kt_drawer_example_basic_button"
              >
                {" "}
                Configuration{" "}
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-light-danger fs-7 px-10"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={exportSalesBySKU}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="card-body pt-0 px-4" style={{}}>
            {loading && salesSKUDetailsList.status != true ? (
              <Loading />
            ) : salesSKUDetailsList.items?.length != 0 ? (
              <ASINTable
                id="sales-by-sku"
                columns={columns.filter(
                  (c) =>
                    c.title == "Row Labels" || columnConfig.includes(c.title)
                )}
                dataSource={salesSKUDetailsList.items}
                rowKey="child_asin"
                loading={loading}
                onChange={handleChange}
                resizable
                pagination={false}
                scroll={{
                  y:
                    typeof window !== "undefined"
                      ? window.innerHeight - 310
                      : undefined,
                  x:
                    columns
                      .filter(
                        (c) =>
                          c.title == "Row Labels" ||
                          columnConfig.includes(c.title)
                      )
                      ?.reduce((a, b) => a + (b.width || 0), 0) + 300,
                }}
              />
            ) : (
              <NoData />
            )}
            <div className="row pt-4">
              <Pagination
                loading={loading || salesSKUDetailsList.count == 0}
                pageSize={salesSKUDetailsList.limit}
                page={salesSKUDetailsList.page}
                totalPage={salesSKUDetailsList.count}
                onPerPage={onPerPage}
                onPageNo={onPageNo}
              />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <Drawer
          columnsList={columns.slice(1).map((d) => d.title)}
          columnConfig={columnConfig}
          setColumnConfig={setColumnConfig}
          defaultConfig={columns.slice(1).map((d) => d.title)}
          open={isOpen}
          onHide={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

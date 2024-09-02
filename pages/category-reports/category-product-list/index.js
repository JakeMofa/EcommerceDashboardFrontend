import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import ASINTable from "@/src/components/table";
import Loading from "@/src/components/loading";
import NoData from "@/src/components/no-data";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import TopBarFilter from "./top-bar-filter-category-product";
import _ from "lodash";
import { getCategoryProductList } from "@/src/services/categoryProductList.services";
import { selectCategoryProductList } from "@/src/store/slice/categoryProductList.slice";
import { Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import EditCategoryProductData from "@/src/components/EditCategoryProductData";
import EditSKUAsin from "@/src/components/Category-Reports/EditSkuAsin";
import { getCategoryList } from "@/src/services/categoryList.services";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import CustomModal from "@/src/components/modal";
import UploadCategoryProductData from "@/src/components/Category-Reports/UploadCategoryProductData";
import Pagination from "@/src/components/pagination";
import { exportToExcel } from "@/src/hooks/Excelexport";
import {
  deleteCategoryProduct,
  fetchCategoryProductList,
} from "@/src/api/categoryProductList.api";
import { fetchProductDataNoASINsSKUs } from "@/src/api/asinAndSkuList.api";
const { confirm } = Modal;

export default function CategoryProductList() {
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const CategoryListRes = useSelector(selectCategoryList);

  const dispatch = useDispatch();

  const CategoryProductListRes = useSelector(selectCategoryProductList);

  const [openEdit, setOpenEdit] = useState(null);
  const [openEditSKU, setOpenEditSKU] = useState(null);

  const [list, setList] = useState([]);
  const [subCategoriesEnabled, setSubCategoriesEnabled] = useState(null);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 20,
    order: "asc",
    orderBy: "category",
    "search[category]": [],
    "search[asin]": "",
    "search[sku]": undefined,
    "search[product_title]": undefined,
    "search[product_status]": undefined,
  });

  useEffect(() => {
    dispatch(getCategoryList({ limit: 9999 }));
  }, []);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setSubCategoriesEnabled(brand?.subcategories_enabled);
  }, []);

  useEffect(() => {
    let time = setTimeout(() => {
      setTableLoading(true);
      dispatch(getCategoryProductList(filter));
    }, 600);
    return () => {
      clearTimeout(time);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (CategoryProductListRes?.status === true) {
      setLoading(false);
      setTableLoading(false);
      const isValidData = Array.isArray(CategoryProductListRes.items);
      isValidData &&
        setList(
          CategoryProductListRes.items.map((asin) => {
            return {
              ...asin,
              children: asin.sku?.split(",")?.map((sku) => ({
                child: true,
                category: "-",
                parent_category: "-",
                asin: asin.asin,
                sku: sku,
                product_title: "-",
                product_status: "-",
              })),
            };
          })
        );
    } else if (CategoryProductListRes.status === false) {
      setLoading(false);
      setTableLoading(false);
    }
  }, [CategoryProductListRes]);

  const handleChange = (_pagination, _filters, sorter) => {
    const order =
      (sorter.order?.startsWith("asc") && "asc") ||
      (sorter.order?.startsWith("desc") && "desc") ||
      undefined;

    const sortFilter = { order, orderBy: order ? sorter.columnKey : undefined };
    setFilter({
      ...filter,
      ...sortFilter,
      page: 1,
      order,
      orderBy: order ? sorter.columnKey : undefined,
    });
  };

  const onPageNo = (e) => {
    setFilter({ ...filter, page: e });
  };

  const onPerPage = (e) => {
    setFilter({ ...filter, limit: e, page: 1 });
  };

  const exportUncategorizedAsin = () => {
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchCategoryProductList({
      page: 1,
      limit: 999999,
      order: "asc",
      orderBy: "category",
      "search[category]": ["Uncategorizerd"],
      "search[asin]": "",
      "search[sku]": undefined,
      "search[product_title]": undefined,
      "search[product_status]": undefined,
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          fetchProductDataNoASINsSKUs({
            limit: 999999,
          })
            .then((sku_res) => {
              if (sku_res.status === 200 && sku_res.data) {
                exportToExcel({
                  columns: [
                    "Category",
                    "Subcategory",
                    "Asin",
                    "Sku",
                    "Product Title",
                    "Product Status",
                  ],
                  fileName: "asins-and-skus",
                  rows: [
                    ...res.data.items.map((text) => {
                      return {
                        ["Category"]: "",
                        ["Subcategory"]: "",
                        ["Asin"]: text?.asin,
                        ["Sku"]: text?.sku,
                        ["Product Title"]: text?.product_title,
                        ["Product Status"]: text?.product_status,
                      };
                    }),
                    ...sku_res.data.map((text) => ({
                      ["Category"]: "",
                      ["Subcategory"]: "",
                      ["Asin"]: "",
                      ["Sku"]: text.sku,
                      ["Product Title"]: text.product_name,
                      ["Product Status"]: "",
                    })),
                  ],
                });
              } else {
                message.error("Something Went Wrong. Please try again later");
              }
            })
            .finally(() => {
              message.destroy("loading");
            });
        } else {
          message.destroy("loading");
          message.error("Something Went Wrong. Please try again later");
        }
      })
      .catch((err) => {
        message.destroy("loading");
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };

  const columns = [
    ...(subCategoriesEnabled
      ? [
          {
            title: "Category",
            width: "120px",
            align: "center",
            sorter: true,
            key: "parent_category",
            render: (text) => {
              return text?.parent_category ? (
                <span>{text?.parent_category}</span>
              ) : (
                <span className="text-danger">Uncategorized</span>
              );
            },
          },
          {
            title: "Subcategory",
            width: "120px",
            align: "center",
            sorter: true,
            key: "category",
            render: (text) => {
              return text?.category ? (
                <span>{text?.category}</span>
              ) : (
                <span className="text-danger">Uncategorized</span>
              );
            },
          },
        ]
      : [
          {
            title: "Category",
            width: "120px",
            align: "center",
            sorter: true,
            key: "category",
            render: (text) => {
              return text?.category ? (
                <span>{text?.category}</span>
              ) : (
                <span className="text-danger">Uncategorized</span>
              );
            },
          },
        ]),
    {
      title: "Asin",
      width: "120px",
      align: "center",
      sorter: true,
      key: "asin",
      render: (text) => {
        return <span>{text?.asin}</span>;
      },
    },
    {
      title: "Sku",
      width: "130px",
      align: "center",
      sorter: true,
      key: "sku",
      render: (text) => {
        return <span>{text?.sku}</span>;
      },
    },
    {
      title: "Case Pack Size",
      width: "110px",
      align: "center",
      sorter: true,
      key: "case_pack_size",
      render: (text) => {
        return <span>{text?.case_pack_size || "N/A"}</span>;
      },
    },
    {
      title: "Product Title",
      width: "100px",
      align: "center",
      sorter: true,
      key: "product_title",
      render: (text) => {
        return <span>{text?.product_title}</span>;
      },
    },
    {
      title: "Product Status",
      width: "120px",
      align: "center",
      sorter: true,
      key: "product_status",
      render: (text) => {
        return <span>{`${text?.product_status}`}</span>;
      },
    },
    {
      title: "Action",
      width: "90px",
      align: "center",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure delete ${text?.asin}?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              deleteCategoryProduct(text.asin)
                .then((res) => {
                  if (res.status === 200) {
                    setTableLoading(true);
                    dispatch(getCategoryProductList(filter));
                  } else {
                    message.error(res?.data?.message || "Error");
                  }
                })
                .catch((err) => {
                  if (err?.response?.status !== 401) {
                    message.error(
                      err?.response?.message || "Something Went Wrong."
                    );
                  }
                });
            },
            onCancel() {},
          });
        };

        return (
          <>
            {text.child ? (
              <span>
                <Modal
                  closable
                  maskClosable
                  onCancel={() => setOpenEditSKU(null)}
                  destroyOnClose
                  footer={null}
                  title="Edit Category"
                  open={!!text.sku && openEditSKU === text.sku}
                >
                  <EditSKUAsin
                    id={text.sku}
                    initialValues={{
                      asin: text.asin,
                      sku: text.sku,
                    }}
                    handleOk={() => {
                      setOpenEditSKU(null);
                    }}
                  />
                </Modal>
                <FontAwesomeIcon
                  onClick={() => {
                    CategoryListRes?.status &&
                      !!text.sku &&
                      setOpenEditSKU(text.sku);
                  }}
                  icon={faPenToSquare}
                  style={{ marginRight: "10px" }}
                  className="text-dark fs-3 cursor-pointer w-15px"
                />
              </span>
            ) : (
              <span>
                <Modal
                  closable
                  maskClosable
                  onCancel={() => setOpenEdit(null)}
                  destroyOnClose
                  footer={null}
                  title="Edit Category"
                  open={!!text.asin && openEdit === text.asin}
                >
                  <EditCategoryProductData
                    id={text.asin}
                    onSubmit={() => {
                      setOpenEdit(null);
                    }}
                    initialValues={{
                      category_id: text.category_id,
                      product_status: text.product_status,
                      product_title: text.product_title,
                    }}
                  />
                </Modal>
                <FontAwesomeIcon
                  onClick={() => {
                    CategoryListRes?.status &&
                      !!text.asin &&
                      setOpenEdit(text.asin);
                  }}
                  icon={faPenToSquare}
                  style={{ marginRight: "10px" }}
                  className="text-dark fs-3 cursor-pointer w-15px"
                />
              </span>
            )}
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 cursor-pointer w-15px"
            />
          </>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          {TopBarFilter(filter, setFilter)}
          <div className="col-lg-12">
            <div className="card mb-7 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-between">
                  <h1>Category Product List</h1>
                  <div>
                    <CustomModal
                      title={"Upload Category Product Data"}
                      width={600}
                      opener={
                        <button className="btn btn-light-danger btn-sm mx-3 fw-bolder">
                          Import Data
                        </button>
                      }
                      footer={null}
                    >
                      {({ handleOk }) => (
                        <UploadCategoryProductData handleOk={handleOk} />
                      )}
                    </CustomModal>
                    <CustomModal
                      title={"Assigning ASIN to missing SKU"}
                      width={600}
                      opener={
                        <button className="btn btn-secondary btn-sm mx-3 fw-bolder">
                          Assign ASIN to SKU
                        </button>
                      }
                      footer={null}
                    >
                      {({ handleOk }) => <EditSKUAsin handleOk={handleOk} />}
                    </CustomModal>
                    <button
                      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={exportUncategorizedAsin}
                    >
                      Export Missing Category ASINs and SKUs
                    </button>

                    <Link href="/category-reports/manage-categories/create-category">
                      <button className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3">
                        + Create New Category
                      </button>
                    </Link>
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : list?.length != 0 ? (
                  <ASINTable
                    columns={columns}
                    dataSource={list}
                    ellipsis
                    rowKey="key"
                    onChange={handleChange}
                    loading={tableLoading}
                    pagination={false}
                    scroll={{
                      x:
                        columns
                          ?.map((d) => d.width)
                          .reduce((a, b) => a + b, 0) + 300,
                    }}
                  />
                ) : (
                  <NoData />
                )}
                <Pagination
                  loading={tableLoading || list?.length === 0}
                  pageSize={parseInt(filter.limit)}
                  page={parseInt(filter.page)}
                  totalPage={parseInt(CategoryProductListRes.count)}
                  onPerPage={onPerPage}
                  onPageNo={onPageNo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

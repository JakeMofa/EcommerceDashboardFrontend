import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import ASINTable from "@/src/components/table";
import Loading from "@/src/components/loading";
import NoData from "@/src/components/no-data";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import {
  DeleteCategory,
  getCategoryList,
} from "@/src/services/categoryList.services";
import { Button, Modal, Space, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import CreateCategoryScreen from "@/src/components/CreateCategory";
import { DeleteCategoryAPI } from "@/src/api/categoryList.api";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/src/components/pagination";
import { timeFormat, timeSince } from "@/src/helpers/formatting.helpers";
import { updateBrandRequest } from "@/src/api/brands.api";

const initialFilters = {
  page: "1",
  limit: "20",
  order: "desc",
  orderBy: "name",
};
const { confirm } = Modal;

export default function ManageCategory() {
  const [tableLoading, setTableLoading] = useState(true);

  const [openEdit, setOpenEdit] = useState(null);
  const [subCategoriesEnabled, setSubCategoriesEnabled] = useState(null);

  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const CategoryListRes = useSelector(selectCategoryList);
  const { pathname, query, replace } = useRouter();

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setSubCategoriesEnabled(brand?.subcategories_enabled);
  }, []);

  const filter = useMemo(() => {
    return _.isEmpty(query)
      ? initialFilters
      : {
          ...initialFilters,
          ...query,
        };
  }, [query]);

  useEffect(() => {
    let time = setTimeout(() => {
      message.loading({ content: "Loading...", key: "loading", duration: 0 });
      dispatch(getCategoryList(filter));
    }, 600);
    return () => {
      clearTimeout(time);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (CategoryListRes?.status === true) {
      setTableLoading(false);
      const isValidData = Array.isArray(CategoryListRes.data);
      isValidData && setList(CategoryListRes.data);
    } else if (CategoryListRes.status === false) {
      setTableLoading(false);
      setList([]);
    }
    message.destroy("loading");
  }, [CategoryListRes]);

  const handleChange = (_pagination, _filters, sorter) => {
    const order =
      (sorter.order?.startsWith("asc") && "asc") ||
      (sorter.order?.startsWith("desc") && "desc") ||
      undefined;

    const sortFilter = { order, orderBy: order ? sorter.columnKey : undefined };
    replace({ pathname: pathname, query: { ...filter, ...sortFilter } });
  };

  const onPageNo = (e) => {
    replace({ pathname: pathname, query: { page: e, limit: filter.limit } });
  };

  const onPerPage = (e) => {
    replace({ pathname: pathname, query: { page: "1", limit: e } });
  };

  const columns = [
    {
      title: "",
      width: "20px",
      fixed: "left",
      subcategoryOnly: true,
    },
    {
      title: "Name",
      width: "80px",
      align: "center",
      sorter: true,
      key: "name",
      render: (text) => {
        return <span>{text?.name}</span>;
      },
    },
    {
      title: "Created At",
      width: "120px",
      align: "center",
      sorter: true,
      key: "created_at",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.created_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.created_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Updated At",
      width: "130px",
      align: "center",
      sorter: true,
      key: "updated_at",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.updated_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.updated_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Subcategories",
      width: "70px",
      align: "center",
      key: "subcategories",
      subcategoryOnly: true,
      render: (text) => {
        return (
          <div>
            <span>{text.children?.length}</span>
          </div>
        );
      },
    },
    {
      title: "Action",
      width: "90px",
      align: "center",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure delete ${text.name} category?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              return DeleteCategoryAPI(text.id).then((res) => {
                dispatch(DeleteCategory(text.id, !!text.parent_id));
              });
            },
            onCancel() {},
          });
        };
        return (
          <div className="d-flex justify-content-center">
            {text.children && (
              <Link
                href={`/category-reports/manage-categories/create-category?parent_id=${text.id}`}
              >
                <FontAwesomeIcon
                  icon={faAdd}
                  style={{ marginRight: "10px" }}
                  className="text-dark fs-3 cursor-pointer w-15px"
                />
              </Link>
            )}
            <FontAwesomeIcon
              onClick={() => {
                setOpenEdit(text);
              }}
              icon={faPenToSquare}
              style={{ marginRight: "10px" }}
              className="text-dark fs-3 cursor-pointer w-15px"
            />
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 cursor-pointer w-15px"
            />
          </div>
        );
      },
    },
  ].filter((c) => !c.subcategoryOnly || subCategoriesEnabled);

  const showSubCategoriesChange = () => {
    confirm({
      title: `Are you sure you want to ${
        subCategoriesEnabled ? "Disable" : "Enable"
      } subcategories?`,
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const brand = JSON.parse(localStorage.getItem("brand"));

        return updateBrandRequest(brand.id, {
          subcategories_enabled: !subCategoriesEnabled,
        }).then((res) => {
          localStorage.setItem(
            "brand",
            JSON.stringify({
              ...brand,
              subcategories_enabled: res.data.subcategories_enabled,
            })
          );
          setSubCategoriesEnabled(res.data.subcategories_enabled);
        });
      },
      onCancel() {},
    });
  };

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="col-lg-12">
            <div className="card mb-7 pt-5">
              <div className="card-body pt-2">
                <div className="mb-5 d-flex flex-row justify-content-between">
                  <h1>Category List</h1>
                  <div>
                    {subCategoriesEnabled !== null && (
                      <Button
                        className="btn btn-warning btn-active-light-dark btn-sm fw-bolder me-10"
                        onClick={showSubCategoriesChange}
                      >
                        {subCategoriesEnabled ? "Disable" : "Enable"}{" "}
                        Subcategories
                      </Button>
                    )}
                    <Link href="/category-reports/manage-categories/create-category">
                      <button className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3">
                        + Create New
                      </button>
                    </Link>
                  </div>
                </div>
                {tableLoading ? (
                  <Loading />
                ) : list?.length != 0 ? (
                  <ASINTable
                    columns={columns}
                    dataSource={list.map((i) =>
                      subCategoriesEnabled
                        ? { ...i, children: i.subcategories }
                        : i
                    )}
                    ellipsis
                    onChange={handleChange}
                    rowKey="key"
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
                  <div>
                    <NoData />
                  </div>
                )}
                <Pagination
                  loading={tableLoading || list?.length === 0}
                  pageSize={parseInt(filter.limit)}
                  page={parseInt(filter.page)}
                  totalPage={parseInt(CategoryListRes.count)}
                  onPerPage={onPerPage}
                  onPageNo={onPageNo}
                />
              </div>
            </div>
          </div>
        </div>

        <Modal
          closable
          maskClosable
          onCancel={() => setOpenEdit(null)}
          destroyOnClose
          footer={null}
          title="Edit Category"
          open={openEdit}
        >
          <Space className="mt-6">
            <CreateCategoryScreen
              id={openEdit?.id}
              onSubmit={() => {
                setOpenEdit(null);
              }}
              type="edit"
              initialValues={openEdit}
            />
          </Space>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

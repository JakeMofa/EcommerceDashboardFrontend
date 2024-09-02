import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, message, Select, Modal } from "antd";
import { getBrandList } from "@/src/services/brands.services";
import {
  addUserToBrandRequest,
  removeUserFromBrandRequest,
} from "@/src/api/brands.api";
import _ from "lodash";
import { selectFilter } from "@/src/helpers/selectFilter";
import { selectBrandList, setBrandList } from "@/src/store/slice/brands.slice";
import { KeySvg } from "@/src/assets";
import ASINTable from "@/src/components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { fetchUserBrands } from "@/src/api/users.api";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 16,
    },
  },
};

const { confirm } = Modal;

export default function BrandSettings({ user, userRole }) {
  const dispatch = useDispatch();
  const [addBrandForm] = Form.useForm();
  const brandList = useSelector(selectBrandList);
  const [addBrandSubmit, setAddBrandSubmit] = useState(false);
  const [userBrands, setUserBrands] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    userRole === "Admin" &&
      dispatch(
        getBrandList({
          perPage: 9999,
          orderBy: "u_amazon_seller_name",
          order: "asc",
        })
      );
  }, []);

  useEffect(() => {
    fetchUserBrands(user.id)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          setUserBrands(res.data.brands);
        }
      })
      .catch((err) => message.error(err?.response?.message));
  }, []);

  useEffect(() => {
    if (brandList.data.length > 0 && userBrands.length > 0) {
      setBrands(
        userBrands
          .map((ub, index) => {
            const b = brandList.data.find((b) => b.id === ub.brandId);
            return {
              ...b,
              id: ub.brandId,
              role: ub.role,
              index: index + 1,
            };
          })
          .filter((b) => b.u_amazon_seller_name)
      );
    }
  }, [brandList.data, userBrands]);

  const options = brandList.data.map((brand) => {
    return { label: brand.u_amazon_seller_name, value: brand.id };
  });

  const addBrand = (values) => {
    setAddBrandSubmit(true);

    addUserToBrandRequest(values.brand_id, user.id, values.role)
      .then((res) => {
        setAddBrandSubmit(false);
        if (res.status === 200) {
          addBrandForm.resetFields();
          setBrands((brands) => [
            ...brands,
            {
              index: _.max(brands.map((u) => u.index)) + 1 || 1,
              id: values.brand_id,
              role: values.role,
              u_amazon_seller_name: options.find(
                (u) => u.value === values.brand_id
              ).label,
            },
          ]);
          message.success("Brand added successfully");
        } else {
          message.error("unable to add brand");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const deleteBrand = (brandID) => {
    if (userRole == "User") {
      message.warning("You are not allowed to perform this action!");
      return;
    }

    removeUserFromBrandRequest(brandID, user.id)
      .then((res) => {
        if (res.status === 200) {
          setBrands(brands.filter((u) => u.id !== brandID));
          message.success("Brand has been removed successfully");
        } else {
          message.error("Unable to remove brand");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const roleOptions = [
    { label: "User", value: "User" },
    { label: "Manager", value: "Manager" },
  ];

  const columns = [
    {
      title: "#",
      width: 30,
      align: "left",
      sorter: (a, b) => a.index - b.index,
      key: "id",
      render: (text) => {
        return <span>{text?.index}</span>;
      },
    },
    {
      title: "Brand",
      width: 120,
      key: "name",
      sorter: (a, b) =>
        a.u_amazon_seller_name.localeCompare(b.u_amazon_seller_name),
      align: "left",
      render: (text) => {
        return <b>{text?.u_amazon_seller_name || "N/A"}</b>;
      },
    },
    {
      title: "Role",
      width: 120,
      align: "left",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (text) => {
        return <span>{text?.role || "N/A"}</span>;
      },
    },
    {
      title: "Action",
      width: 70,
      align: "left",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure to remove ${text.u_amazon_seller_name} brand?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              deleteBrand(text.id);
            },
            onCancel() {},
          });
        };
        return (
          <div className="d-flex">
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 w-15px cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-7">
            <div className="card-body">
              <Form
                {...formItemLayout}
                layout="vertical"
                form={addBrandForm}
                name="userBrandSettings"
                disabled={userRole == "User"}
                onFinish={addBrand}
              >
                <div className="row">
                  <div className="col-12 d-flex flex-row mb-5">
                    <KeySvg />
                    <h4 className="mx-5 mt-1">Brands Access</h4>
                  </div>
                </div>

                {user.role === "Admin" && (
                  <div className="row my-3">
                    <h6 className="text-warning border border-warning rounded col-auto p-1 px-3">
                      This user is an Admin and already have access to all
                      brands.
                    </h6>
                  </div>
                )}

                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="brand_id"
                      label="Add New Brand"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Brand cannot be blank",
                        },
                      ]}
                      hasFeedback
                    >
                      <Select
                        style={{
                          width: "100%",
                        }}
                        size="large"
                        placeholder="Select Brand"
                        showSearch
                        options={options}
                        filterOption={selectFilter}
                        disabled={options.length === 0}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item
                      name="role"
                      label="Role"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Role cannot be blank",
                        },
                      ]}
                      hasFeedback
                    >
                      <Select
                        style={{
                          width: "100%",
                        }}
                        size="large"
                        placeholder="Select Role"
                        options={roleOptions}
                        filterOption={selectFilter}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item className="d-flex">
                      <Button
                        htmlType="submit"
                        disabled={addBrandSubmit}
                        className="btn btn-sm btn-primary"
                      >
                        {addBrandSubmit || options.length === 0 ? (
                          <span>
                            Please wait...
                            <span className="spinner-border spinner-border-sm align-middle ms-2" />
                          </span>
                        ) : (
                          <span className="indicator-label">Add Brand</span>
                        )}
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
              <div className="mt-6">
                <ASINTable
                  columns={columns}
                  dataSource={brands}
                  ellipsis
                  rowKey="key"
                  pagination={false}
                  scroll={{
                    x:
                      columns?.map((d) => d.width).reduce((a, b) => a + b, 0) +
                      300,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

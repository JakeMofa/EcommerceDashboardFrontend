import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Divider, Form, Input, message, Select, Space } from "antd";
import { createBrandRequest, updateBrandRequest } from "@/src/api/brands.api";
import _ from "lodash";
import { UserLgSvg } from "@/src/assets";
import { PlusOutlined } from "@ant-design/icons";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { useSelector } from "react-redux";

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

export default function GeneralMain({ brand, userRole }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [editForm] = Form.useForm();
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(false);
  const CategoryListRes = useSelector(selectCategoryList);

  const onFinish = (values) => {
    setSubmit(true);

    const data = {
      name: values.name,
      // category: values.category,
      u_amazon_seller_name: values.u_amazon_seller_name,
      u_amazon_marketplace_name: values.u_amazon_marketplace_name,
    };

    if (brand) {
      updateBrandRequest(brand.id, data)
        .then((res) => {
          setSubmit(false);
          if (res.status === 200) {
            message.success("Brand Updated Successfully");
          } else {
            message.error("Unable to update brand");
          }
        })
        .catch((err) => message.error(err?.response?.message));
    } else {
      createBrandRequest(data)
        .then((res) => {
          setSubmit(false);
          if (res.status === 201) {
            message.success("Brand Created Successfully");
            router.push(`/brands/edit?brandId=${res.data.id}&activeTab=users`);
          } else {
            message.error("Unable to create brand");
          }
        })
        .catch((err) => message.error(err?.response?.message));
    }
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    if (name) {
      e.preventDefault();
      editForm.setFieldValue("category", name);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-7">
            <div className="card-body">
              <Form
                {...formItemLayout}
                layout="vertical"
                form={editForm}
                name="brandGeneralSettings"
                onFinish={onFinish}
              >
                <div className="row">
                  <div className="col-12 d-flex flex-row mb-5">
                    <UserLgSvg />
                    <h4 className="mx-5 mt-1">General</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="name"
                      label="Name"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Name is required",
                        },
                      ]}
                      hasFeedback
                      initialValue={brand?.name ?? ""}
                    >
                      <Input size="large" autoFocus autoComplete="off" />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="u_amazon_seller_name"
                      label="Amazon Seller Name"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Amazon Seller Name is required",
                        },
                      ]}
                      hasFeedback
                      initialValue={brand?.u_amazon_seller_name ?? ""}
                    >
                      <Input size="large" autoFocus autoComplete="off" />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="u_amazon_marketplace_name"
                      label="Amazon Marketplace Name"
                      className="fw-bolder"
                      hasFeedback
                      initialValue={brand?.u_amazon_marketplace_name ?? ""}
                    >
                      <Select size="large" autoFocus autoComplete="off">
                        <Select.Option value="">
                          --- Select Marketplace Name
                        </Select.Option>
                        <Select.Option value="United States">
                          United States
                        </Select.Option>
                        <Select.Option value="Canada">Canada</Select.Option>
                        <Select.Option value="Mexico">Mexico</Select.Option>
                        <Select.Option value="Italy">Italy</Select.Option>
                        <Select.Option value="France">France</Select.Option>
                        <Select.Option value="Spain">Spain</Select.Option>
                        <Select.Option value="Australia">
                          Australia
                        </Select.Option>
                        <Select.Option value="Poland">Poland</Select.Option>
                        <Select.Option value="Netherlands">
                          Netherlands
                        </Select.Option>
                        <Select.Option value="Germany">Germany</Select.Option>
                        <Select.Option value="Sweden">Sweden</Select.Option>
                        <Select.Option value="United Kingdom">
                          United Kingdom
                        </Select.Option>
                        <Select.Option value="Japan">Japan</Select.Option>
                        <Select.Option value="India">India</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="category"
                      label="Brand Category"
                      className="fw-bolder d-none"
                      hasFeedback
                      initialValue={brand?.category ?? ""}
                    >
                      <Select
                        size="large"
                        placeholder="Edit Category"
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: "8px 0" }} />
                            <Space style={{ padding: "0 8px 4px" }}>
                              <Input
                                placeholder="Add New Category"
                                ref={inputRef}
                                value={name}
                                onChange={onNameChange}
                              />
                              <Button
                                disabled={name === ""}
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={addItem}
                              >
                                Add Category
                              </Button>
                            </Space>
                          </>
                        )}
                        options={CategoryListRes.data?.map((item) => ({
                          label: item.name,
                          value: item.name,
                        }))}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="d-flex">
                  <Form.Item className="d-flex">
                    <Button
                      htmlType="submit"
                      disabled={submit}
                      className="btn btn-sm btn-primary"
                    >
                      {submit ? (
                        <span>
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                      ) : (
                        <span className="indicator-label">Submit</span>
                      )}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

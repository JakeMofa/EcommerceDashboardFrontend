import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useRouter } from "next/router";
import { createPoTemplate } from "@/src/services/poTemplate.services";

export default function PoTemplate() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const onFinish = (values) => {
    setSubmit(true);
  };
  const handleInputChange = (fieldName, value) => {
    // Update the values state with the new field value
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // setSubmit(true); //on submit successfull response
      createPoTemplate(values);
      // setSubmit(false); //on submit successfull response
    });
    form.resetFields();
  };
  const columns = [
    {
      title: "#",
      width: 60,
    },
    {
      title: "Name",
      width: 120,
      placeholder: "Enter Name of PO Template",
      dataIndex: "name",
    },
    {
      title: "Ship From",
      width: 120,
      placeholder: "Write Shipping From",
      dataIndex: "shipFrom",
    },
    {
      title: "Ship To",
      width: 120,
      placeholder: "Write Shipping To",
      dataIndex: "shipTo",
    },
    {
      title: "Created At",
      width: 120,
    },
    {
      title: "Action",
      width: 120,
    },
  ];

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
                "\n/* .table th, .table td{\nborder:1px solid red\n} */\n",
            }}
          />
          <div className="row gx-5 gx-xl-5">
            {/* {TopBarFilter(filter, setFilter, "Week")} */}
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header border-bottom border-bottom-dashed">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-0">
                      Create PO Template
                    </span>
                  </h3>
                  <div className="card-toolbar">
                    <button
                      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
                      id="kt_drawer_example_basic_button"
                      onClick={() => router.push("../po-template")}
                    >
                      Back To PO Template
                    </button>
                  </div>
                </div>

                <div className="card-body pt-2">
                  <Form
                    form={form}
                    layout="vertical"
                    className="mt-4 px-3"
                    // onFinish={onFinish}
                    initialValues={values}
                  >
                    {columns.map(
                      (column) =>
                        column.title !== "#" &&
                        column.title !== "Action" &&
                        column.title !== "Created At" && (
                          <Form.Item
                            key={column.dataIndex}
                            label={column.title}
                            name={column.dataIndex}
                            style={{ marginBottom: "12px" }}
                          >
                            {column.title === "Name" ? (
                              <Input
                                placeholder={column.placeholder}
                                className="form-control-lg"
                                size="large"
                                onChange={(e) =>
                                  handleInputChange(
                                    column.dataIndex,
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <Input.TextArea
                                placeholder={column.placeholder}
                                style={{
                                  resize: "vertical",
                                  minHeight: "80px",
                                  maxHeight: "250px",
                                }}
                                onChange={(e) =>
                                  handleInputChange(
                                    column.dataIndex,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </Form.Item>
                        )
                    )}

                    <Form.Item className="d-flex justify-content-end align-items-center">
                      <Button
                        style={{ height: "45px" }}
                        type="primary"
                        htmlType="submit"
                        disabled={submit}
                        className="btn btn-lg btn-primary mt-3 d-flex align-items-center"
                      >
                        {submit ? (
                          <span>
                            Please wait...
                            <span className="spinner-border spinner-border-sm align-middle ms-2" />
                          </span>
                        ) : (
                          <span
                            className="indicator-label"
                            onClick={() => handleSubmit()}
                          >
                            Submit
                          </span>
                        )}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

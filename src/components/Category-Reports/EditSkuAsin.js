import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Spin,
  Empty,
  Divider,
  Space,
} from "antd";
import { useRef, useEffect, useState } from "react";
import { assignAsinToSku } from "@/src/api/asinAndSkuList.api";
import {
  selectSkuList,
  selectAsinList,
} from "@/src/store/slice/asinAndSkuList.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  getNoAsinSkuList,
  getAsinList,
} from "@/src/services/asinAndSkuList.services";
import { PlusOutlined } from "@ant-design/icons";

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

const EditSkuAsin = ({ handleOk, initialValues }) => {
  const dispatch = useDispatch();
  const asinInputRef = useRef(null);
  const skuInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const skuList = useSelector(selectSkuList);
  const [skuSearch, setSkuSearch] = useState("");

  const asinList = useSelector(selectAsinList);
  const [asinSearch, setAsinSearch] = useState("");
  const [asinLoading, setAsinLoading] = useState(true);

  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [skuLoading, setSkuLoading] = useState(true);

  const addCustomAsin = (e) => {
    if (asinSearch) {
      asinInputRef.current.blur();
      e.preventDefault();
      form.setFieldValue("asin", asinSearch);
      setTimeout(() => {
        skuInputRef.current?.focus();
      }, 0);
    }
  };

  const addCustomSku = (e) => {
    if (skuSearch) {
      skuInputRef.current.blur();
      e.preventDefault();
      form.setFieldValue("sku", skuSearch);
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    setAsinLoading(true);
    let time = setTimeout(() => {
      dispatch(getAsinList({ search: asinSearch }));
    }, 600);
    return () => {
      clearTimeout(time);
    };
  }, [asinSearch]);

  useEffect(() => {
    asinList.status !== null && setAsinLoading(false);
  }, [asinList]);

  useEffect(() => {
    setSkuLoading(true);
    let time = setTimeout(() => {
      dispatch(getNoAsinSkuList({ search: skuSearch }));
    }, 600);
    return () => {
      clearTimeout(time);
    };
  }, [skuSearch]);

  useEffect(() => {
    skuList.status !== null && setSkuLoading(false);
  }, [skuList]);

  const onFinish = (values) => {
    setSubmit(true);

    assignAsinToSku(
      initialValues
        ? values
        : { ...values, status: values.status ? "Active" : "inactive" }
    )
      .then((res) => {
        setSubmit(false);
        if (res.status >= 200 && res.status <= 299) {
          form.resetFields();
          message.success("ASIN has been assigned successfully.");
        } else {
          message.error("Unable to assign SKU");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => handleOk());
  };

  return (
    <>
      {" "}
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        name="import"
        onFinish={onFinish}
      >
        <div className="row">
          <div className="col-12 mt-7">
            <Form.Item
              name="asin"
              label="ASIN"
              placeholder="Select ASIN"
              initialValue={initialValues?.asin ?? ""}
              rules={[
                {
                  required: true,
                  message: "ASIN cannot be blank",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select ASIN"
                showSearch
                allowClear={true}
                ref={asinInputRef}
                notFoundContent={
                  asinLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
                onClear={() => setAsinSearch("")}
                onSearch={(input) => {
                  setAsinSearch(input);
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Button
                        disabled={asinSearch === "" || asinLoading}
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addCustomAsin}
                      >
                        Add Custom
                      </Button>
                    </Space>
                  </>
                )}
                options={asinList.list.map((a) => ({
                  label: a,
                  value: a,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="sku"
              label="SKU"
              placeholder="Select SKU"
              initialValue={initialValues?.sku ?? ""}
              rules={[
                {
                  required: true,
                  message: "SKU cannot be blank",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select SKU"
                showSearch
                allowClear={true}
                ref={skuInputRef}
                notFoundContent={
                  skuLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
                onClear={() => setSkuSearch("")}
                onSearch={(input) => {
                  setSkuSearch(input);
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Button
                        disabled={skuSearch === "" || skuLoading}
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addCustomSku}
                      >
                        Add Custom
                      </Button>
                    </Space>
                  </>
                )}
                options={skuList.list.map((a) => ({
                  label: a.sku,
                  value: a.sku,
                }))}
              />
            </Form.Item>
            {!initialValues && (
              <Form.Item name="productTitle" label="Product Title">
                <Input size="large" autoComplete="off" ref={titleInputRef} />
              </Form.Item>
            )}
            {!initialValues && (
              <Form.Item name="status" valuePropName="checked">
                <Checkbox>{"Active"}</Checkbox>
              </Form.Item>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 d-flex border-top">
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
    </>
  );
};

export default EditSkuAsin;

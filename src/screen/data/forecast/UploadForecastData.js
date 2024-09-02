import { Button, Form, Select, Upload, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ImportForecastList } from "@/src/api/categoryProductList.api";
import { defaultYear } from "@/src/config";
import { useDispatch, useSelector } from "react-redux";
import useMount from "@/src/hooks/useMount";
import { selectBrandList } from "@/src/store/slice/brands.slice";
import { getBrandList } from "@/src/services/brands.services";

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

const UploadForecastData = ({ handleOk }) => {
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [brand, setBrand] = useState(null);

  const dispatch = useDispatch();
  const isMount = useMount();

  const brandList = useSelector(selectBrandList);

  const userRole = isMount
    ? JSON.parse(localStorage.getItem("user") || "{}")?.role
    : "User";

  useEffect(() => {
    if (userRole === "Admin") {
      dispatch(
        getBrandList({
          page: 1,
          perPage: 999,
          status: "Created",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const onFinish = (values) => {
    if (brand) {
      setSubmit(true);
      const formData = new FormData();
      formData.append("file", values.file[0].originFileObj);

      ImportForecastList(formData, {
        brandId: brand,
        year: defaultYear(),
      })
        .then((res) => {
          setSubmit(false);
          if (res.status >= 200 && res.status <= 299) {
            message.success(res.data.message || "Imported");
          } else {
            message.error("Unable to Import");
          }
        })
        .catch((err) => message.error("Unable to Import"))
        .finally(() => handleOk());
    } else {
      message.error("Select your brand");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const brandOptions = useMemo(() => {
    return brandList.data.map((item) => ({ label: item.name, value: item.id }));
  }, [brandList.data]);

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
            <Select
              size="large"
              placeholder={"Select brand"}
              style={{ width: 250 }}
              value={brand}
              onChange={(e) => {
                setBrand(e);
              }}
              options={brandOptions}
            />
          </div>
          <div className="col-12 col-sm-4 col-md-4 col-lg-3 mt-7">
            <Form.Item
              name="file"
              label=""
              className="fw-bolder"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: "File is required",
                },
              ]}
              hasFeedback
            >
              <Upload
                name="file"
                accept=".xlsx"
                maxCount={1}
                customRequest={({ onSuccess }) =>
                  setTimeout(() => {
                    onSuccess("ok", null);
                  }, 0)
                }
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
        <p>Click here to download the sample for Upload</p>
        <Link href="/files/forecast_template.xlsx" download={true}>
          Download Sample
        </Link>
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

export default UploadForecastData;

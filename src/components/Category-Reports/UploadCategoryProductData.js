import { Button, Form, Upload, message, Progress } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ImportCategoryProductList } from "@/src/api/categoryProductList.api";
import { uploadFile } from "@/src/helpers/s3Upload.helpers";

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

const UploadCategoryProductData = ({ handleOk }) => {
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [fileKey, setFileKey] = useState("");

  const onFinish = () => {
    setSubmit(true);
    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");

    const data = {
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      file_name: fileKey,
      brand_id: localBrand.id,
    };

    ImportCategoryProductList(data)
      .then((res) => {
        setSubmit(false);
        if (res.status >= 200 && res.status <= 299) {
          form.resetFields();
          setProgress(0);
          setFileList([]);
          message.success(res.data.message);
          handleOk();
        } else {
          message.error("Unable to Import. Please try again.");
        }
      })
      .catch((_err) => {
        message.error("Unable to Import. Please try again.");
        setSubmit(false);
      });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setProgress(0);
    if (newFileList.length > 0 && newFileList[0].status === "done") {
      setProgress(1);
      const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");

      const key = `${
        localBrand.u_amazon_seller_name
      }_category_product_import_${new Date().getTime()}`;
      setFileKey(key);
      uploadFile(newFileList[0].originFileObj, key, setProgress);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };
  return (
    <>
      {" "}
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        name="import-category-product"
        onFinish={onFinish}
      >
        <div className="row">
          <div className="col-12 mt-7">
            <div className="row">
              <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                <Form.Item
                  name="file"
                  label="Browse"
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
                    fileList={fileList}
                    onChange={handleChange}
                    customRequest={({ onSuccess }) =>
                      setTimeout(() => {
                        onSuccess("ok", null);
                      }, 0)
                    }
                  >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
                {fileList.length > 0 && progress !== 0 && (
                  <Progress percent={progress} size="small" />
                )}
              </div>
            </div>
            <p> Click here to download the sample for Upload</p>
            <Link
              href="/files/category_product_data_template.xlsx"
              download={true}
            >
              Download Sample
            </Link>
            <div className="mt-8 pt-8 d-flex border-top">
              <Form.Item className="d-flex">
                <Button
                  htmlType="submit"
                  disabled={progress < 100 || submit}
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
          </div>
        </div>
      </Form>
    </>
  );
};

export default UploadCategoryProductData;

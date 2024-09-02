import { useState } from "react";
import { Button, Form, message, Upload, Progress } from "antd";
import { ImportAdsManualReport } from "@/src/api/advertisingImport.api";
import { UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import Link from "next/link";
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

export default function Import() {
  const [adForm] = Form.useForm();

  const [manualReportSubmit, setManualReportSubmit] = useState(false);

  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [fileKey, setFileKey] = useState("");

  const onManualReportFinish = (values) => {
    setManualReportSubmit(true);

    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");

    const data = {
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      file_name: fileKey,
      brand_id: localBrand.id,
    };

    ImportAdsManualReport(data)
      .then((res) => {
        setManualReportSubmit(false);
        if (res.status >= 200 && res.status <= 299) {
          adForm.resetFields();
          setProgress(0);
          setFileList([]);
          message.success(res.data.message);
        } else {
          message.error("Unable to Import");
        }
      })
      .catch((_err) => {
        message.error("Unable to Import");
        setManualReportSubmit(false);
      });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setProgress(0);
    if (newFileList.length > 0 && newFileList[0].status === "done") {
      const name = newFileList[0].name.split(".")[0];
      setProgress(1);
      const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");
      const key = `${name}_${
        localBrand.u_amazon_seller_name
      }_advertising_revenue_${new Date().getTime()}.csv`;
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
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7">
                <div className="card-body">
                  <div className="col-12 d-flex flex-row mb-5">
                    <h4 className="mx-5 mt-1">
                      IMPORT ADVERTISING REVENUE REPORT
                    </h4>
                  </div>
                  <Form
                    {...formItemLayout}
                    layout="vertical"
                    form={adForm}
                    name="manual-report-import"
                    onFinish={onManualReportFinish}
                  >
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
                            accept=".csv"
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleChange}
                            customRequest={({ onSuccess }) =>
                              setTimeout(() => {
                                onSuccess("ok", null);
                              }, 0)
                            }
                          >
                            <Button icon={<UploadOutlined />}>
                              Click to upload
                            </Button>
                          </Upload>
                        </Form.Item>
                        {fileList.length > 0 && progress !== 0 && (
                          <Progress percent={progress} size="small" />
                        )}
                      </div>
                    </div>
                    <p> Click here to download the sample for Upload</p>
                    <Link href="/files/ads_manual_report.csv" download={true}>
                      Download Sample
                    </Link>
                    <div className="mt-8 pt-8 d-flex border-top">
                      <Form.Item className="d-flex">
                        <Button
                          htmlType="submit"
                          disabled={progress < 100 || manualReportSubmit}
                          className="btn btn-sm btn-primary"
                        >
                          {manualReportSubmit ? (
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
      </div>
    </DashboardLayout>
  );
}

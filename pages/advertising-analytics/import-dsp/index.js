import { useState, useEffect } from "react";
import { Button, Form, message, Upload, Progress } from "antd";
import { ImportDspData } from "@/src/api/customerAcquisition.api";
import { UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import Link from "next/link";
import { uploadFile } from "@/src/helpers/s3Upload.helpers";
import * as XLSX from "xlsx";

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
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);

  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [fileKey, setFileKey] = useState("");
  const [showDSP, setShowDSP] = useState(false);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setShowDSP(brand.advertiser_id && brand.advertiser_id.length > 0);
  }, []);

  const onFinish = () => {
    setSubmit(true);
    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");

    const data = {
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      file_name: fileKey,
      brand_id: localBrand.id,
    };

    ImportDspData(data)
      .then((res) => {
        setSubmit(false);
        if (res.status >= 200 && res.status <= 299) {
          form.resetFields();
          setProgress(0);
          setFileList([]);
          message.success(res.data.message);
        } else {
          message.error("Unable to Import. Please try again.");
        }
      })
      .catch((_err) => {
        message.error("Unable to Import. Please try again.");
        setSubmit(false);
      });
  };

  const handleChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setProgress(0);
    if (newFileList.length > 0 && newFileList[0].status === "done") {
      if (newFileList[0].name.split(".").slice(-1)[0] == "xlsx") {
        readExcel(newFileList[0].originFileObj);
      } else {
        uploadFileToAWS(newFileList[0].originFileObj);
      }
    }
  };

  const uploadFileToAWS = (file) => {
    setProgress(1);
    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");
    const name = file.name.split(".")[0];

    const key = `${name}_${
      localBrand.u_amazon_seller_name
    }_dsp_${new Date().getTime()}.${file.name.split(".").slice(-1)[0]}`;
    setFileKey(key);
    uploadFile(file, key, setProgress);
  };

  const readExcel = async (file) => {
    const fileReader = await new FileReader();
    await fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e?.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      if (XLSX.utils.decode_range(ws["!ref"]).e.r < 20000) {
        uploadFileToAWS(file);
      } else {
        message.error(
          "Number of rows exceeded the max 20,000 limit. Please reduce the data or use CSV file."
        );
      }
    };
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
                    <h4 className="mx-5 mt-1">IMPORT FILE</h4>
                  </div>
                  {showDSP ? (
                    <Form
                      {...formItemLayout}
                      layout="vertical"
                      form={form}
                      name="import"
                      onFinish={onFinish}
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
                              accept=".csv, .xlsx"
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
                      <Link href="/files/dsp_data.xlsx" download={true}>
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
                    </Form>
                  ) : (
                    <span>
                      You have to enable the{" "}
                      <Link href="/brands/edit?brandId=&activeTab=dspSettings">
                        DSP settings
                      </Link>{" "}
                      to import the data.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

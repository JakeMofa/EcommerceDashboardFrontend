import { useState, useEffect } from "react";
import { Button, Form, message, Upload, Progress } from "antd";
import {
  ImportCustomerAcquisition,
  fetchShipmentReportActivationStatus,
  ShipmentReportActivationToggle,
} from "@/src/api/customerAcquisition.api";
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

  const [shipmentReportStatus, setShipmentReportStatus] = useState(false);
  const [shipmentReportLoading, setShipmentReportLoading] = useState(true);
  const [
    submitShipmentReportActivationToggle,
    setSubmitShipmentReportActivationToggle,
  ] = useState(false);

  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [fileKeys, setFileKeys] = useState([]);

  useEffect(() => {
    fetchShipmentReportActivationStatus()
      .then((res) => {
        setShipmentReportLoading(false);
        if (res.status >= 200 && res.status <= 299) {
          setShipmentReportStatus(res.data.is_shipment_reports_active);
        } else {
          message.error("Unable to check status");
        }
      })
      .catch((_err) => message.error("Unable to check status"));
  }, []);

  const toggleShipmentReportActivation = () => {
    setSubmitShipmentReportActivationToggle(true);
    ShipmentReportActivationToggle()
      .then((res) => {
        setSubmitShipmentReportActivationToggle(false);
        if (res.status >= 200 && res.status <= 299) {
          message.success(`Shipment Report`);
          setShipmentReportStatus(res.data.is_shipment_reports_activate);
        } else {
          message.error("Unable to Update");
        }
      })
      .catch((err) => message.error("Unable to Update"));
  };

  const onFinish = () => {
    setSubmit(true);
    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");

    let data = {
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      brand_id: localBrand.id,
    };

    Promise.all(
      fileKeys.map((key) =>
        ImportCustomerAcquisition({ ...data, file_name: key })
      )
    )
      .then((data) => {
        setSubmit(false);
        let success = 0;
        data.forEach((res) => {
          if (res.status >= 200 && res.status <= 299 && res.data.success) {
            success = success + 1;
          } else {
            message.error({
              content:
                res.data.message || "Unable to Import. Please try again.",
              duration: 4,
            });
          }
        });

        if (success > 0) {
          form.resetFields();
          setProgress(0);
          setFileList([]);
          message.success(`Started processing for ${success} file(s).`);
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
    setFileKeys([]);
    if (
      newFileList.length > 0 &&
      !newFileList.some((f) => f.status != "done")
    ) {
      newFileList.forEach((file) => {
        if (file.name.split(".").slice(-1)[0] == "xlsx") {
          readExcel(file.originFileObj);
        } else {
          uploadFileToAWS(file.originFileObj);
        }
      });
    }
  };

  const uploadFileToAWS = (file) => {
    setProgress(1);
    const localBrand = JSON.parse(localStorage.getItem("brand") || "{}");
    const name = file.name.split(".")[0];

    const key = `${name}_${
      localBrand.u_amazon_seller_name
    }_shipment_report_${new Date().getTime()}.${
      file.name.split(".").slice(-1)[0]
    }`;
    setFileKeys((fileKeys) => [...fileKeys, key]);
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
        message.error({
          content: `Number of rows exceeded the max 20,000 limit in ${file.name} file. Please reduce the data or use CSV file.`,
          duration: 4,
        });
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
                            multiple={true}
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
                    <Link href="/files/shipment_data.xlsx" download={true}>
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
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7">
                <div className="card-body">
                  <div className="col-12 d-flex flex-row mb-5">
                    <h4 className="mx-5 mt-1">SHIPMENT REPORT ACTIVATION</h4>
                  </div>
                  {!shipmentReportLoading && (
                    <div className="row">
                      <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                        <h6 className="mx-5 mt-4">
                          Status:{" "}
                          <p
                            className={`d-inline ${
                              shipmentReportStatus
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {shipmentReportStatus ? "Active" : "Inactive"}
                          </p>
                        </h6>
                        <div className="mx-5 mt-5">
                          <Button
                            type="primary"
                            danger={shipmentReportStatus}
                            loading={submitShipmentReportActivationToggle}
                            onClick={() => toggleShipmentReportActivation()}
                          >
                            {shipmentReportStatus ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    </div>
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

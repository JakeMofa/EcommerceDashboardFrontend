import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { KeySvg } from "@/src/assets";
import { updateBrandRequest } from "@/src/api/brands.api";

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

export default function DSP({ brand }) {
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState(brand);

  const onFinish = (values) => {
    setSubmit(true);

    const d = {
      advertiser_id: values.advertiser_id,
    };

    updateBrandRequest(brand.id, d)
      .then((res) => {
        setSubmit(false);
        if (res.status === 200) {
          setData(res.data);
          message.success("Brand Updated Successfully");
        } else {
          message.error("Unable to update brand");
        }
      })
      .catch((err) => message.error(err?.response?.message));
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
                form={form}
                name="brandDspSettings"
                onFinish={onFinish}
              >
                <div className="row">
                  <div className="col-12 d-flex flex-row mb-5">
                    <KeySvg />
                    <h4 className="mx-5 mt-1">DSP Settings</h4>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item
                      name="advertiser_id"
                      label={
                        <div>
                          <h4>Advertiser ID</h4>{" "}
                          <div className="text-inverse-secondary">
                            {!!data.advertiserName && data.advertiserName}
                          </div>
                          <div className="text-inverse-secondary">
                            {!!data.advertiser_id && data.advertiser_id}
                          </div>
                        </div>
                      }
                      className="fw-bolder"
                      hasFeedback
                    >
                      <Input size="large" autoFocus autoComplete="off" />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item className="float-start">
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
                          <span className="indicator-label">Update</span>
                        )}
                      </Button>
                    </Form.Item>
                    {!!(
                      data.advertiser_id && data.advertiser_id.length > 0
                    ) && (
                      <Button
                        className="float-end btn btn-sm btn-secondary"
                        disabled={submit}
                        onClick={() => {
                          form.resetFields();
                          onFinish({ advertiser_id: "" });
                        }}
                      >
                        Disable
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

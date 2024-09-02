import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import _ from "lodash";
import { LockSvg } from "@/src/assets";
import { updateUserRequest } from "@/src/api/users.api";

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

export default function ChangePassword({ user, userRole }) {
  const [chngPasswForm] = Form.useForm();
  const [submit, setSubmit] = useState(false);

  const onFinish = (values) => {
    setSubmit(true);
    updateUserRequest(user.id, { u_password: values.u_password })
      .then((res) => {
        setSubmit(false);
        if (res.status === 200) {
          message.success("Password Updated Successfully");
        } else {
          message.error("Unable to update password");
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
                form={chngPasswForm}
                name="change_password"
                onFinish={onFinish}
              >
                <div className="row">
                  <div className="col-12 d-flex flex-row mb-5">
                    <LockSvg />
                    <h4 className="mx-5 mt-1">Change Password</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item
                      name="u_password"
                      label="New Password"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "New password is required",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password size="large" autoFocus autoComplete="off" />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                    <Form.Item
                      name="confirm_password"
                      label="Confirm New Password"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Confirm new password is required",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("u_password") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "The two passwords that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                      hasFeedback
                    >
                      <Input.Password size="large" autoComplete="off" />
                    </Form.Item>
                  </div>
                </div>

                <div className="d-flex">
                  <Form.Item className="d-flex">
                    <Button
                      htmlType="submit"
                      disabled={submit}
                      className="btn btn-light-danger btn-sm btn-primary"
                    >
                      {submit ? (
                        <span>
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2" />
                        </span>
                      ) : (
                        "Change"
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

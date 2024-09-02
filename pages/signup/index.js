import Link from "next/link";
import CommonLeftSide from "@/src/components/common-left-side";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { signUpRequest } from "@/src/api/auth.api";
import { Button, Form, Input, message } from "antd";
import { isClient } from "@/src/helpers/isClient";
import jwt_decode from "jwt-decode";
import { setCookie } from "cookies-next";
import { cookies } from "@/src/constants/cookies";

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

export default function Signup() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [checked, setChecked] = useState(false);

  const onFinish = (values) => {
    setSubmit(true);

    signUpRequest(values)
      .then((res) => {
        setSubmit(false);
        if (res.status >= 200 && res.status <= 299 && isClient) {
          res.data.role === "User" && router.push("/dashboard");
          localStorage.setItem("user", JSON.stringify(res.data));
          var decoded = jwt_decode(res.data.access_token);
          setCookie(cookies["TOKEN"], res.data.access_token, {
            maxAge: decoded.exp,
          });
        } else {
          message.error(res.data.message ?? "Something went wrong");
        }
      })
      .catch((err) => message.error(err));
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="row" style={{ height: "100%" }}>
        <CommonLeftSide />

        <div
          style={{ background: "#fff", minHeight: "800px" }}
          className="d-flex flex-column col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
        >
          <div className="d-flex flex-column flex-lg-row-fluid py-10">
            <div className="d-flex flex-center flex-column flex-column-fluid">
              <div className="w-lg-500px mx-auto">
                <div className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
                  <div className="mb-10 text-center">
                    <h1
                      className="text-dark fw-bold mb-3"
                      style={{ color: "#494951" }}
                    >
                      Create an <b className="fw-boldest">Account</b>
                    </h1>
                    <div className="text-gray-400 fw-bold fs-4">
                      Already have an account?&nbsp;
                      <Link href="/login" className="link-primary fw-bolder">
                        Sign in here
                      </Link>
                    </div>
                  </div>
                  <Form
                    {...formItemLayout}
                    layout="vertical"
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    className="signup-form"
                  >
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                        {" "}
                        <Form.Item
                          name="u_name"
                          label="Username"
                          rules={[
                            {
                              required: true,
                              message: "Username is required",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input size="large" autoFocus autoComplete="off" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                        {" "}
                        <Form.Item
                          name="u_email"
                          label="E-mail"
                          rules={[
                            {
                              type: "email",
                              message: "The input is not valid E-mail!",
                            },
                            {
                              required: true,
                              message: "E-mail is required",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input size="large" autoComplete="off" />
                        </Form.Item>
                      </div>
                    </div>
                    <Form.Item
                      name="u_password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Password is required",
                        },
                        {
                          min: 8,
                          message: "Password must be 8 characters long",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password size="large" autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                      name="confirm_password"
                      label="Confirm Password"
                      dependencies={["u_password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Confirm password is required",
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
                    >
                      <Input.Password autoComplete="off" size="large" />
                    </Form.Item>
                    <div className="fv-row mb-10 fv-plugins-icon-container fv-plugins-bootstrap5-row-valid">
                      <label className="form-check form-check-custom form-check-solid form-check-inline">
                        <input
                          className="form-check-input mx-4"
                          type="checkbox"
                          value={checked}
                          onChange={() => setChecked(!checked)}
                        />
                        <span
                          style={{ width: "410px" }}
                          className="form-check-label fw-bold text-gray-700 fs-6"
                        >
                          I Agree to the Asinwiser
                          <span className="ms-1">Terms and conditions</span> to
                          use the services provided by the application.
                        </span>
                      </label>
                      <div className="fv-plugins-message-container invalid-feedback" />
                    </div>
                    <Form.Item className="d-flex justify-content-center">
                      <Button
                        style={{ height: "45px" }}
                        type="primary"
                        htmlType="submit"
                        disabled={submit || !checked}
                        className="btn btn-lg btn-light-danger btn-primary"
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
                  </Form>
                  <div />
                </div>
              </div>
            </div>
            <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
              <div className="d-flex flex-center fw-bold fs-6">
                <p className="text-muted text-hover-primary px-2">
                  <Link href="/support">Support</Link>
                </p>
                {/* <p className="text-muted text-hover-primary px-2">Purchase</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

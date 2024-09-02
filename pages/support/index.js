import CommonLeftSide from "@/src/components/common-left-side";
import { useRef, useState } from "react";
import { Input, message, Form } from "antd";
import { useRouter } from "next/router";
import { sendEmail } from "@/src/api/email.api";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import Link from "next/link";

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

export default function ContactSupport() {
  const router = useRouter();
  const recaptcha = useRef();
  const [editForm] = Form.useForm();
  const [sending, setSending] = useState(false);

  const onFormSubmit = (values) => {
    const captchaValue = recaptcha.current.getValue();

    if (captchaValue) {
      setSending(true);
      sendEmail(values)
        .then((res) => {
          setSending(false);
          if (res.status == 200 && res.data.success) {
            message.success(
              "We have received your message and will get back in touch with you soon!",
              4
            );
            router.back();
          } else {
            message.error("Something went wrong!");
          }
        })
        .catch((error) => console.log(error));
    } else {
      message.warning("Please verify the reCAPTCHA!");
    }
  };

  return (
    <div style={{ height: "100vh", background: "#000" }}>
      <div
        className="d-flex flex-column flex-root h-100vh"
        style={{ height: "100%" }}
      >
        <Link className="mx-auto py-4" href={"/"}>
          <Image
            alt="Logo"
            src="/images/VendoVelocity_Horiz_White_Org.png"
            width={400}
            height={70}
            className="shimmer"
            priority
          />
        </Link>
        <div
          className="row"
          style={{ height: "100%", marginRight: 0, marginLeft: 0 }}
        >
          {/* <CommonLeftSide /> */}

          <div
            style={{ background: "#fff", minHeight: "800px" }}
            className="d-flex flex-column col-12"
          >
            <div className="d-flex flex-column flex-lg-row-fluid py-10">
              <div className="d-flex flex-center flex-column flex-column-fluid">
                <div className="w-lg-500px p-10 p-lg-10 mx-auto">
                  <div className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
                    <div className="mb-10 text-center">
                      <Form
                        className="form w-100"
                        {...formItemLayout}
                        layout="vertical"
                        form={editForm}
                        name="support"
                        onFinish={onFormSubmit}
                      >
                        <div className="mb-10">
                          <h1 className="text-dark fw-bold mb-3">
                            Contact Support
                          </h1>
                        </div>
                        <div className="fv-row mb-10 text-start">
                          <Form.Item
                            name="brand"
                            label="Brand Name"
                            rules={[
                              {
                                required: true,
                                message: "Brand Name is required",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input size="large" autoFocus autoComplete="off" />
                          </Form.Item>

                          <Form.Item
                            name="email"
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

                          <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                              {
                                required: true,
                                message: "Title is required",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input size="large" autoFocus autoComplete="off" />
                          </Form.Item>
                          <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Description is required",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input.TextArea rows={4} autoFocus />
                          </Form.Item>
                        </div>
                        <div>
                          <ReCAPTCHA
                            ref={recaptcha}
                            sitekey={
                              process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY
                            }
                          />
                        </div>

                        <div className="text-center pt-6">
                          <button
                            type="submit"
                            disabled={sending}
                            className="btn btn-lg btn-primary btn-light-danger w-100 mb-5"
                          >
                            {sending ? (
                              <span>
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2" />
                              </span>
                            ) : (
                              <span className="indicator-label">Submit</span>
                            )}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
                <div className="d-flex flex-center fw-bold fs-6">
                  {/* <p className="text-muted text-hover-primary px-2">Support</p> */}
                  {/* <p className="text-muted text-hover-primary px-2">Purchase</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

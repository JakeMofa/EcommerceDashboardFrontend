import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, message, Select } from "antd";
import {
  createUserRequest,
  updateBrandAM,
  updateUserRequest,
} from "@/src/api/users.api";
import _ from "lodash";
import { UserLgSvg } from "@/src/assets";
import { selectFilter } from "@/src/helpers/selectFilter";
import { useDispatch, useSelector } from "react-redux";
import useMount from "@/src/hooks/useMount";
import { selectUserList } from "@/src/store/slice/users.slice";
import { getUserList } from "@/src/services/users.services";

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

export default function SelectAM({ brand, userRole }) {
  const [editForm] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();
  const isMount = useMount();
  const userList = useSelector(selectUserList);

  const onFinish = async (values) => {
    setSubmit(true);
    try {
      await updateBrandAM({
        accountManagerId: values.am,
        brandId: brand.id,
      });
      message.success("Brand AM Updated Successfully");
    } catch (error) {
      message.error("Unable to update brand AM");
    } finally {
      setSubmit(false);
    }
  };

  const role = isMount
    ? JSON.parse(localStorage.getItem("user") || "{}")?.role
    : "User";

  useEffect(() => {
    if (role === "Admin") {
      dispatch(getUserList({ perPage: 999 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const amOptions = userList.items.map((item) => ({
    value: item.id,
    label: item.u_name,
  }));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-7">
            <div className="card-body">
              <Form
                {...formItemLayout}
                initialValues={{
                  am: brand?.account_manager_id || "",
                }}
                layout="vertical"
                form={editForm}
                name="userGeneralSettings"
                onFinish={onFinish}
              >
                <div className="row">
                  <div className="col-12 d-flex flex-row mb-5">
                    <UserLgSvg />
                    <h4 className="mx-5 mt-1">Account Manager</h4>
                  </div>
                </div>
                <div className="d-flex flex-row">
                  <div style={{ width: "100%" }}>
                    <div className="row">
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                        <Form.Item
                          name="am"
                          label="Select User"
                          className="fw-bolder"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Role cannot be blank",
                          //   },
                          // ]}
                        >
                          <Select
                            style={{
                              width: "100%",
                            }}
                            size="large"
                            disabled={amOptions.length === 0}
                            placeholder="AM"
                            options={amOptions}
                            showSearch
                            filterOption={selectFilter}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="d-flex">
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

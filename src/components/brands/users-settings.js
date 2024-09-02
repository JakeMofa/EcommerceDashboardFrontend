import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, message, Select, Modal } from "antd";
import { getUserList } from "@/src/services/users.services";
import {
  addUserToBrandRequest,
  removeUserFromBrandRequest,
} from "@/src/api/brands.api";
import _ from "lodash";
import { selectFilter } from "@/src/helpers/selectFilter";
import { selectUserList } from "@/src/store/slice/users.slice";
import { UsersGroupAddSvg } from "@/src/assets";
import ASINTable from "@/src/components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ExclamationCircleFilled } from "@ant-design/icons";

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
const { confirm } = Modal;

export default function UserSettings({ brand, userRole }) {
  const dispatch = useDispatch();
  const [addUserForm] = Form.useForm();
  const userList = useSelector(selectUserList);

  const [addUserSubmit, setAddUserSubmit] = useState(false);

  const [users, setUsers] = useState(
    (brand?.users || []).map((u, index) => {
      return {
        user_id: u.user.id,
        index: index + 1,
        role: u.role,
        name: u.user.u_name,
      };
    })
  );

  useEffect(() => {
    userRole === "Admin" && dispatch(getUserList({ perPage: 9999 }));
  }, []);

  const options = userList.items
    .map((user) => {
      return { label: user.u_name, value: user.id };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const addUser = (values) => {
    setAddUserSubmit(true);

    addUserToBrandRequest(brand.id, values.user_id, values.role)
      .then((res) => {
        setAddUserSubmit(false);
        if (res.status === 200) {
          addUserForm.resetFields();
          setUsers((users) => [
            ...users,
            {
              user_id: values.user_id,
              index: _.max(users.map((u) => u.index)) + 1 || 1,
              role: values.role,
              name: options.find((u) => u.value === values.user_id).label,
            },
          ]);
          message.success("User Added to the Brand Successfully");
        } else {
          message.error("unable to create user");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const deleteUser = (userID) => {
    if (userRole == "User") {
      message.warning("You are not allowed to perform this action!");
      return;
    }

    removeUserFromBrandRequest(brand.id, userID)
      .then((res) => {
        if (res.status === 200) {
          setUsers(users.filter((u) => u.user_id !== userID));
          message.success("User has been Removed from Brand Successfully");
        } else {
          message.error("Unable to remove user");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const roleOptions = [
    { label: "User", value: "User" },
    { label: "Manager", value: "Manager" },
  ];

  const columns = [
    {
      title: "#",
      width: 30,
      align: "left",
      sorter: (a, b) => a.index - b.index,
      key: "id",
      render: (text) => {
        return <span>{text?.index}</span>;
      },
    },
    {
      title: "User Name",
      width: 120,
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: "left",
      render: (text) => {
        return <b>{text?.name || "N/A"}</b>;
      },
    },
    {
      title: "Role",
      width: 120,
      align: "left",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (text) => {
        return <span>{text?.role || "N/A"}</span>;
      },
    },
    {
      title: "Action",
      width: 70,
      align: "left",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure to remove ${text.name} user?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              deleteUser(text.user_id);
            },
            onCancel() {},
          });
        };
        return (
          <div className="d-flex">
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 cursor-pointer w-15px"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-7">
            <div className="card-body">
              <div className="row">
                <div className="col-12 d-flex flex-row mb-5">
                  <UsersGroupAddSvg />
                  <h4 className="mx-5 mt-1">Users Access</h4>
                </div>
              </div>

              {userRole === "Admin" && (
                <Form
                  {...formItemLayout}
                  layout="vertical"
                  form={addUserForm}
                  name="brandUserSettings"
                  disabled={userRole == "User"}
                  onFinish={addUser}
                >
                  <div className="row">
                    <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                      <Form.Item
                        name="user_id"
                        label="Add New User"
                        className="fw-bolder"
                        rules={[
                          {
                            required: true,
                            message: "User cannot be blank",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          style={{
                            width: "100%",
                          }}
                          size="large"
                          placeholder="Select User"
                          options={options}
                          showSearch
                          filterOption={selectFilter}
                          disabled={options.length === 0}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                      <Form.Item
                        name="role"
                        label="Role"
                        className="fw-bolder"
                        rules={[
                          {
                            required: true,
                            message: "Role cannot be blank",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          style={{
                            width: "100%",
                          }}
                          size="large"
                          placeholder="Select Role"
                          options={roleOptions}
                          filterOption={selectFilter}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                      <Form.Item className="d-flex">
                        <Button
                          htmlType="submit"
                          disabled={addUserSubmit}
                          className="btn btn-sm btn-primary"
                        >
                          {addUserSubmit || options.length === 0 ? (
                            <span>
                              Please wait...
                              <span className="spinner-border spinner-border-sm align-middle ms-2" />
                            </span>
                          ) : (
                            <span className="indicator-label">Add User</span>
                          )}
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              <div className="mt-6">
                <ASINTable
                  columns={columns.filter(
                    (c) => userRole === "Admin" || c.title !== "Action"
                  )}
                  dataSource={users}
                  ellipsis
                  rowKey="key"
                  pagination={false}
                  scroll={{
                    x:
                      columns?.map((d) => d.width).reduce((a, b) => a + b, 0) +
                      300,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

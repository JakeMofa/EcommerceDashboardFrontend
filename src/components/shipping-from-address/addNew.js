import React, { useState } from "react";
import { Modal, Form, Input } from "antd";

const AddNew = ({ columns, modalValue }) => {
  const [values, setValues] = useState({});
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(modalValue);
  const handleCancel = () => {
    form.resetFields();
    setModalOpen(!modalOpen);
    setValues({});
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log(values);
    });
    form.resetFields();
  };
  return (
    <Modal
      open={modalOpen}
      title="Add New Shipping From Address"
      okText="Save"
      cancelText="Cancel"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-3"
        initialValues={values}
        onValuesChange={(changedValues) =>
          handleChange(
            Object.keys(changedValues)[0],
            changedValues[Object.keys(changedValues)[0]]
          )
        }
      >
        {columns.map(
          (column) =>
            column.title !== "#" &&
            column.title !== "Action" && (
              <Form.Item
                key={column.dataIndex}
                label={column.title}
                name={column.dataIndex}
                style={{ marginBottom: "12px" }}
              >
                <Input />
              </Form.Item>
            )
        )}
      </Form>
    </Modal>
  );
};

export default AddNew;

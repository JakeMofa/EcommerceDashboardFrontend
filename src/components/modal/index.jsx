import React, { useState } from "react";
import { Drawer, Modal } from "antd";

const CustomModal = (props) => {
  const { children, opener, ...rest } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {React.cloneElement(opener, { onClick: showModal })}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        {...rest}
      >
        {children({ handleOk, handleCancel })}
      </Modal>
    </>
  );
};

const CustomDrawer = (props) => {
  const { children, onClose, opener, ...rest } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      {React.cloneElement(opener, { onClick: handleOpen })}
      <Drawer
        title="Empty"
        placement="top"
        onClose={handleClose}
        open={open}
        height={"100vh"}
        {...rest}
      >
        {children({ handleClose })}
      </Drawer>
    </>
  );
};

export { CustomDrawer };
export default CustomModal;

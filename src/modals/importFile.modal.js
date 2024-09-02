import React from 'react';
import { Button, Input, Modal } from 'antd';

const ImportFile = ({ modalOpen, setModalOpen }) => {
  const handleCancel = () => {
    setModalOpen(!modalOpen);
  };

  const handleImport = () => {};
  return (
    <Modal
      open={modalOpen}
      title='Import File'
      okText='Save'
      cancelText='Cancel'
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleImport}>
          Import
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      <Input type='file' placeholder='Select' />
    </Modal>
  );
};

export default ImportFile;

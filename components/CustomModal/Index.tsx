import React, { useState } from 'react';
import { Modal } from 'antd';

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

const CustomModal: React.FC<Props> = ({ children, isModalVisible, setIsModalVisible }) => {

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      width={408}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="custom-modal"
      footer={null}
      closable={false}>
      {children}
    </Modal>
  )
}

export default CustomModal
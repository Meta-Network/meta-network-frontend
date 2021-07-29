import React, { useState } from 'react';
import { Modal } from 'antd';

const CustomModal: React.FC<{}> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

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
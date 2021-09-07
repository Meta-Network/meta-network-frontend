import React, { useState } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import { isBrowser, isMobile } from "react-device-detect"
import { CloseModalIcon } from '../Icon/Index'

interface Props {
  mode?: 'full' | 'half-code' | 'half-occupied' | '',
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

const CustomModal: React.FC<Props> = ({ children, mode, isModalVisible, setIsModalVisible }) => {

  const handleOk = (): void => {
    setIsModalVisible(false)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  return (
    <Modal
      width={408}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className={ `custom-modal${mode ? ' ' + mode : ''}` }
      footer={null}
      closable={false}
      centered={true}
      transitionName={ isBrowser ? undefined : isMobile ? '' : undefined}
    >
      {children}
      {
        mode === 'full' || mode === 'half-code' || mode === 'half-occupied'
        ? <StyledClose onClick={() => handleCancel()}></StyledClose>
        : null
      }
    </Modal>
  )
}

const StyledClose = styled(CloseModalIcon)`
  position: absolute;
  right: 24px;
  top: 24px;
  color: #f5f5f5;
  opacity: 0.4;
`

export default CustomModal
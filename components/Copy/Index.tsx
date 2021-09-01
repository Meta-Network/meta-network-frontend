import React from 'react';
import styled from 'styled-components'
import {
  CopyOutlined
} from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { CircleSuccessIcon } from '../Icon/Index'
import useToast from '../../hooks/useToast'
interface Props {
  text: string
}

const Copy: React.FC<Props> = ({ text }) => {
  const { Toast } = useToast()

  const handleCopy = () => {
    Toast({ content: '复制成功' })
  }

  return (
    <CopyText>
      <p>{text}</p>
      <CopyToClipboard text={text}
        onCopy={() => handleCopy()}>
        <CopyOutlined className="g-green" />
      </CopyToClipboard>
    </CopyText>
  )
}
const CopyText = styled.section`
  background: #2C2B2A;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  p {
    padding: 0 40px 0 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #F5F5F5;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

export default Copy
import React from 'react';
import styled from 'styled-components'
import {
  CopyOutlined
} from '@ant-design/icons'

interface Props {
  text: string
}

const Copy: React.FC<Props> = ({ text }) => {
  return (
    <CopyText>
      <p>{ text }</p>
      <CopyOutlined className="g-green" />
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
    padding: 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #F5F5F5;
  }
`

export default Copy
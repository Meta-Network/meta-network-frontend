import React from 'react'
import { Empty } from 'antd'
import styled from 'styled-components'

interface Props {
  description: string
}

const  CustomEmpty: React.FC<Props> = ({ description }) => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
      <StyledText>
        { description }
      </StyledText>
    } />
  )
}

const StyledText = styled.section`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  text-align: center;
  padding: 20px 0;
`

export default CustomEmpty
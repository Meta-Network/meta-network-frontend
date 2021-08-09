import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import {
  LeftOutlined
} from '@ant-design/icons'
import { Button } from 'antd'
import CustomModal from '../CustomModal/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  handleOccupied: () => Promise<void>
}

const Occupied: React.FC<Props> = ({ isModalVisible, setIsModalVisible, handleOccupied }) => {
  // loading button
  const [loading, setLoading] = useState<boolean>(false)

  // 确认占领
  const HandleOccupied = async () => {
    setLoading(true)
    await handleOccupied()
    setLoading(false)
  }

  // reset
  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false  )
    }
  }, [isModalVisible])

  const Content: React.FC = () => {
    return (
      <div>
        <div style={{ marginBottom: 123 }}>
          <StyledContentText>确定在这个地块建立个人站点吗？</StyledContentText>
        </div>
        <StyledContentFooter>
          <Button className="custom-primary" loading={loading} onClick={() => HandleOccupied()}>确认</Button>
          <Button className="custom-default" onClick={() => setIsModalVisible(false)}>取消</Button>
        </StyledContentFooter>
      </div>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>占领坐标</StyledContentHeadTitle>
        </StyledContentHead>
        <Content></Content>
      </StyledContent>
    </CustomModal>
  )
}

const StyledContent = styled.section`
  color: #fff;
`

const StyledContentHead = styled.section`
  position: relative;
  text-align: center;
  margin-bottom: 32px;
`
const StyledContentHeadTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #C4C4C4;
`

const StyledContentFooter = styled.section`
  padding: 32px 0 0 0;
  display: flex;
  justify-content: space-between;
`

const StyledContentText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #F5F5F5;
  padding: 0;
  margin: 0;
`


export default Occupied
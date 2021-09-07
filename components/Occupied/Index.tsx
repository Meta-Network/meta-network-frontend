import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  LeftOutlined
} from '@ant-design/icons'
import { Button } from 'antd'
import { isBrowser, isMobile } from "react-device-detect"

import CustomModal from '../CustomModal/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  handleOccupied: () => Promise<void>
}

const Occupied: React.FC<Props> = React.memo(function Occupied ({ isModalVisible, setIsModalVisible, handleOccupied }) {
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
        <StyledContentTitle>什么是 Meta Space？</StyledContentTitle>
        <StyledContentText>1. Meta Space 是专属你的个人数字空间，你有全部控制权。</StyledContentText>
        <StyledContentText>2. 你创建的 Meta Space 会在 Meta Network 的六边形网络中占据一格地块。</StyledContentText>
        <StyledContentTitle>一个ID只能占有一格地块，且暂不支持迁移。 </StyledContentTitle>
        <StyledContentText>请占领喜欢的位置开始创建吧！</StyledContentText>

        <StyledContentTextTips>确定在这个地块建立个人站点吗？</StyledContentTextTips>

        <StyledContentFooter>
          <Button className="custom-primary" loading={loading} onClick={() => HandleOccupied()}>确认</Button>
          <Button className="custom-default" onClick={() => setIsModalVisible(false)}>再看看</Button>
        </StyledContentFooter>
      </div>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={ isMobile ? 'half-occupied' : '' }>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>创建 META SPACE</StyledContentHeadTitle>
        </StyledContentHead>
        <Content></Content>
      </StyledContent>
    </CustomModal>
  )
})

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
  @media screen and (max-width: 768px) {
    display: block;
    .custom-primary {
      width: 100%;
    }
    .custom-default {
      width: 100%;
      margin-top: 16px;
    }
  }
`
const StyledContentTitle = styled.p`
  font-family:  ${ props => props.theme.fontFamilyZH };
  font-style: normal;
  font-weight:700;
  font-size: 12px;
  line-height: 18px;
  color: ${ props => props.theme.colorGreen };
  padding: 0;
  margin: 0;
`
const StyledContentText = styled.p`
  font-family:  ${ props => props.theme.fontFamilyZH };
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  padding: 0;
  margin: 0;
`
const StyledContentTextTips = styled.p`
  font-family:  ${ props => props.theme.fontFamilyZH };
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #F5F5F5;
  padding: 0;
  margin: 32px 0 0 0;
`

export default Occupied
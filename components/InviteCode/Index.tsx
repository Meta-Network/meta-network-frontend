import React from 'react';
import styled from 'styled-components'
import { isBrowser, isMobile } from "react-device-detect"

import Copy from '../Copy/Index'
import CustomModal from '../CustomModal/Index'
import { InviitationsMineState } from '../../typings/ucenter.d'
import CustomEmpty from '../CustomEmpty/Index';

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  inviteCodeData: InviitationsMineState[]
}

const DeploySite: React.FC<Props> = ({ isModalVisible, setIsModalVisible, inviteCodeData }) => {
  // 内容
  const Content: React.FC = () => {
    return (
      <section>
        <p>使用邀请码招呼朋友们加入元宇宙吧！一个邀请码仅能给一个ID使用。</p>
        {
          inviteCodeData.length ? <StyledItem>
            {
              inviteCodeData.map((i, idx) => (
                <StyledContentCopy key={idx}>
                  <Copy text={i.signature}></Copy>
                </StyledContentCopy>
              ))
            }
          </StyledItem> : <CustomEmpty description="暂无邀请码" />
        }
      </section>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={isMobile ? 'half-code' : ''}>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>你的专属邀请码</StyledContentHeadTitle>
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
const StyledContentCopy = styled.section`
  margin-top: 32px;
`
const StyledItem = styled.section`
  min-height: 70px;
  max-height: 280px;
  overflow: auto;
`

export default DeploySite
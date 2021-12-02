import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'

import CustomModal from '../CustomModal/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

const Occupied: React.FC<Props> = React.memo(function Occupied({ isModalVisible, setIsModalVisible }) {
  const { t } = useTranslation('common')

  const Content: React.FC = () => {
    return (
      <div>
        <StyledContentTextTips>{t('server-options-description')}</StyledContentTextTips>
        <StyledContentFooter>
          <Button className="custom-primary" onClick={() => setIsModalVisible(false)}>{t('ignore')}</Button>
        </StyledContentFooter>
      </div>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>{t('server-options')}</StyledContentHeadTitle>
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
  padding: 60px 0 0 0;
  display: flex;
  justify-content: flex-end;
`

const StyledContentTextTips = styled.p`
  font-style: normal;
  font-weight: normal;
  line-height: 20px;
  color: #F5F5F5;
  padding: 0;
  margin: 32px 0 0 0;
  font-size: 14px;
  word-wrap: break-word;
`

export default Occupied
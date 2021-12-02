import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import CustomModal from '../CustomModal/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  handleOccupied: () => Promise<void>
}

const Occupied: React.FC<Props> = React.memo(function Occupied ({ isModalVisible, setIsModalVisible, handleOccupied }) {
  const { t } = useTranslation('common')
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
        <StyledContentTitle>{t('occupied-modal-help-title')}</StyledContentTitle>
        <StyledContentText>{t('occupied-modal-help-rules-1')}</StyledContentText>
        <StyledContentText>{t('occupied-modal-help-rules-2')}</StyledContentText>
        <StyledContentTitle>{t('occupied-modal-help-description-1')} </StyledContentTitle>
        <StyledContentText>{t('occupied-modal-help-description-2')}</StyledContentText>

        <StyledContentTextTips>{t('occupied-modal-help-confirm')}</StyledContentTextTips>

        <StyledContentFooter>
          <Button className="custom-primary" loading={loading} onClick={() => HandleOccupied()}>{t('confirm')}</Button>
          <Button className="custom-default" onClick={() => setIsModalVisible(false)}>{t('occupied-modal-close')}</Button>
        </StyledContentFooter>
      </div>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={ isMobile ? 'half-occupied' : '' }>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>{t('create')} META SPACE</StyledContentHeadTitle>
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
import React, { useState } from 'react'
import styled from 'styled-components'
import { ExclamationOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd'
import { useTranslation } from 'next-i18next'

import ToggleServersModal from '../../ToggleServersModal/Index'

const ToggleServers: React.FC = () => {
  const { t } = useTranslation('common')

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledTitle>{t('account-hosted')}</StyledTitle>
        <StyledHeadIcon onClick={ () => setIsModalVisible(true) }></StyledHeadIcon>
      </StyledHead>
      <StyledLine>
        <div>
          <Tooltip placement="right" title={'https://www.metanetwork.online'}>
            <StyledServer>metanetwork.online</StyledServer>
          </Tooltip>
          <StyledServerDescription>{t('account-hosted-tips')}</StyledServerDescription>
        </div>
        <StyledServerEdit>{t('edit')}</StyledServerEdit>
      </StyledLine>
      <ToggleServersModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        ></ToggleServersModal>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.section`
  margin-top: 50px;
  border-bottom: 1px solid rgba(141,151,165,.2);
`

const StyledHead = styled.section`
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
`
const StyledHeadIcon = styled(ExclamationOutlined)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #c1c6cd;
  color: #ffffff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const StyledLine = styled.section`
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
`
const StyledTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #61708b;
`

const StyledServer = styled.span`
  border-bottom: 1px dashed #542ddf;
  color: #232f32;
  font-size: 14px;
  line-height: 18px;
`

const StyledServerDescription = styled.p`
  color: #8d99a5;
  font-size: 14px;
  line-height: 18px;
  margin: 8px 0 0 0;
  padding: 0;
`
const StyledServerEdit = styled.section`
  /* color: #542ddf; */
  color: #b4b4b4;
  cursor: not-allowed;
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  margin-left: 20px;
`

export default ToggleServers
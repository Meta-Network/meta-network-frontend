import React, { useState } from 'react'
import styled from 'styled-components'
import {  Button, Tooltip } from 'antd'
import { useTranslation } from 'next-i18next'
import { EmailModeProps } from '../../../typings/oauth'
import EmailLogin from './EmailLogin'
import EmailRegister from './EmailRegister'
import ToggleServers from './ToggleServers'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

interface Props {
}

const Email: React.FC<Props> = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  // email 登录模式
  const [emailMode, setEmailMode] = useState<EmailModeProps>('login')

  // 设置 email 登录模式
  const setEmailModeFn = (val: EmailModeProps): void => {
    setEmailMode(val)
  }

  return (
    <>
      <Tooltip title={t('back-to-homepage')}>
        <StyledBackBtn icon={ <ArrowLeftOutlined /> } onClick={() => { router.push('/') }}></StyledBackBtn>
      </Tooltip>
      <StyledMethod>{emailMode === 'login' ? t('log-in') : t('create-account')}</StyledMethod>
      <ToggleServers />
      {
        emailMode === 'login' ?
          <EmailLogin setEmailModeFn={setEmailModeFn}></EmailLogin> :
          emailMode === 'register' ?
            <EmailRegister setEmailModeFn={setEmailModeFn}></EmailRegister> : null
      }
    </>
  )
}

const StyledMethod = styled.p`
  font-size: 32px;
  font-weight: 600;
  padding: 0;
  margin: 0;
  /* color: #F5F5F5; */
  color: #333;
`

const StyledBackBtn = styled(Button)`
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 10px;
`

export default Email
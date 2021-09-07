import React, { useState } from 'react'
import styled from 'styled-components'
import { EmailModeProps } from '../../../typings/oauth'
import EmailLogin from './EmailLogin'
import EmailRegister from './EmailRegister'

interface Props {
}

const Email: React.FC<Props> = () => {
  // email 登录模式
  const [emailMode, setEmailMode] = useState<EmailModeProps>('login')

  // 设置 email 登录模式
  const setEmailModeFn = (val: EmailModeProps): void => {
    setEmailMode(val)
  }

  return (
    <>
      <StyledMethod>{emailMode === 'login' ? '邮箱登录' : '邮箱注册'}</StyledMethod>
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

export default Email
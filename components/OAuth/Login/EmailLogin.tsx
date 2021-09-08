import React, { useState } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import EmailCode from './EmailCode'
import { accountsEmailLogin } from '../../../services/ucenter'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import useToast from '../../../hooks/useToast'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
  const { t } = useTranslation('common')
  const [formLogin] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { Toast } = useToast()

  /**
   * 用户登录
   * @param values
   */
  const onFinishEmail = async (values: any): Promise<void> => {
    console.log('Success:', values)
    let { email, code } = values
    try {
      setLoading(true)
      const res = await accountsEmailLogin({
        account: trim(email),
        verifyCode: code,
        hcaptchaToken: 'hcaptcha_token_here'
      })
      if (res.statusCode === 200) {
        Toast({ content: t('login-successful') })
        router.push('/')
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.error(e)
      Toast({ content: t('login-failed'), type: 'warning' })
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo)
  }

  return (
      <StyledEmailForm
        form={formLogin}
        name="email-login"
        layout="vertical"
        onFinish={onFinishEmail}
        onFinishFailed={onFinishFailedEmail}
      >
        <StyledFormItem
          label=""
          name="email"
          rules={[
            { required: true, message: t('message-enter-email') },
            { required: true, type: 'email', message: t('message-enter-valid-email ') },
          ]}
        >
          <Input className="form-input" placeholder={t('message-enter-email')} autoComplete="on" />
        </StyledFormItem>

        <StyledFormCode>
          <StyledFormItem
            label=""
            name="code"
            rules={[{ required: true, message: t('message-enter-verification-code') }]}
          >
            <Input className="form-input" placeholder={t('message-enter-verification-code')} autoComplete="off" />
          </StyledFormItem>
          <EmailCode form={formLogin}></EmailCode>
        </StyledFormCode>

        <StyledFormItem>
          <StyledFormFlexSpaceBetween>
            <StyledFormBtn htmlType="submit" loading={loading}>
              {t('log-in')}
            </StyledFormBtn>
            <StyledFormBtnText type="button" onClick={() => setEmailModeFn('register')}>{t('register')}</StyledFormBtnText>
          </StyledFormFlexSpaceBetween>
        </StyledFormItem>
      </StyledEmailForm>
  )
}

// ----------------- Email form -----------------
const StyledEmailForm = styled(Form)`
  width: 346px;
  margin-top: 50px;
  .ant-form-item-explain.ant-form-item-explain-error {
    text-align: left;
  }
`

const StyledFormItem = styled(Form.Item)`
  width: 100%;

  .form-input[type="text"] {
    border: none;
    border-bottom: 1px solid #f1f1f1;
    transition: all .3s;
    border-radius: 0;
  }
  .form-input:focus,
  .form-input-password {
    box-shadow: none !important;
  }

  .form-input-password {
    border: none;
    border-bottom: 1px solid #f1f1f1;
    transition: all .3s;
    border-radius: 0;
  }
  .form-input-password:hover {
    border-color: none !important;
  }

  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: #f1f1f1 !important;
  }

  .ant-form-item-control-input-content {
    position: relative;
  }
`
const StyledFormBtn = styled(Button)`
  border: none;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;

  padding: 0 30px;
  background-color: #1da1f2;
  font-weight: 600;
  color: #fff;
  transition: background-color .3s;
  &:disabled {
    cursor: not-allowed;
    background-color: #9b9b9f;
  }
  &:hover, &:focus, &:active {
    background-color: #1a91da;
    color: #fff;
  }
`
const StyledFormFlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 70px;
`
const StyledFormBtnText = styled.button`
  border: none;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;
  background-color: transparent;
  color: #9b9b9f;
  &.code {
    position: absolute;
    right: 0;
    bottom: 0px;
  }
`
const StyledFormCode = styled.div`
  position: relative;
`
// ----------------- Email form -----------------


export default Email
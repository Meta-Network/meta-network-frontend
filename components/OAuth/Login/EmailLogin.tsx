import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import EmailCode from './EmailCode'
import { accountsEmailLogin } from '../../../services/ucenter'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import useToast from '../../../hooks/useToast'

import {
  StyledEmailForm, StyledFormItem, StyledFormBtn,
  StyledFormFlexSpaceBetween, StyledFormBtnText, StyledFormCode
} from './StyleEmail'


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
        verifyCode: trim(code),
        hcaptchaToken: 'hcaptcha_token_here'
      })
      if (res.statusCode === 200) {
        Toast({ content: t('login-successful') })
        redirectUrl()
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

  /**
   * 重定向 url
   */
  const redirectUrl = useCallback(() => {
    const { redirect } = router.query
    if (redirect) {
      (window as any).location = decodeURIComponent(redirect as string)
    } else {
      router.push('/')
    }
  }, [router])

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
          <Input className="form-input" placeholder={t('message-enter-verification-code')} autoComplete="off" maxLength={6} />
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

export default Email
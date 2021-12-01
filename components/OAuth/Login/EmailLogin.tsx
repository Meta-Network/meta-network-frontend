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
import { OauthUrlVerify } from '../../../helpers/index'
import { StoreSet } from '../../../utils/store'
import { KEY_IS_LOGIN } from '../../../common/config'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
  const { t } = useTranslation('common')
  const [formLogin] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { Toast } = useToast()
  const [token, setToken] = useState<string>()

  /**
   * 用户登录
   * @param values
   */
  const onFinishEmail = async (values: any): Promise<void> => {
    console.log('Success:', values)

    if (!token) {
      Toast({ content: t('fail'), type: 'warning' })
      return
    }

    let { email, code } = values
    try {
      setLoading(true)
      const res = await accountsEmailLogin({
        account: trim(email),
        verifyCode: trim(code),
        hcaptchaToken: token
      })
      if (res.statusCode === 200) {
        Toast({ content: t('login-successful') })

        // 记录登录
        StoreSet(KEY_IS_LOGIN, 'true')

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
      const url = decodeURIComponent(redirect as string)
      if (OauthUrlVerify(url)) {
        (window as any).location = url
      } else {
        router.push('/')
      }
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
          { required: true, type: 'email', message: t('message-enter-valid-email') },
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
        <EmailCode setToken={setToken} form={formLogin}></EmailCode>
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
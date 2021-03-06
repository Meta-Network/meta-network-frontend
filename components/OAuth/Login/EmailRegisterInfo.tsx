import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import { UsersMeUsernameState } from '../../../typings/ucenter.d'
import { accountsEmailVerify, accountsEmailSignup, usersMeUsername } from '../../../services/ucenter'
import EmailCode from './EmailCode'
import useToast from '../../../hooks/useToast'

import { StyledEmailForm, StyledFormItem,  StyledFormBtn,
  StyledFormFlexSpaceBetween, StyledFormBtnText,  StyledFormCode } from './StyleEmail'

interface Props {
  readonly inviteCode: string
  setEmailModeFn: (value: EmailModeProps) => void
}

const EmailRegisterInfo: React.FC<Props> = ({ inviteCode, setEmailModeFn }) => {
  const { t } = useTranslation('common')
  const [formResister] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(null as any)
  const router = useRouter()
  const { Toast } = useToast()

  // 更新用户名
  const updateUsername = useCallback(
    async (data: UsersMeUsernameState) => {
      try {
        const res = await usersMeUsername(data)
        if (res.statusCode === 200) {
          console.log(res.message)
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        console.log(e)
      } finally {
        router.push('/update')
      }
  }, [ router ])

  // 注册
  const onFinishEmail = useCallback(
    async (values: any): Promise<void> => {
      console.log('Success:', values)
      let { email, code, username } = values
      try {
        const resEmailSignup = await accountsEmailSignup(inviteCode, {
          account: trim(email),
          verifyCode: code,
          hcaptchaToken: 'hcaptcha_token_here'
        })
        if (resEmailSignup.statusCode === 201) {
          Toast({ content: t('registration-success') })
          await updateUsername({
            username: username
          })
        } else {
          throw new Error(resEmailSignup.message)
        }
      } catch (e) {
        console.error(e)
        Toast({ content: (e.message).toString(), type: 'warning' })
      }
    }, [ updateUsername, inviteCode, Toast, t ])

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo)
  }

  // 校验邮箱是否存在
  const verifyEmailRule = async (): Promise<void> => {
    // https://github.com/ant-design/ant-design/issues/23077
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      let _timer = setTimeout(async () => {
        try {
          const values = await formResister.getFieldsValue()
          const res = await accountsEmailVerify({ account: trim(values.email) })
          if (res.statusCode === 200) {
            if (res.data.isExists) {
              reject(t('email-has-been-registered'))
            }
          } else {
            reject(t('verification-failed'))
          }
          resolve()
        } catch (e) {
          console.log('Failed:', e)
          reject(`${t('verification-failed')} ${(e.message).toString()}`)
        } finally {
        }
      }, 500)

      setTimer(_timer)
    })
  }

  return (
    <StyledEmailForm
      form={formResister}
      name="email-register"
      layout="vertical"
      initialValues={{ remember: false }}
      onFinish={onFinishEmail}
      onFinishFailed={onFinishFailedEmail}
    >
      <StyledFormItem
        label=""
        name="username"
        rules={[
          { required: true, message: t('message-enter-username') },
        ]}
      >
        <Input className="form-input" placeholder= {`${t('message-enter-username')}(${t('unchangeable')})`} autoComplete="new-text" />
      </StyledFormItem>

      <StyledFormItem
        label=""
        name="email"
        rules={[
          { required: true, message: t('message-enter-email') },
          { required: true, type: 'email', message: t('message-enter-valid-email ') },
          { validator: verifyEmailRule },
        ]}
      >
        <Input className="form-input" placeholder={t('message-enter-email')} autoComplete="new-text" />
      </StyledFormItem>

      <StyledFormCode>
        <StyledFormItem
          label=""
          name="code"
          rules={[{ required: true, message: t('message-enter-verification-code') }]}
        >
          <Input className="form-input" placeholder={t('message-enter-verification-code')} autoComplete="off" />
        </StyledFormItem>
        <EmailCode form={formResister}></EmailCode>
      </StyledFormCode>

      <StyledFormItem>
        <StyledFormFlexSpaceBetween>
          <StyledFormBtn htmlType="submit" loading={loading}>
            {t('register')}
          </StyledFormBtn>
          <StyledFormBtnText type="button" onClick={() => setEmailModeFn('login')}>{t('log-in')}</StyledFormBtnText>
        </StyledFormFlexSpaceBetween>
      </StyledFormItem>
    </StyledEmailForm>
  )
}


export default EmailRegisterInfo
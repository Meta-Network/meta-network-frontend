import React, { useState, useCallback } from 'react'
import { Form, Input } from 'antd'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import { UsersMeUsernameState } from '../../../typings/ucenter.d'
import { accountsEmailVerify, accountsEmailSignup, usersMeUsername, usersUsernameValidate } from '../../../services/ucenter'
import EmailCode from './EmailCode'
import useToast from '../../../hooks/useToast'
import { KEY_IS_LOGIN, rules } from '../../../common/config/index'

import {
  StyledEmailForm, StyledFormItem, StyledFormBtn,
  StyledFormFlexSpaceBetween, StyledFormBtnText, StyledFormCode
} from './StyleEmail'
import { fetchHexGridsMineAPI, OauthUrlVerify } from '../../../helpers/index'
import { StoreSet } from '../../../utils/store'


interface Props {
  readonly inviteCode: string
  setEmailModeFn: (value: EmailModeProps) => void
}

const EmailRegisterInfo: React.FC<Props> = ({ inviteCode, setEmailModeFn }) => {
  const { t } = useTranslation('common')
  const [formResister] = Form.useForm()
  const [loading] = useState(false)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(null as any)
  const [timerUsername, setTimerUsername] = useState<ReturnType<typeof setTimeout>>(null as any)
  const router = useRouter()
  const { Toast } = useToast()

  /**
   * 重定向 url
   */
  const redirectUrl = useCallback(async () => {
    const { redirect } = router.query
    if (redirect) {
      const url = decodeURIComponent(redirect as string)
      if (OauthUrlVerify(url)) {

        const result = await fetchHexGridsMineAPI()
        if (result) {
          (window as any).location = url
        } else {
          router.push('/')
        }
      } else {
        router.push('/update')
      }
    } else {
      router.push('/update')
    }
  }, [router])

  // 更新用户名
  const updateUsername = useCallback(
    async (data: UsersMeUsernameState) => {
      try {
        const res = await usersMeUsername(data)
        if (res.statusCode === 200) {
          // console.log(res.message)
        } else {
          console.error(res.message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        redirectUrl()
      }
    }, [ redirectUrl ])

  // 注册
  const onFinishEmail = useCallback(
    async (values: any): Promise<void> => {
      console.log('Success:', values)

      const { email, code, username } = values
      try {
        const resEmailSignup = await accountsEmailSignup(inviteCode, {
          account: trim(email),
          verifyCode: trim(code),
          'hcaptchaToken': 'hcaptcha_token_here'
        })
        if (resEmailSignup.statusCode === 201) {
          Toast({ content: t('registration-success') })

          // 记录登陆
          StoreSet(KEY_IS_LOGIN, 'true')

          await updateUsername({
            username: username
          })
        } else {
          Toast({ content: resEmailSignup.message, type: 'warning' })
        }
      } catch (e: any) {
        if (e?.data?.statusCode === 403) {
          Toast({ content: t('message.codeHasExpired'), type: 'warning' })
        } else if (e?.data?.statusCode === 400) {
          Toast({ content: t('message.wrongCaptchaCode'), type: 'warning' })
        } else {
          Toast({ content: t('fail'), type: 'warning' })
          console.error(e)
        }
      }
    }, [updateUsername, inviteCode, Toast, t])

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo)
  }

  /**
   *校验邮箱是否存在
   *
   * @return {*}  {Promise<void>}
   */
  const verifyEmailRule = async (): Promise<void> => {
    // https://github.com/ant-design/ant-design/issues/23077
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      const _timer = setTimeout(async () => {
        const values = await formResister.getFieldsValue()
        if (!trim(values.email)) {
          reject(t('message-enter-email'))
          return
        }
        try {
          const res = await accountsEmailVerify({ account: trim(values.email) })
          if (res.statusCode === 200) {
            if (res.data.isExists) {
              reject(t('email-has-been-registered'))
            } else {
              resolve()
            }
          } else {
            reject(t('verification-failed'))
          }
        } catch (e: any) {
          console.log('Failed:', e)
          reject(t('verification-failed'))
        } finally {
        }
      }, 500)

      setTimer(_timer)
    })
  }
  /**
   * verify username rules
   * 验证用户名是否存在
   * @return {*}  {Promise<void>}
   */
  const verifyUsernameRule = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reg = new RegExp(rules.usernameReg)
      const values = formResister.getFieldsValue()
      const result = reg.test(trim(values.username))
      if (result) {
        clearTimeout(timerUsername)
        const _timer = setTimeout(async () => {
          try {
            const res = await usersUsernameValidate({ username: trim(values.username) })
            if (res.statusCode === 200) {
              if (res.data.isExists) {
                reject(t('username-already-exists'))
              } else {
                resolve()
              }
            } else {
              reject(t('verification-failed'))
            }
          } catch (e: any) {
            console.log('Failed:', e)
            let message
            if (e?.data?.message) {
              if (Array.isArray(e.data.message)) {
                message = t('verification-failed') + ' ' +e.data.message.reduce((a: string, b: string) => a + (a && '、') + b, '')
              } else {
                message = t('verification-failed') + ' ' +e.data.message
              }
            } else {
              message = t('verification-failed')
            }
            reject(message)
          }
        }, 500)
  
        setTimerUsername(_timer)
      } else {
        reject(t('username-rules-reg', { min: rules.username.min, max: rules.username.max }))
      }
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
          { validator: verifyUsernameRule }
        ]}
      >
        <Input className="form-input" placeholder={`${t('message-enter-username')}(${t('unchangeable')})`} autoComplete="new-text" />
      </StyledFormItem>

      <StyledFormItem
        label=""
        name="email"
        rules={[
          { required: true, type: 'email', message: t('message-enter-valid-email') },
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
          <Input className="form-input" placeholder={t('message-enter-verification-code')} autoComplete="off" maxLength={8} />
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
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'
import { trim } from 'lodash'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import { invitationsValidate } from '../../../services/ucenter'
import useToast from '../../../hooks/useToast'

import {
  StyledEmailForm, StyledFormItem, StyledFormBtn,
  StyledFormFlexSpaceBetween, StyledFormBtnText, StyledCodeDescription,
  StyledCodeDescriptionTitle, StyledCodeDescriptionText
} from './StyleEmail'

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
  setInviteCode: React.Dispatch<React.SetStateAction<string>>
  setEmailModeFn: (value: EmailModeProps) => void
}

const EmailRegisterCode: React.FC<Props> = ({ setStep, setInviteCode, setEmailModeFn }) => {
  const { t } = useTranslation('common')
  const [formResister] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { Toast } = useToast()


  // 注册
  const onFinishEmail = useCallback(
    async (values: any): Promise<void> => {
      console.log('Success:', values)

      setLoading(true)
      let { inviteCode } = values
      try {
        const res = await invitationsValidate({
          invitation: trim(inviteCode),
        })
        if (res.statusCode === 200) {

          if (!res.data.exists) {
            throw new Error(t('message-invitation-code-error'))
          }

          if (res.data.available) {
            setStep(1)
            setInviteCode(inviteCode)
          } else {
            throw new Error(t('invalid-invitation-code'))
          }
        } else {
          throw new Error(res.message)
        }
      } catch (e: any) {
        console.log(e)
        Toast({ content: (e.message).toString(), type: 'warning' })
      } finally {
        setLoading(false)
      }
    }, [Toast, setStep, setInviteCode, t])

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo)
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
        name="inviteCode"
        rules={[
          { required: true, message: t('message-enter-invitation-code') },
        ]}
      >
        <Input className="form-input" placeholder={t('message-enter-invitation-code')} autoComplete="new-text" />
      </StyledFormItem>
      <StyledCodeDescription>
        <StyledCodeDescriptionTitle>{t('invitation-code-help-title')}</StyledCodeDescriptionTitle>
        <StyledCodeDescriptionText
          dangerouslySetInnerHTML={{
            __html: t('invitation-code-help-rule-1', { escapeValue: false })
          }}></StyledCodeDescriptionText>
        <StyledCodeDescriptionText>2.{t('invitation-code-help-rule-2')}</StyledCodeDescriptionText>
      </StyledCodeDescription>


      <StyledFormItem>
        <StyledFormFlexSpaceBetween>
          <StyledFormBtn htmlType="submit" loading={loading}>
            {t('next')}
          </StyledFormBtn>
          <StyledFormBtnText type="button" onClick={() => setEmailModeFn('login')}>{t('log-in')}</StyledFormBtnText>
        </StyledFormFlexSpaceBetween>
      </StyledFormItem>
    </StyledEmailForm>
  )
}

export default EmailRegisterCode
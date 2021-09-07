import React, { useState, useCallback } from 'react';
import styled from 'styled-components'
import { Form, Input, Button } from 'antd';
import { trim } from 'lodash'

import { EmailModeProps } from '../../../typings/oauth'
import { invitationsValidate } from '../../../services/ucenter'
import useToast from '../../../hooks/useToast'

import { StyledEmailForm, StyledFormItem,  StyledFormBtn,
  StyledFormFlexSpaceBetween, StyledFormBtnText, StyledCodeDescription,
  StyledCodeDescriptionTitle, StyledCodeDescriptionText} from './StyleEmail'

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
  setInviteCode: React.Dispatch<React.SetStateAction<string>>
  setEmailModeFn: (value: EmailModeProps) => void
}

const EmailRegisterCode: React.FC<Props> = ({ setStep, setInviteCode, setEmailModeFn }) => {
  const [formResister] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Toast } = useToast()


  // 注册
  const onFinishEmail = useCallback(
    async (values: any): Promise<void> => {
      console.log('Success:', values);

      setLoading(true)
      let { inviteCode } = values
      try {
        const res = await invitationsValidate({
          invitation: trim(inviteCode),
        })
        if (res.statusCode === 200 && res.data.available) {
          setStep(1)
          setInviteCode(inviteCode)
        } else {
          throw new Error('邀请码错误')
        }
      } catch (e) {
        console.log(e)
        Toast({ content: (e.message).toString(), type: 'warning' })
      } finally {
        setLoading(false)
      }
    }, [ Toast, setStep, setInviteCode ])

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };


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
          { required: true, message: '请输入邀请码' },
        ]}
      >
        <Input className="form-input" placeholder="请输入邀请码" autoComplete="new-text" />
      </StyledFormItem>
      <StyledCodeDescription>
        <StyledCodeDescriptionTitle>如何获取邀请码?</StyledCodeDescriptionTitle>
        <StyledCodeDescriptionText>1.如果您是 Matataki 用户请在官网中登录后查看 消息通知，我们已经向您发送了邀请码</StyledCodeDescriptionText>
        <StyledCodeDescriptionText>2.如果您是新用户请向已经登入的用户请求获得邀请码（每个新用户完成建站后可获得3个邀请码）</StyledCodeDescriptionText>
      </StyledCodeDescription>


      <StyledFormItem>
        <StyledFormFlexSpaceBetween>
          <StyledFormBtn htmlType="submit" loading={loading}>
            下一步
          </StyledFormBtn>
          <StyledFormBtnText type="button" onClick={() => setEmailModeFn('login')}>登录</StyledFormBtnText>
        </StyledFormFlexSpaceBetween>
      </StyledFormItem>
    </StyledEmailForm>
  )
}

export default EmailRegisterCode
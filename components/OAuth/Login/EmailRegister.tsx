import React, { useState } from 'react';
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd';
import { EmailModeProps } from '../../../typings/oauth'
import { accountsEmailVerify, accountsEmailSignup, invitation } from '../../../services/accounts'
import EmailCode from './EmailCode'
import { trim } from 'lodash'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
  const [formResister] = Form.useForm();

  // 注册
  const onFinishEmail = async (values: any): Promise<void> => {
    console.log('Success:', values);
    let { email, code } = values
    try {
      // 测试邀请码
      const res = await invitation()

      const resEmailSignup = await accountsEmailSignup(res.data, {
        email: trim(email),
        verifyCode: code,
        hcaptchaToken: 'hcaptcha_token_here'
      })
      if (resEmailSignup.statusCode === 201) {
        message.success('注册成功')
      } else {
        message.warning(`注册失败：${resEmailSignup.message}`)
      }
    } catch (e) {
      console.error(e)
      message.error('注册失败')
    }
  };

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };

  // 校验邮箱是否存在
  const verifyEmailRule = async (): Promise<void> => {
    try {
      const values = await formResister.getFieldsValue()

      const res = await accountsEmailVerify({ email: trim(values.email) })
      if (res.statusCode === 200) {
        if (res.data.isExists) {
          return Promise.reject(new Error('邮箱已注册'))
        }
      } else {
        return Promise.reject(new Error('验证失败'))
      }
      return Promise.resolve()
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      return Promise.reject(new Error('验证失败'))
    }
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
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { required: true, type: 'email', message: '请输入有效邮箱' },
          { validator: verifyEmailRule },
        ]}
      >
        <Input className="form-input" placeholder="请输入邮箱" autoComplete="new-text" />
      </StyledFormItem>

      <StyledFormCode>
        <StyledFormItem
          label=""
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input className="form-input" placeholder="请输入验证码" autoComplete="off" />
        </StyledFormItem>
        <EmailCode form={formResister}></EmailCode>
      </StyledFormCode>

      <StyledFormItem>
        <StyledFormFlexSpaceBetween>
          <StyledFormBtn htmlType="submit">
            注册
          </StyledFormBtn>
          <StyledFormBtnText type="button" onClick={() => setEmailModeFn('login')}>登录</StyledFormBtnText>
        </StyledFormFlexSpaceBetween>
      </StyledFormItem>
    </StyledEmailForm>
  )
}

// ----------------- Email form -----------------
const StyledEmailForm = styled(Form)`
  width: 346px;
  margin-top: 50px;
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
  .form-input-password:hover,
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: none !important;
  }
`
const StyledFormCode = styled.div`
  position: relative;
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
`
// ----------------- Email form -----------------

export default Email
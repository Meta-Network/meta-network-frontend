import React, { useState } from 'react';
import styled from 'styled-components'
import { Form, Input, Button } from 'antd';
import { EmailModeProps } from '../../../typings/oauth'
import { verifyEmail } from '../../../services/login'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
  const [formResister] = Form.useForm();

  const onFinishEmail = (values: any): void => {
    console.log('Success:', values);
    alert('注册')
  };

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };

  // 校验邮箱是否存在
  const verifyEmailRule = async () => {
    try {
      const values = await formResister.getFieldsValue()
      // console.log('Success:', values);

      // await verifyEmail({ email: values.email })
      return Promise.resolve()
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      return Promise.reject(new Error('邮箱已注册'))
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

      <StyledFormItem
        label=""
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { required: true, max: 32, min: 4, message: '密码长度4-32' },
        ]}
      >
        <Input.Password className="form-input-password" placeholder="请输入密码" autoComplete="new-password" />
      </StyledFormItem>

      <StyledFormCode>
        <StyledFormItem
          label=""
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input className="form-input" placeholder="请输入验证码" autoComplete="off" />
        </StyledFormItem>
        <StyledFormBtnText className="code" type="button" onClick={() => alert('发送验证码')}>获取验证码</StyledFormBtnText>
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
  &.code {
    position: absolute;
    right: 0;
    bottom: 0px;
  }
`
// ----------------- Email form -----------------

export default Email
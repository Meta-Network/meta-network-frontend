import React, { useState } from 'react';
import styled from 'styled-components'
import { Form, Input, Button } from 'antd';
import { EmailModeProps } from '../../../typings/oauth'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
  const [formLogin] = Form.useForm();

  const onFinishEmail = (values: any): void => {
    console.log('Success:', values);
    alert('登录')
  };

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };

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
            { required: true, message: '请输入邮箱' },
            { required: true, type: 'email', message: '请输入有效邮箱' },
          ]}
        >
          <Input className="form-input" placeholder="请输入邮箱" autoComplete="on" />
        </StyledFormItem>

        <StyledFormItem
          label=""
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { required: true, max: 32, min: 4, message: '密码长度4-32' },
          ]}
        >
          <Input.Password className="form-input-password" placeholder="请输入密码" autoComplete="on" />
        </StyledFormItem>

        <StyledFormItem>
          <StyledFormFlexSpaceBetween>
            <StyledFormBtn htmlType="submit">
              登录
            </StyledFormBtn>
            <StyledFormBtnText type="button" onClick={() => setEmailModeFn('register')}>注册</StyledFormBtnText>
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
// ----------------- Email form -----------------

export default Email
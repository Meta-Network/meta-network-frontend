import React from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'


// ----------------- Email form -----------------
export const StyledEmailForm = styled(Form)`
  width: 346px;
  margin-top: 40px;
  .ant-form-item-explain.ant-form-item-explain-error {
    text-align: left;
  }
`

export const StyledFormItem = styled(Form.Item)`
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

  .upload-avatar {
    cursor: pointer;
    .ant-upload-list {
      display: none;
    }
  }
`
export const StyledFormCode = styled.div`
  position: relative;
`

export const StyledFormBtn = styled(Button)`
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
export const StyledFormFlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 70px;
`
export const StyledFormBtnText = styled.button`
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

export const StyledCodeDescription = styled.section`
`
export const StyledCodeDescriptionTitle = styled.p`
  padding: 0;
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #9b9b9f;
  line-height: 1.4;
  font-weight: 500;
`
export const StyledCodeDescriptionText = styled.section`
  font-size: 12px;
  color: #9b9b9f;
  line-height: 1.4;
  margin: 4px 0;
`

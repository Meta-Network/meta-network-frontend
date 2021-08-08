/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components'
import { Menu, Dropdown } from 'antd';

interface Props {
}

const UserMore: React.FC<Props> = () => {

  const menu = (
    <Menu>
      <Menu.Item>
        收藏
      </Menu.Item>
      <Menu.Item disabled>
        拍一拍
      </Menu.Item>
      <Menu.Item>
        复制地址
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledUserMore>
      <StyledUserMoreButton style={{ marginBottom: 16 }}>进入主页</StyledUserMoreButton>
      <Dropdown overlay={menu}>
        <StyledUserMoreButton>...</StyledUserMoreButton>
      </Dropdown>
    </StyledUserMore>
  )
}

const StyledUserMore = styled.div`
  position: fixed;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(80px,-50%);
  z-index: 10;
`
const StyledUserMoreButton = styled.button`
  background: #F5F5F5;
  border: none;
  border-radius: 40px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #2C2B2A;
  padding: 12px 20px;
  margin: 0;
  display: block;
  outline: none;
  cursor: pointer;
`

export default UserMore
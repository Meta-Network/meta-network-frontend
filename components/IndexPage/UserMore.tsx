/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components'
import { Menu, Dropdown, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { NodeState } from '../../typings/node.d'

interface Props {
  readonly currentNode: NodeState
  HandleBookmark: (value: NodeState) => void
}

const UserMore: React.FC<Props> = ({ currentNode, HandleBookmark }) => {

  // 按钮点击
  const handleJumpHome = (e: Event): void => {
    e.stopPropagation()
    message.info('进入主页')
    window.open(currentNode?.user?.url, '_blank')
  }

  // 菜单点击
  const handleMenuClick = ({ key, domEvent }: { key: string, domEvent: any }) => {
    domEvent.stopPropagation()
    if (key === 'bookmark') {
      HandleBookmark(currentNode)
    }
  };

  // Copy
  const handleCopy = () => {
    message.info({
      content: <span>
        <ExclamationCircleOutlined />
        <span>
          复制成功
        </span>
      </span>,
      className: 'custom-message',
      duration: 2,
      icon: ''
    });
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="bookmark">
        {
          currentNode.bookmark ? '取消收藏': '收藏'
        }
      </Menu.Item>
      <Menu.Item disabled key="beat">
        拍一拍
      </Menu.Item>

      <CopyToClipboard text={currentNode?.user?.url || ''}
        onCopy={() => handleCopy()}>
        <Menu.Item key="copy">
          复制地址
        </Menu.Item>
      </CopyToClipboard>
    </Menu>
  );

  return (
    <StyledUserMore>
      <StyledUserMoreButton
        onClick={(e: any) => handleJumpHome(e)}
        style={{ marginBottom: 16 }}
      >进入主页</StyledUserMoreButton>
      <Dropdown overlay={menu}>
        <StyledUserMoreButton onClick={(e: any) => e.stopPropagation()}>...</StyledUserMoreButton>
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
/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react';
import styled from 'styled-components'
import { Menu, Dropdown, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ExclamationCircleOutlined, CopyOutlined, TagsOutlined, SmileOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { isArray } from 'lodash';

import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { PointState } from '../../typings/node';
import { ArrowTopLeftIcon, CopyIcon, BookmarkIcon, BookmarkFillIcon, CircleSuccessIcon } from '../Icon/Index'

interface Props {
  readonly bookmark: PointState[]
  readonly currentNode: hexGridsByFilterState
  HandleBookmark: (value: hexGridsByFilterState) => void
}

const UserMore: React.FC<Props> = ({ bookmark, currentNode, HandleBookmark }) => {
  // 是否收藏
  const isBookmark = useMemo(() => {
    if (!isArray(bookmark)) {
      return false
    }
    // console.log('bookmark', bookmark)
    const res = bookmark.findIndex(i =>
      i.x === currentNode.x &&
      i.y === currentNode.y &&
      i.z === currentNode.z
    )
    return ~res
  }, [ bookmark, currentNode])

  // 按钮点击
  const handleJumpHome = (e: Event): void => {
    e.stopPropagation()
    message.info('进入主页')
    window.open('https://meta-cms.vercel.app/', '_blank')
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
      content: <span className="message-content">
        <CircleSuccessIcon />
        <span>
          复制成功
        </span>
      </span>,
      className: 'custom-message',
      icon: ''
    });
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="bookmark" icon={ isBookmark ? <BookmarkFillIcon></BookmarkFillIcon> : <BookmarkIcon></BookmarkIcon>}>
        {
          isBookmark ? '取消收藏': '收藏'
        }
      </Menu.Item>
      {/* <Menu.Item disabled key="beat" icon={<SmileOutlined />}>
        拍一拍
      </Menu.Item> */}
      <CopyToClipboard text={'https://meta-cms.vercel.app/'}
        onCopy={() => handleCopy()}>
        <Menu.Item key="copy" icon={<CopyIcon />}>
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
      >
        <ArrowTopLeftIcon />{' '}进入主页
      </StyledUserMoreButton>
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
  @media screen and (max-width: 768px) {
    top: auto;
    bottom: 10%;
    transform: translate(-50%, 0);
  }
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
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    margin: 0 auto;
  }
  & > span {
    margin-right: 6px;
  }
`

export default UserMore
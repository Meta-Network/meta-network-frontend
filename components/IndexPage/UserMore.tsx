/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ExclamationCircleOutlined, CopyOutlined, TagsOutlined, SmileOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { isArray } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useTranslation } from 'next-i18next'

import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { PointState } from '../../typings/node'
import { ArrowTopLeftIcon, CopyIcon, BookmarkIcon, BookmarkFillIcon, SliderShareIcon, SliderSpaceIcon } from '../Icon/Index'
import useToast from '../../hooks/useToast'

interface Props {
  readonly bookmark: PointState[]
  readonly currentNode: hexGridsByFilterState
  HandleBookmark: (value: hexGridsByFilterState) => void
  focus$: EventEmitter<string>
}

const UserMore: React.FC<Props> = ({ bookmark, currentNode, HandleBookmark, focus$ }) => {
  const { Toast } = useToast()
  const [visible, setVisible] = useState<boolean>(false)
  const { t } = useTranslation('common')

  // 是否收藏
  const isBookmark = useMemo(() => {
    if (!isArray(bookmark)) {
      return false
    }
    // console.log('bookmark', bookmark)

    // 是否收藏
    const _isBookmark = (i: PointState) =>
      i.x === currentNode.x &&
      i.y === currentNode.y &&
      i.z === currentNode.z

    const isBookmarkResult = bookmark.some(_isBookmark)

    return isBookmarkResult
  }, [bookmark, currentNode])

  // 按钮点击
  const handleJumpHome = (e: Event): void => {
    e.stopPropagation()
    Toast({ content: t('go-to-homepage') })
    window.open(process.env.NEXT_PUBLIC_META_CMS_URL, '_blank')
  }

  // 菜单点击
  const handleMenuClick = ({ key, domEvent }: { key: string, domEvent: any }) => {
    domEvent.stopPropagation()
    if (key === 'bookmark') {
      HandleBookmark(currentNode)
    }
  }

  /**
   * 事件订阅
   */
  focus$.useSubscription((val: string): void => {
    // console.log('val', val)
    if (val === 'zoom') {
      setVisible(false)
    }
  })

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="bookmark" icon={isBookmark ? <BookmarkFillIcon></BookmarkFillIcon> : <BookmarkIcon></BookmarkIcon>}>
        {
          isBookmark ? t('delete-bookmark') : t('bookmark')
        }
      </Menu.Item>
      {/* <Menu.Item disabled key="beat" icon={<SmileOutlined />}>
        拍一拍
      </Menu.Item> */}
      <CopyToClipboard text={process.env.NEXT_PUBLIC_META_CMS_URL}
        onCopy={() => Toast({ content: t('copy-successfully') })}>
        <Menu.Item key="copy" icon={<CopyIcon />}>
          {t('copy-address')}
        </Menu.Item>
      </CopyToClipboard>
    </Menu>
  )

  const handleVisible = useCallback(
    (val: boolean) => {
      // console.log('val', val)
      setVisible(val)
    },
    [],
  )

  return (
    <>
      {
        currentNode.subdomain
          ? <StyledUserMoreButton
            onClick={(e: any) => handleJumpHome(e)}
            style={{ marginBottom: 16 }}
          >
            <SliderSpaceIcon />{' '}访问 Meta Space
            <SliderShareIcon className="view-icon" />
          </StyledUserMoreButton>
          : null
      }
      <Dropdown
        onVisibleChange={handleVisible}
        visible={visible}
        overlay={menu}
        trigger={[isBrowser ? 'hover' : isMobile ? 'click' : 'hover']}
        placement={isBrowser ? 'bottomCenter' : isMobile ? 'topCenter' : 'bottomCenter'}
        overlayClassName="custom-dropdown-more">
        <StyledUserMoreButton onClick={(e: any) => e.stopPropagation()}>...</StyledUserMoreButton>
      </Dropdown>
    </>
  )
}

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
  white-space: nowrap;
  user-select: none;
  @media screen and (max-width: 768px) {
    margin: 0 auto;
  }
  & > span {
    margin-right: 6px;
  }
  .view-icon {
    opacity: 0;
    margin-left: 10px;
    transition: all .2s;
  }
  &:hover {
    .view-icon {
      opacity: 1;
    }
  }
`

export default UserMore
import React, { useMemo, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CloseOutlined, EllipsisOutlined, CopyOutlined, SmileOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { isArray, isEmpty } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useTranslation } from 'next-i18next'

import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { PointState, translateMapState } from '../../typings/node'
import { SliderSpaceIcon, BookmarkIcon, BookmarkFillIcon, SliderShareIcon, SliderInviteIcon } from '../Icon/Index'
import useToast from '../../hooks/useToast'
import { keyFormat, strEllipsis } from '../../utils/index'
import { fetchhexGridsLoctionByUserIdAPI } from '../../helpers/index'

interface Props {
  readonly bookmark: PointState[]
  readonly currentNode: hexGridsByFilterState
  HandleBookmark: (value: hexGridsByFilterState) => void
  translateMap: (value: translateMapState) => void
  focus$: EventEmitter<string>
}

const UserMore: React.FC<Props> = ({ bookmark, currentNode, HandleBookmark, focus$, translateMap }) => {
  const { Toast } = useToast()
  const [visible, setVisible] = useState<boolean>(false)
  const { t } = useTranslation('common')
  const [inviteUserNode, setInviteUserNode] = useState({} as hexGridsByFilterState)
  const [state, setState] = useState<boolean>(false)

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

  // 复制信息
  const userInfoText = useMemo(() => `${t('nickname')}：${currentNode.userNickname || currentNode.username || t('no-nickname')}
${t('meta-space-introduction')}：${currentNode.userBio}
${t('meta-space-position')}：${window.location.origin}?cube=${keyFormat({ x: currentNode.x, y: currentNode.y, z: currentNode.z })}
${t('meta-space-name')}：${currentNode.siteName || t('no-content')}
${t('meta-space-homepage')}：${currentNode.subdomain || t('no-content')}
`, [currentNode, t])

  // 按钮点击
  const handleJumpHome = (e: Event): void => {
    e.stopPropagation()
    Toast({ content: t('go-to-homepage') })
    window.open(`https://${currentNode.subdomain}`, '_blank')
  }

  // 菜单点击
  const handleMenuClick = ({ key, domEvent }: { key: string, domEvent: any } | any): void => {
    domEvent.stopPropagation()
    if (key === 'bookmark') {
      HandleBookmark(currentNode)
    } else if (key === 'invite') {
      const { x, y, z } = inviteUserNode
      translateMap({ point: { x, y, z } })
    }
  }

  /**
   * 事件订阅
   */
  focus$.useSubscription((val: string): void => {
    // console.log('val', val)
    if (val === 'zoom') {
      setVisible(false)
      setState(false)
    }
  })

  const MenuComponent = () => (
    <Menu onClick={handleMenuClick} className="custom-user-more">
      <Menu.Item key="bookmark" icon={isBookmark ? <BookmarkFillIcon></BookmarkFillIcon> : <BookmarkIcon></BookmarkIcon>}>
        {
          isBookmark ? t('delete-bookmark') : t('bookmark')
        }
      </Menu.Item>
      <CopyToClipboard
        text={`${window.location.origin}?cube=${keyFormat({ x: currentNode.x, y: currentNode.y, z: currentNode.z })}`}
        onCopy={() => Toast({ content: t('copy-successfully-tips') })}>
        <Menu.Item key="copy" icon={<CopyOutlined />}>
          {t('copy-location')}
        </Menu.Item>
      </CopyToClipboard>
      <CopyToClipboard text={userInfoText}
        onCopy={() => Toast({ content: t('copy-successfully-tips') })}>
        <Menu.Item key="copy" icon={<CopyOutlined />}>
          {t('copy-information')}
        </Menu.Item>
      </CopyToClipboard>
      {
        isEmpty(inviteUserNode)
          ? <Menu.Item icon={<SliderInviteIcon />}>Meta Network</Menu.Item>
          : <Menu.Item key="invite" icon={<SliderInviteIcon />}>
            {
              strEllipsis(inviteUserNode.userNickname || inviteUserNode.username) || t('no-nickname')
            }
          </Menu.Item>
      }
    </Menu>
  )

  const handleVisible = useCallback(
    (val: boolean) => {
      // console.log('val', val)
      setVisible(val)
    },
    [],
  )

  /**
   * 获取位置 通过 user id
   */
  const fetchhexGridsLoctionByUserId = useCallback(
    async () => {
      const data = await fetchhexGridsLoctionByUserIdAPI({ userId: currentNode.inviterUserId })
      if (data) {
        setInviteUserNode(data)
      }
    }, [currentNode.inviterUserId])

  /**
   * hide dropdown more
   */
  const hideDropdown = useCallback(() => {
    if (isMobile) {
      setState(false)
    }
  }, [],)

  useEffect(() => {
    if (!isEmpty(currentNode) && Number(currentNode.inviterUserId) > 0) {
      fetchhexGridsLoctionByUserId()
    } else {
      setInviteUserNode({} as hexGridsByFilterState)
    }

    window.addEventListener('click', hideDropdown)
    return () => window.removeEventListener('click', hideDropdown)
  }, [currentNode, fetchhexGridsLoctionByUserId, hideDropdown])

  return (
    <>
      {
        currentNode.subdomain
          ? <StyledUserMoreButton
            onClick={(e: any) => handleJumpHome(e)}
            style={{ marginBottom: 16 }}
          >
            <SliderSpaceIcon className="btn-icon" />{' '}{t('visit-meta-space')}
            <SliderShareIcon className="view-icon" />
          </StyledUserMoreButton>
          : null
      }
      {/* mobile pc 两套 */}
      {
        isMobile
          ? <Dropdown
            onVisibleChange={handleVisible}
            visible={visible}
            overlay={MenuComponent}
            trigger={[isBrowser ? 'hover' : isMobile ? 'click' : 'hover']}
            placement={isBrowser ? 'bottomCenter' : isMobile ? 'topCenter' : 'bottomCenter'}
          >
            <StyledUserMoreButton onClick={(e: any) => { e.stopPropagation();setState(!state) }}>
              {state ? <CloseOutlined /> : <EllipsisOutlined />}
            </StyledUserMoreButton>
          </Dropdown>
          : isBrowser
            ? <StyledUserMoreBtn
                style={{ width: state ? 'auto' : 60, justifyContent: 'center' }}
                show={state} 
                onMouseEnter={() => setState(true)}
                onMouseLeave={() => setState(false)}>
              {
                state
                  ? <MenuComponent />
                  : <StyledMenuMore>
                    <EllipsisOutlined />
                  </StyledMenuMore>
              }
            </StyledUserMoreBtn>
            : null
      }
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
  & > .btn-icon {
    margin-right: 6px;
  }
  .view-icon {
    opacity: 0;
    margin-left: 10px;
    transition: all .2s;
    width: 20px;
    height: 20px;
  }
  &:hover {
    .view-icon {
      opacity: 1;
    }
  }
`
const StyledUserMoreBtnContent = styled.span`
`

const StyledUserMoreBtn = styled.section<{ show: boolean }>`
  background: #F5F5F5;
  border: none;
  border-radius: ${props => props.show ? '16px' : '40px'};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #2C2B2A;
  margin: 0;
  display: block;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  overflow: hidden;
  transition: all .3s;
`
const StyledMenu = styled.ul`
  outline: none;
  margin: 0;
  padding: 0;
  text-align: left;
  list-style-type: none;
  li {
    margin: 0;
    padding: 12px 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #e8e8e8;
    }
  }
`
const StyledMenuMore = styled.span`
  padding: 12px 20px;
`
const StyledMenuText = styled.span`
  margin-left: 8px;
`

export default UserMore
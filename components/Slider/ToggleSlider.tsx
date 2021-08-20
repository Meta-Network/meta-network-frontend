import React, { useState, useEffect, useCallback } from 'react';
import {
  MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined,
  SearchOutlined, SwapOutlined, ArrowLeftOutlined,
  LeftOutlined, BookOutlined, EnvironmentOutlined
} from '@ant-design/icons'
import { Drawer, Avatar, message, Popconfirm } from 'antd';
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMount, useUnmount, useThrottleFn, useInViewport } from 'ahooks'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'

import { useUser } from '../../hooks/useUser'
import { accountsTokenDelete } from '../../services/ucenter'
import Bookmark from '../Bookmark/Index'
import InviteCode from '../InviteCode/Index'
import SearchModal from '../SearchModal/Index'
import { hexGridsByFilterState, PointScopeState } from '../../typings/metaNetwork.d'
import { InviitationsMineState } from '../../typings/ucenter.d'
import { SearchIcon, SwitchVerticalIcon, BookmarkIcon, ArrowTopLeftIcon, InviteIcon, LogoutIcon } from '../Icon/Index'
import { fetchInviteCode } from '../../helpers/index'

interface Props {
  readonly bookmarkNode: hexGridsByFilterState[]
  readonly defaultHexGridsRange: PointScopeState
  translateMap: ({ x, y, z }: { x: number, y: number, z: number }) => void
  HandleRemoveBookmark: (value: hexGridsByFilterState[]) => void
  HandlePosition: () => void
}

interface SliderContenAccoountProps {
  readonly isLoggin: boolean
  signOut: () => void
}

// 侧边栏 内容 账户操作
const SliderContenAccoount: React.FC<SliderContenAccoountProps> = React.memo(function SliderContenAccoount ({ isLoggin, signOut }) {
  console.log('SliderContenAccoount')

  return (
    <StyledSliderCAccount>
      {
        isLoggin ?
          <Popconfirm placement="top" title={'确认登出账户？'} onConfirm={signOut} okText="Yes" cancelText="No">
            <StyledSliderCAccountButton className="g-red">
              <LogoutIcon />
              登出账户
            </StyledSliderCAccountButton>
          </Popconfirm> :
          <Link href="/oauth/login">
            <a>
              <StyledSliderCAccountButton className="g-green">
                <ArrowTopLeftIcon />
                前往注册/登陆
              </StyledSliderCAccountButton>
            </a>
          </Link>
      }
    </StyledSliderCAccount>
  )
})

const ToggleSlider: React.FC<Props> = React.memo( function ToggleSlider ({ translateMap, bookmarkNode, defaultHexGridsRange, HandleRemoveBookmark, HandlePosition }) {
  console.log('ToggleSlider')

  // 显示侧边栏
  const [visibleSlider, setVisibleSlider] = useState(false);
  const { user, isLoggin } = useUser()
  const router = useRouter()
  // 收藏
  const [isModalVisibleBookmark, setIsModalVisibleBookmark] = useState<boolean>(false);
  // 邀请码
  const [isModalVisibleInviteCode, setIsModalVisibleInviteCode] = useState<boolean>(false);
  // 邀请码
  const [inviteCodeData, setInviteCodeData] = useState<InviitationsMineState[]>([])
  // 搜索
  const [isModalVisibleSearch, setIsModalVisibleSearch] = useState<boolean>(false);

  // TODO：阻塞让动效卡顿
  const animatedStylesMenu = useSpring({
    from: { x: -60, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: {
      duration: 300
    }
  })

  const animatedStylesId = useSpring({
    from: { x: -60, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: {
      duration: 300
    },
    delay: 100
  })

  const showDrawer = () => {
    setVisibleSlider(true);
  };
  const onClose = () => {
    setVisibleSlider(false);
  };

  const signOut = async () => {
    try {
      const res = await accountsTokenDelete()
      if (res.statusCode === 200) {
        message.success('登出成功')
        router.reload()
      } else {
        message.warning(`登出失败: ${res.message}`)
      }
    } catch (e) {
      console.log(e)
      message.error('登出失败')
    }
  }

  // 获取邀请码
  const fetchInviteCodeFn = useCallback(
    async () => {
      const res = await fetchInviteCode()
      if (!res.length) {
        return
      }
      setInviteCodeData(res)
    },
    [],
  )

  useEffect(() => {
    if (isLoggin) {
      fetchInviteCodeFn()
    }
  }, [isLoggin, fetchInviteCodeFn])

  // 侧边栏 用户内容
  const SliderContentUser: React.FC = () => {
    console.log('SliderContentUser')

    return (
      <StyledSliderCUser>
        <Avatar size={40} icon={<UserOutlined />} src={user?.avatar} />
        <StyledSliderCUserInfo>
          {
            isLoggin ? user.nickname || user.username || '暂无昵称' : '[未登录]'
          }
        </StyledSliderCUserInfo>
        <LeftOutlined className="arrow" />
      </StyledSliderCUser>
    )
  }

  // 侧边栏 菜单 导航
  const SliderContenItemtNav: React.FC = () => {
    console.log('SliderContenItemtNav')
    return (
      <StyledSliderCItem>
        <li>
          <h4>导航</h4>
        </li>
        <li>
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchIcon />
            搜索
          </a>
        </li>
        <li>
          <a href="javascript:;" className="disabled">
            <SwitchVerticalIcon />
            切换 ID层
          </a>
        </li>
        <li>
          <a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
            <BookmarkIcon />
            我的收藏
          </a>
        </li>
      </StyledSliderCItem>
    )
  }
  // 侧边栏 菜单 用户
  const SliderContenItemtUser: React.FC = () => {
    console.log('SliderContenItemtUser')

    return (
      <StyledSliderCItem>
        <li>
          <h4>个人</h4>
        </li>
        <li>
          <a href={ isLoggin ? 'https://meta-cms.vercel.app' : 'javascript:;' } className={isLoggin ? '' : 'disabled'} target="_blank" rel="noopener noreferrer">
            <ArrowTopLeftIcon />
            前往管理后台
          </a>
        </li>
        <li>
          <a href="javascript:;" onClick={() => isLoggin && setIsModalVisibleInviteCode(true)} className={isLoggin ? '' : 'disabled'}>
            <InviteIcon />
            邀请码
            {
              isLoggin ?
                <StyledCount>{inviteCodeData.length}</StyledCount> : null
            }
          </a>
        </li>
      </StyledSliderCItem>
    )
  }

  return (
    <>
      <StyledButton onClick={showDrawer} style={{ ...animatedStylesMenu }}>
        <MenuUnfoldOutlined />
      </StyledButton>
      <StyledButtonMap onClick={HandlePosition} style={{ ...animatedStylesId }}>
        <EnvironmentOutlined />
      </StyledButtonMap>
      <StyledSlider
        title=""
        closable={false}
        onClose={onClose}
        visible={visibleSlider}
        placement="left"
      >
        <StyledSliderContent>
          <SliderContentUser></SliderContentUser>
          <SliderContenItemtNav></SliderContenItemtNav>
          <SliderContenItemtUser></SliderContenItemtUser>
          <SliderContenAccoount isLoggin={isLoggin} signOut={signOut}></SliderContenAccoount>
        </StyledSliderContent>
      </StyledSlider>
      <Bookmark
        isModalVisible={isModalVisibleBookmark}
        setIsModalVisible={setIsModalVisibleBookmark}
        translateMap={translateMap}
        bookmarkNode={bookmarkNode}
        setVisibleSlider={setVisibleSlider}
        HandleRemoveBookmark={HandleRemoveBookmark}
      ></Bookmark>
      <InviteCode
        isModalVisible={isModalVisibleInviteCode}
        setIsModalVisible={setIsModalVisibleInviteCode}
        inviteCodeData={inviteCodeData}
      ></InviteCode>
      <SearchModal
        isModalVisible={isModalVisibleSearch}
        defaultHexGridsRange={defaultHexGridsRange}
        setIsModalVisible={setIsModalVisibleSearch}
        setVisibleSlider={setVisibleSlider}
        translateMap={translateMap}
      ></SearchModal>
    </>
  )
})


const StyledButton = styled(animated.button)`
  position: fixed;
  left: 0;
  top: 74px;
  z-index: 1;
  border: none;
  border-top: 2px solid ${props => props.theme.colorGreen};
  border-right: 2px solid ${props => props.theme.colorGreen};
  border-bottom: 2px solid ${props => props.theme.colorGreen};
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: ${props => props.theme.colorGreen};
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
const StyledButtonMap = styled(animated.button)`
  position: fixed;
  left: 0;
  top: 162px;
  z-index: 1;
  border: none;
  border-top: 2px solid #caa2e7;
  border-right: 2px solid #caa2e7;
  border-bottom: 2px solid #caa2e7;
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: #caa2e7;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
const StyledSlider = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-content {
    background-color: #131313;
    color: #fff;
    border-right: 2px solid ${props => props.theme.colorGreen};
  }
`
const StyledSliderContent = styled.section`
  padding: 76px 0 76px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const StyledSliderCUser = styled.section`
  display: flex;
  align-items: center;
  border-right: 4px solid ${props => props.theme.colorGreen};
  padding: 8px 0;
  box-sizing: border-box;
  .arrow {
    margin-left: auto;
    margin-right: 20px;
    color: ${props => props.theme.colorGreen};
  }
`
const StyledSliderCUserInfo = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  color: #C4C4C4;
  margin-left: 12px;
`

const StyledSliderCItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 18px 0 0;
  li {
    h4 {
      font-family: ${props => props.theme.fontFamilyZH};
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 18px;
      color: rgba(196, 196, 196, 0.4);
      padding: 0 0 8px 0;
      margin: 0;
    }
    a {
      font-family: ${props => props.theme.fontFamilyZH};
      padding: 8px 0 8px 12px;
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #C4C4C4;
      transition: all .2s;
      text-align: left;
      &:hover {
        color: ${props => props.theme.colorGreen};
        background: rgba(245, 245, 245, 0.1);
      }
      &.disabled {
        opacity: .4;
        &:hover {
          color: #C4C4C4;
          background: transparent;
        }
      }
      span {
        margin-right: 8px;
        &.right {
          margin-right: 0;
          margin-left: 8px;
        }
      }
    }
  }
`

const StyledSliderCAccount = styled.section`
padding: 0 18px 0 0;
margin: auto 0 0 0;
`
const StyledSliderCAccountButton = styled.button`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 8px 16px;
  background: #131313;
  box-shadow: inset 0px 1px 0px rgba(196, 196, 196, 0.2);
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  span {
    margin-right: 24px;
  }
`

const StyledCount = styled.span`
  display: inline-block;
  background: #CAF12E;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-family: ${props => props.theme.fontFamilyEN};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #131313;
  margin-left: 30px;
`

export default ToggleSlider
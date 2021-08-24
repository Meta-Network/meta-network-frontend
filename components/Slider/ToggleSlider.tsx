import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  StyledSliderCAccount, StyledSliderCAccountButton, StyledCount,
  StyledButton, StyledButtonMap, StyledSlider,
  StyledSliderContent, StyledSliderCUser, StyledSliderCUserInfo,
  StyledSliderCItem
} from './Style'
import SliderContenAccoount from './SliderContenAccoount'
import SliderContenItemtUser from './SliderContenItemtUser'
import SliderContenItemtNav from './SliderContenItemtNav'
import SliderContentUser from './SliderContentUser'
import SliderToggle from './SliderToggle'

interface Props {
  readonly bookmarkNode: hexGridsByFilterState[]
  readonly defaultHexGridsRange: PointScopeState
  translateMap: ({ x, y, z }: { x: number, y: number, z: number }) => void
  HandleRemoveBookmark: (value: hexGridsByFilterState[]) => void
  HandlePosition: () => void
}


const ToggleSlider: React.FC<Props> = React.memo(function ToggleSlider({ translateMap, bookmarkNode, defaultHexGridsRange, HandleRemoveBookmark, HandlePosition }) {
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
  // const animatedStylesMenu = useSpring({
  //   from: { x: -60, opacity: 0 },
  //   to: { x: 0, opacity: 1 },
  //   config: {
  //     duration: 300
  //   }
  // })

  const animatedStylesId = useSpring({
    from: { x: -60, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: {
      duration: 300
    },
    delay: 100
  })

  const Toggle = () => {
    setVisibleSlider(!visibleSlider);
  };

  const signOut = useCallback(
    async () => {
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
    }, [router]
  )

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

  return (
    <>
      <StyledSlider
        visible={visibleSlider}
        className="slider"
      >
        <StyledButtonMap onClick={HandlePosition} style={{ ...animatedStylesId }}>
          <EnvironmentOutlined />
        </StyledButtonMap>
        <StyledSliderContent visible={visibleSlider}>
          <SliderContentUser visible={visibleSlider} isLoggin={isLoggin} user={user}></SliderContentUser>
          <SliderContenItemtNav visible={visibleSlider} setIsModalVisibleSearch={setIsModalVisibleSearch} setIsModalVisibleBookmark={setIsModalVisibleBookmark}></SliderContenItemtNav>
          <SliderContenItemtUser visible={visibleSlider} isLoggin={isLoggin} inviteCodeData={inviteCodeData} setIsModalVisibleInviteCode={setIsModalVisibleInviteCode}></SliderContenItemtUser>
          <SliderContenAccoount visible={visibleSlider} isLoggin={isLoggin} signOut={signOut}></SliderContenAccoount>
          <SliderToggle visible={visibleSlider} Toggle={Toggle}></SliderToggle>
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

export default ToggleSlider
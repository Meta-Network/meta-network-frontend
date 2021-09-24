import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { assign, cloneDeep } from 'lodash'

import { useUser } from '../../hooks/useUser'
import { accountsTokenDelete } from '../../services/ucenter'
import Bookmark from '../Bookmark/Index'
import InviteCode from '../InviteCode/Index'
import SearchModal from '../SearchModal/Index'
import { hexGridsByFilterState, PointScopeState } from '../../typings/metaNetwork.d'
import { InviitationsMineState } from '../../typings/ucenter.d'
import { PointState, translateMapState } from '../../typings/node.d'
import { fetchInviteCodeAPI } from '../../helpers/index'
import {
  StyledSlider, StyledSliderContent
} from './Style'
import SliderContenAccoount from './SliderContenAccoount'
import SliderContenItemtUser from './SliderContenItemtUser'
import SliderContenItemtNav from './SliderContenItemtNav'
import SliderContentUser from './SliderContentUser'
import SliderLogo from './SliderLogo'
import SliderContenItemtSetting from './SliderContenItemtSetting'
import SliderToggle from './SliderToggle'
import { useTranslation } from 'next-i18next'

import useToast from '../../hooks/useToast'
import { keyFormat } from '../../utils'
import SliderMore from './SliderMore'

interface Props {
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly bookmark: PointState[]
  readonly defaultHexGridsRange: PointScopeState
  readonly hexGridsMineData: hexGridsByFilterState
  translateMap: (value: translateMapState) => void
  HandleRemoveBookmark: (value: hexGridsByFilterState[]) => void
}


const ToggleSlider: React.FC<Props> = React.memo(function ToggleSlider({
  allNodeMap, bookmark, hexGridsMineData,
  translateMap, defaultHexGridsRange, HandleRemoveBookmark
}) {
  const { t } = useTranslation('common')

  // 显示侧边栏
  const [visibleSlider, setVisibleSlider] = useState(false)
  const { user, isLoggin } = useUser()
  const router = useRouter()
  const { Toast } = useToast()

  // 收藏
  const [isModalVisibleBookmark, setIsModalVisibleBookmark] = useState<boolean>(false)
  // 邀请码
  const [isModalVisibleInviteCode, setIsModalVisibleInviteCode] = useState<boolean>(false)
  // 邀请码
  const [inviteCodeData, setInviteCodeData] = useState<InviitationsMineState[]>([])
  // 搜索
  const [isModalVisibleSearch, setIsModalVisibleSearch] = useState<boolean>(false)

  /**
   * 收藏坐标点 合并数据后
   */
  const bookmarkNode = useMemo(() => {
    let _bookmark = cloneDeep(bookmark)

    for (let i = 0; i < _bookmark.length; i++) {
      const ele = _bookmark[i]
      const { x, y, z } = ele
      const _node = allNodeMap.get(keyFormat({ x, y, z }))
      if (_node) {
        assign(ele, _node)
      }
    }
    // console.log('_bookmark', _bookmark)

    return _bookmark.reverse() as hexGridsByFilterState[]
  }, [allNodeMap, bookmark])

  /**
   * 退出登录
   */
  const signOut = useCallback(
    async () => {
      try {
        const res = await accountsTokenDelete()
        if (res.statusCode === 200) {
          Toast({ content: t('sign-out-successfully') })
          router.reload()
        } else {
          throw new Error(res.message)
        }
      } catch (e: any) {
        console.log(e)
        Toast({ content: (e.message).toString(), type: 'warning' })
      }
    }, [router, Toast, t]
  )

  /**
   * 获取邀请码
   */
  const fetchInviteCodeFn = useCallback(
    async () => {
      const res = await fetchInviteCodeAPI()
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
        <StyledSliderContent>
          <SliderLogo
            visible={visibleSlider}
            isLoggin={isLoggin} user={user}
            signOut={signOut}></SliderLogo>
          <SliderContentUser
            visible={visibleSlider}
            isLoggin={isLoggin}
            user={user}
            signOut={signOut}></SliderContentUser>
          <SliderContenItemtNav
            visible={visibleSlider}
            isLoggin={isLoggin}
            setIsModalVisibleSearch={setIsModalVisibleSearch}
            setIsModalVisibleBookmark={setIsModalVisibleBookmark}></SliderContenItemtNav>
          <SliderContenItemtUser
            visible={visibleSlider}
            isLoggin={isLoggin}
            inviteCodeData={inviteCodeData}
            hexGridsMineData={hexGridsMineData}
            setIsModalVisibleInviteCode={setIsModalVisibleInviteCode}
            translateMap={translateMap}
          ></SliderContenItemtUser>
          <SliderContenItemtSetting
            visible={visibleSlider}
          ></SliderContenItemtSetting>
          <SliderMore visible={visibleSlider} />
          <SliderToggle visible={visibleSlider} Toggle={() => setVisibleSlider(!visibleSlider)}></SliderToggle>
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
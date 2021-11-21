import React, { useMemo, useCallback } from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import { StyledCount, StyledSliderCItem, StyledSliderSpace } from './Style'
import { SliderShareIcon, SliderHexagonIcon, SliderInviteIcon, SliderSpaceIcon } from '../Icon/Index'
import { InviitationsMineState } from '../../typings/ucenter.d'
import { translateMapState } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { isEmpty } from 'lodash'


interface SliderContenItemtUserProps {
  readonly isLogin: boolean
  readonly inviteCodeData: InviitationsMineState[]
  readonly visible: boolean
  readonly hexGridsMineData: hexGridsByFilterState
  setIsModalVisibleInviteCode: (val: boolean) => void
  translateMap: (value: translateMapState) => void
}

// 侧边栏 菜单 用户
const SliderContenItemtUser: React.FC<SliderContenItemtUserProps> = React.memo(function SliderContenItemtUser({
  isLogin, inviteCodeData, hexGridsMineData, setIsModalVisibleInviteCode,
  visible, translateMap
}) {
  const { t } = useTranslation('common')

  console.log('SliderContenItemtUser', isLogin, inviteCodeData)

  // 有效邀请码
  const validCodeCount = useMemo(() => {
    let list = inviteCodeData.filter(i => Number(i.invitee_user_id) <= 0)
    return list.length
  }, [inviteCodeData])

  const openUrl = useCallback(
    () => {
      if (isLogin) {
        window.open(process.env.NEXT_PUBLIC_META_CMS_URL, '_blank')
      }
    }, [ isLogin ])

  const openUrlMySpace = useCallback(
    () => {
      if (isLogin) {
        if (hexGridsMineData.subdomain) {
          window.open(`https://${hexGridsMineData.subdomain}`, '_blank')
        }
      }
    }, [ isLogin, hexGridsMineData ])

  const handleMySpace = () => {
    if (!hexGridsMineData.subdomain) {
      return
    }

    translateMap({
      point: {
        x: hexGridsMineData.x,
        y: hexGridsMineData.y,
        z: hexGridsMineData.z
      },
      scale: 2.8,
      callback: openUrlMySpace,
      duration: 800
    })
  }

  const handleManagementSpace = () => {
    if (!hexGridsMineData.subdomain) {
      return
    }

    translateMap({
      point: {
        x: hexGridsMineData.x,
        y: hexGridsMineData.y,
        z: hexGridsMineData.z
      },
      scale: 2.8,
      callback: openUrl,
      duration: 800
    })
  }

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>{t('personal')}</h4>
        </li> : null
      }
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('my-meta-space')} placement="right">
          <StyledSliderSpace
            visible={visible}
            className={ (isLogin && hexGridsMineData.subdomain) ? '' : 'disabled'}
            href="javascript:;"
            onClick={() => handleMySpace()}>
            <SliderHexagonIcon className="space-icon" />
            {visible ? t('my-meta-space') : ''}
            <SliderShareIcon className="space-link-icon" />
          </StyledSliderSpace>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('site-management')} placement="right">
          <a
            className={(isLogin && hexGridsMineData.subdomain) ? '' : 'disabled'}
            href="javascript:;"
            onClick={() => handleManagementSpace()}>
            <SliderSpaceIcon />
            {visible ? t('site-management') : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('invitation-code')} placement="right">
          <a
            href="javascript:;"
            onClick={() => isLogin && setIsModalVisibleInviteCode(true)}
            className={isLogin ? '' : 'disabled'}>
            <SliderInviteIcon />
            {visible ? t('invitation-code') : ''}
            {
              isLogin && visible ?
                <StyledCount>{validCodeCount}</StyledCount> : null
            }
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
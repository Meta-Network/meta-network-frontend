import React from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import { StyledCount, StyledSliderCItem } from './Style'
import { ArrowTopLeftIcon, InviteIcon, BookmarkIcon } from '../Icon/Index'
import { InviitationsMineState } from '../../typings/ucenter.d'

interface SliderContenItemtUserProps {
  readonly isLoggin: boolean
  readonly inviteCodeData: InviitationsMineState[]
  readonly visible: boolean
  setIsModalVisibleInviteCode: (val: boolean) => void
  setIsModalVisibleBookmark: (val: boolean) => void
}

// 侧边栏 菜单 用户
const SliderContenItemtUser: React.FC<SliderContenItemtUserProps> = React.memo(function SliderContenItemtUser({
  isLoggin, inviteCodeData, setIsModalVisibleInviteCode,
  visible, setIsModalVisibleBookmark
}) {
  const { t } = useTranslation('common')

  console.log('SliderContenItemtUser', isLoggin, inviteCodeData)

  return (
    <StyledSliderCItem visible={visible}>
      <li>
        <h4>{t('personal')}</h4>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('my-bookmark')} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
            <BookmarkIcon />
            {visible ? t('my-bookmark') : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('site-management')} placement="right">
          <a
            href={isLoggin ? 'https://meta-cms.vercel.app' : 'javascript:;'}
            className={isLoggin ? '' : 'disabled'}
            target="_blank"
            rel="noopener noreferrer">
            <ArrowTopLeftIcon />
            {visible ? t('site-management') : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('invitation-code')} placement="right">
          <a
            href="javascript:;"
            onClick={() => isLoggin && setIsModalVisibleInviteCode(true)}
            className={isLoggin ? '' : 'disabled'}>
            <InviteIcon />
            {visible ? t('invitation-code') : ''}
            {
              isLoggin && visible ?
                <StyledCount>{inviteCodeData.length}</StyledCount> : null
            }
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
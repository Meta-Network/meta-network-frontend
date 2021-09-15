import React from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'
import { SliderHomeIcon, InviteIcon, BookmarkIcon } from '../Icon/Index'

import { StyledSliderCItem, StyledSliderSpace } from './Style'
import { SearchIcon, SwitchVerticalIcon, SliderShareIcon } from '../Icon/Index'

interface SliderContenItemtNavProps {
  readonly visible: boolean
  readonly isLoggin: boolean
  setIsModalVisibleSearch: (val: boolean) => void
  setIsModalVisibleBookmark: (val: boolean) => void
}

// 侧边栏 菜单 导航
const SliderContenItemtNav: React.FC<SliderContenItemtNavProps> = React.memo(function SliderContenItemtNav({
  isLoggin, setIsModalVisibleSearch, visible, setIsModalVisibleBookmark
}) {
  const { t } = useTranslation('common')

  const openUrl = () => {
    if (isLoggin) {
      window.open(process.env.NEXT_PUBLIC_META_CMS_URL, '_blank')
    }
  }

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>{t('slider-navigation')}</h4>
        </li> : null
      }
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('my-meta-space')} placement="right">
          <StyledSliderSpace
            className={ isLoggin ? '' : 'disabled'}
            href="javascript:;" onClick={() => openUrl()}>
            <SliderHomeIcon />
            {visible ? t('my-meta-space') : ''}
            <SliderShareIcon className="space-icon" />
          </StyledSliderSpace>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('search')} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchIcon />
            {visible ? t('search') : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('favorites')} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
            <BookmarkIcon />
            {visible ? t('favorites') : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('switch-ID-layer')} placement="right">
          <a href="javascript:;" className="disabled">
            <SwitchVerticalIcon />
            {visible ? t('switch-ID-layer') : ''}
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtNav
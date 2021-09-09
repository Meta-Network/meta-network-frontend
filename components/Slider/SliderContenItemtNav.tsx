import React from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import { StyledSliderCItem } from './Style'
import { SearchIcon, SwitchVerticalIcon } from '../Icon/Index'

interface SliderContenItemtNavProps {
  readonly visible: boolean
  setIsModalVisibleSearch: (val: boolean) => void
}

// 侧边栏 菜单 导航
const SliderContenItemtNav: React.FC<SliderContenItemtNavProps> = React.memo(function SliderContenItemtNav({
  setIsModalVisibleSearch, visible
}) {
  const { t } = useTranslation('common')

  console.log('SliderContenItemtNav')

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>{t('slider-navigation')}</h4>
        </li> : null
      }
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('search')} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchIcon />
            {visible ? t('search') : ''}
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
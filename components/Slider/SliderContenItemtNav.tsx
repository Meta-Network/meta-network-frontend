import React from 'react'
import { Tooltip } from 'antd'
import { isMobile } from "react-device-detect"

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
  console.log('SliderContenItemtNav')
  return (
    <StyledSliderCItem visible={visible}>
      <li>
        <h4>导航</h4>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : '搜索'} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchIcon />
            {visible ? '搜索' : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : '切换 ID层'} placement="right">
          <a href="javascript:;" className="disabled">
            <SwitchVerticalIcon />
            {visible ? '切换 ID层' : ''}
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtNav
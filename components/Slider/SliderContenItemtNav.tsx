import React from 'react';
import { Tooltip } from 'antd';

import { StyledSliderCItem } from './Style'
import { SearchIcon, SwitchVerticalIcon, BookmarkIcon } from '../Icon/Index'

interface SliderContenItemtNavProps {
  readonly visible: boolean
  setIsModalVisibleSearch: (val: boolean) => void
  setIsModalVisibleBookmark: (val: boolean) => void
}

// 侧边栏 菜单 导航
const SliderContenItemtNav: React.FC<SliderContenItemtNavProps> = React.memo(function SliderContenItemtNav({
  setIsModalVisibleSearch, setIsModalVisibleBookmark, visible
}) {
  console.log('SliderContenItemtNav')
  return (
    <StyledSliderCItem visible={visible}>
      <li>
        <h4>导航</h4>
      </li>
      <li>
        <Tooltip title={visible ? '' : '搜索'} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchIcon />
            {visible ? '搜索' : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={visible ? '' : '切换 ID层'} placement="right">
          <a href="javascript:;" className="disabled">
            <SwitchVerticalIcon />
            {visible ? '切换 ID层' : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={visible ? '' : '我的收藏'} placement="right">
          <a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
            <BookmarkIcon />
            {visible ? '我的收藏' : ''}
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtNav
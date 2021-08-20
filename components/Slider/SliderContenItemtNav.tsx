import React from 'react';

import { StyledSliderCItem } from './Style'
import { SearchIcon, SwitchVerticalIcon, BookmarkIcon } from '../Icon/Index'

interface SliderContenItemtNavProps {
  setIsModalVisibleSearch: (val: boolean) => void
  setIsModalVisibleBookmark: (val: boolean) => void
}

// 侧边栏 菜单 导航
const SliderContenItemtNav: React.FC<SliderContenItemtNavProps> = React.memo(function SliderContenItemtNav ({ setIsModalVisibleSearch, setIsModalVisibleBookmark }) {
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
})

export default SliderContenItemtNav
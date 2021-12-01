import React from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'
import { BookmarkIcon } from '../Icon/Index'

import { StyledSliderCItem } from './Style'
import { SearchIcon } from '../Icon/Index'

interface Props {
  readonly visible: boolean
  readonly isLogin: boolean
  setIsModalVisibleSearch: (val: boolean) => void
  setIsModalVisibleBookmark: (val: boolean) => void
}

// 侧边栏 菜单 导航
const SliderItemNav: React.FC<Props> = React.memo(function SliderItemNav({
	isLogin, setIsModalVisibleSearch, visible, setIsModalVisibleBookmark
}) {
	const { t } = useTranslation('common')

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
				<Tooltip title={(visible || isMobile) ? '' : t('favorites')} placement="right">
					<a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
						<BookmarkIcon />
						{visible ? t('favorites') : ''}
					</a>
				</Tooltip>
			</li>
			{/* <li>
        <Tooltip title={(visible || isMobile) ? '' : t('switch-ID-layer')} placement="right">
          <a href="javascript:;" className="disabled">
            <SwitchVerticalIcon />
            {visible ? t('switch-ID-layer') : ''}
          </a>
        </Tooltip>
      </li> */}
		</StyledSliderCItem>
	)
})

export default SliderItemNav
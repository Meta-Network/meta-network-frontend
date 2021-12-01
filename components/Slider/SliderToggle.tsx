import React from 'react'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { StyledSliderToggle, StyledSliderBtn } from './Style'

interface Props {
  readonly visible: boolean
  Toggle: () => void
}

const SliderToggle: React.FC<Props> = React.memo(function SliderToggle({
	Toggle, visible
}) {
	return (
		<StyledSliderToggle visible={visible}>
			<StyledSliderBtn onClick={() => Toggle()}>
				{
					visible
						? <MenuFoldOutlined />
						: <MenuUnfoldOutlined />
				}
			</StyledSliderBtn>
		</StyledSliderToggle>
	)
})

export default SliderToggle
import React, { useCallback, useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useTranslation } from 'next-i18next'
import { getZoomPercentage } from '../../helpers/index'

interface Props { }

/**
 * 缩放统计
 * @returns
 */
const MapZoom: React.FC<Props> = React.memo(function MapZoom({ }) {
	const { t } = useTranslation('common')
	const [value, setValue] = useState<number>(0)

	const [styles, api] = useSpring(() => ({
		x: 40,
		opacity: 0,
		config: {
			duration: 300
		}
	}))

	/**
   * 处理缩放
   */
	const handleScale = useCallback(() => {
		const percentage = getZoomPercentage()
		setValue(percentage)
	}, [])


	useEffect(() => {
		const timer = setInterval(handleScale, 4000)
		const timerShow = setTimeout(() => {
			api.start({ x: 0, opacity: 1 })
		}, 3600)

		return () => {
			clearInterval(timer)
			clearInterval(timerShow)
		}
	}, [handleScale, api])

	return (
		<Tooltip title={t('zoom-percentage')} placement="left">
			<StyledText style={styles}>
				{value}%
			</StyledText>
		</Tooltip>
	)
})

const StyledText = styled(animated.span)`
  position: fixed;
  right: 20px;
  bottom: 10px;
  font-size: 14px;
  color: #F5F5F5;
  font-family: ${props => props.theme.fontFamilyEN};
  z-index: 8;
  user-select: none;
`

export default MapZoom
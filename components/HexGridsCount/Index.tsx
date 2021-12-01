import React, { useCallback, useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import AnimatedNumber from 'animated-number-react'
import { useTranslation } from 'next-i18next'

import { PointScopeState } from '../../typings/metaNetwork'
import { fetchHexGridsCountByFilterAPI } from '../../helpers/index'

interface Props {
  readonly range: PointScopeState
}

/**
 * 统计所有坐标点数量
 * @param param0
 * @returns
 */
const HexGridsCount: React.FC<Props> = React.memo( function HexGridsCount ({ range }) {
	// 统计所有坐标点
	const [hexGridsCountData, setHexGridsCountData] = useState<number>(0)
	const { t } = useTranslation('common')

	const [ styles, api ] = useSpring(() => ({
		x: 40,
		opacity: 0,
		config: {
			duration: 300
		} }))


	// 获取所有坐标点统计
	const fetchHexGridsCountByFilterFn = useCallback(async () => {
		const res = await fetchHexGridsCountByFilterAPI(range)
		setHexGridsCountData(res)
	}, [ range ])


	useEffect(() => {
		const timer = setInterval(fetchHexGridsCountByFilterFn, 10 * 1000)
		const timerShow = setTimeout(() => {
			api.start({ x: 0, opacity: 1 })
			fetchHexGridsCountByFilterFn()
		}, 3200)

		return () => {
			clearInterval(timer)
			clearInterval(timerShow)
		}
	}, [api, fetchHexGridsCountByFilterFn])

	return (
		<Tooltip title={t('coordinate-count')} placement="left">
			<StyledText style={styles}>
				<AnimatedNumber
					value={hexGridsCountData}
					formatValue={(value: number) => value.toFixed(0)}
				/>
			</StyledText>
		</Tooltip>
	)
})

const StyledText = styled(animated.span)`
  position: fixed;
  right: 20px;
  bottom: 40px;
  font-size: 14px;
  color: #F5F5F5;
  font-family: ${props => props.theme.fontFamilyEN};
  z-index: 8;
  user-select: none;
`

export default HexGridsCount
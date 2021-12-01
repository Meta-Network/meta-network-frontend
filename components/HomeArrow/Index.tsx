/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { isEmpty } from 'lodash'
import { useTranslation } from 'next-i18next'
import { useSpring, animated } from 'react-spring'
import {
	angle, isInViewPort
} from '../../utils/index'
import { hexGridsByFilterState } from '../../typings/metaNetwork'


interface Props {
  readonly hexGridsMineData: hexGridsByFilterState
}

/**
 * 指向自己的坐标箭头
 * @param param0
 * @returns
 */
const HomeArrow: React.FC<Props> = React.memo(function HomeArrow ({ hexGridsMineData }) {
	const { t } = useTranslation('common')
	const homeArrow = useRef<HTMLDivElement>(null)
	// 箭头角度
	// 自己的坐标是否在屏幕内
	const [inViewPortHexagonOwner, setInViewPortHexagonOwner] = useState<boolean | undefined>()
	// console.log('inViewPortHexagonOwner', inViewPortHexagonOwner)

	/**
   * 是否显示
   */
	const isShow = useMemo(() => {
		return (!inViewPortHexagonOwner && inViewPortHexagonOwner !== undefined && !isEmpty(hexGridsMineData))
	}, [ inViewPortHexagonOwner, hexGridsMineData ])

	const [styles, api] = useSpring(() => ({
		x: 40,
		opacity: 0,
		transform: '',
		config: {
			duration: 300
		}
	}))

	/**
   * 计算箭头角度
   */
	const calcAngle = useCallback(
		() => {

			const tag = document.querySelector<HTMLElement>('.hexagon-owner')
			const inViewPortResult = isInViewPort(tag!)
			setInViewPortHexagonOwner(inViewPortResult)

			// console.log('tag', tag, inViewPortResult)

			// 在窗口内不计算 undefined 不计算
			// 没有坐标点不计算
			if (
				(inViewPortResult || inViewPortResult === undefined)
        || isEmpty(hexGridsMineData)
			) {
				//
			} else {
				// 没有 DOM 不计算, 没有 DOM getBoundingClientRect 不计算
				// 如果没有 DOM isInViewPort 方法里面会返回 undefined 在上面拦截

				const { x, y, width: domWidth, height: domHeight } = tag!.getBoundingClientRect()
				const _width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
				const _height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

				let CoordinateStart = {
					x: _width,
					y: _height
				}
				const CoordinateEnd = {
					x: x + (domWidth / 2),
					y: y + (domHeight / 2)
				}

				if (homeArrow.current) {
					const { x: homeArrowX, y: homeArrowY, width: homeArrowW, height: homeArrowH } = homeArrow!.current.getBoundingClientRect()
					CoordinateStart = { x: homeArrowX + homeArrowW / 2, y: homeArrowY + homeArrowH / 2 }
				}

				const angleResult = angle(
					CoordinateStart,
					CoordinateEnd
				)

				try {
					// TODO：仍然会报错
					api.start({ transform: `rotate(${angleResult}deg)`, opacity: isShow ? 1 : 0 })
				} catch (e) {
					console.error(e)
				}
			}
		},
		[ hexGridsMineData, api, isShow ],
	)

	useEffect(() => {
		const timer = setInterval(calcAngle, 4000)
		const timerShow = setTimeout(() => {
			api.start({ x: 0, opacity: isShow ? 1 : 0 })
		}, 3800)

		return () => {
			clearInterval(timer)
			clearInterval(timerShow)
		}
	}, [calcAngle, api, isShow])

	return (
		<Tooltip title={ isShow ? t('my-position') : '' }>
			<StyledArrow style={styles} ref={homeArrow}>
				<img src="/images/arrow.png" alt="arrow" draggable="false" />
			</StyledArrow>
		</Tooltip>
	)
})

const StyledArrow = styled(animated.section)`
  position: fixed;
  right: 44px;
  bottom: 124px;
  width: 64px;
  height: 48px;
  user-select: none;
  cursor: pointer;
  /* transition: .02s all; */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  will-change: transform;
  user-select: none;
  -webkit-user-drag: none;
  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
  }

  @media screen and (max-width: 768px) {
    right: 10px;
    img {
      width: 80px;
      height: 80px;
    }
  }
`

export default HomeArrow
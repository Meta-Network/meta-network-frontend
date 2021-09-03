/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components'
import { Tooltip } from 'antd';
import { isEmpty } from 'lodash'
import { useMount, useUnmount } from 'ahooks'

import {
  angle, isInViewPort
} from '../../utils/index'
import { hexGridsByFilterState } from '../../typings/metaNetwork';

const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
let ID: number

interface Props {
  readonly hexGridsMineData: hexGridsByFilterState
}

/**
 * 指向自己的坐标箭头
 * @param param0
 * @returns
 */
const HomeArrow: React.FC<Props> = React.memo(function HomeArrow ({ hexGridsMineData }) {
  // 箭头角度
  const [homeAngle, setHomeAngle] = useState<number>(0)
  // 自己的坐标是否在屏幕内
  const [inViewPortHexagonOwner, setInViewPortHexagonOwner] = useState<boolean | undefined>()
  // console.log('inViewPortHexagonOwner', inViewPortHexagonOwner)

  /**
   * 箭头样式
   */
  const style = useMemo(() => ({
    transform: `rotate(${homeAngle}deg)`,
    opacity: (!inViewPortHexagonOwner && inViewPortHexagonOwner !== undefined && !isEmpty(hexGridsMineData)) ? 1 : 0
  }), [ homeAngle, inViewPortHexagonOwner, hexGridsMineData ])

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
        const angleResult = angle(
          { x: 0, y: 0 },
          {
            x: x - _width / 2 + (domWidth / 2),
            y: y - _height / 2 + (domHeight / 2)
          }
        )

        // console.log('angle', angleResult)
        setHomeAngle(angleResult)
      }

      cancelAnimationFrame(ID)
      ID = requestAnimationFrame(calcAngle)
    },
    [ hexGridsMineData ],
  )

  useMount(() => {
    ID = requestAnimationFrame(calcAngle)
  })

  useUnmount(() => {
    cancelAnimationFrame(ID)
  })

  return (
    <Tooltip title="自己坐标方位">
      <StyledArrow style={style}>
          <img src="/images/arrow.png" alt="arrow" />
      </StyledArrow>
    </Tooltip>
  )
})

const StyledArrow = styled.section`
  position: fixed;
  right: 44px;
  bottom: 124px;
  width: 80px;
  height: 60px;
  user-select: none;
  cursor: pointer;
  /* transition: .02s all; */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  will-change: transform;
  user-select: none;
  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
`

export default HomeArrow
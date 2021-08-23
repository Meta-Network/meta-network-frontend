import React, { useCallback, useState } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import AnimatedNumber from "animated-number-react";
import { useMount, useUnmount, useThrottleFn, useInViewport } from 'ahooks'

import { PointScopeState } from '../../typings/metaNetwork'
import { fetchHexGridsCountByFilter } from '../../helpers/index'

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

  const [ styles, api ] = useSpring(() => ({
    x: 40,
    opacity: 0,
    config: {
      duration: 300
  } }))

  // 获取所有坐标点统计
  const fetchHexGridsCountByFilterFn = useCallback(async () => {
    const res = await fetchHexGridsCountByFilter(range)
    if (res === hexGridsCountData) {
      return
    }
    setHexGridsCountData(res)
    api.start({ x: 0, opacity: 1 })
  }, [ range, hexGridsCountData, api ])

  useMount(() => {
    fetchHexGridsCountByFilterFn()
  })

  return (
    <Tooltip title="坐标点统计">
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
  bottom: 20px;
  font-size: 14px;
  color: #F5F5F5;
  font-family: ${props => props.theme.fontFamilyEN};
`

export default HexGridsCount
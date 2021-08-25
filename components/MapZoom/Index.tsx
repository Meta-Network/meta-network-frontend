import React, { useCallback, useState } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import AnimatedNumber from "animated-number-react";
import { useMount, useUnmount, useThrottleFn, useInViewport } from 'ahooks'

import { PointScopeState } from '../../typings/metaNetwork'
import { fetchHexGridsCountByFilter } from '../../helpers/index'

interface Props {
}

/**
 * 缩放统计
 * @returns
 */
const MapZoom: React.FC<Props> = React.memo( function MapZoom ({ }) {
  // 统计所有坐标点
  const [hexGridsCountData, setHexGridsCountData] = useState<number>(0)

  const [ styles, api ] = useSpring(() => ({
    x: 40,
    opacity: 0,
    config: {
      duration: 300
  } }))

  useMount(() => {
    api.start({ x: 0, opacity: 1 })
  })

  return (
    <Tooltip title="缩放百分比" placement="left">
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
  bottom: 10px;
  font-size: 14px;
  color: #F5F5F5;
  font-family: ${props => props.theme.fontFamilyEN};
`

export default MapZoom
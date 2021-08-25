import React, { useCallback, useState } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useMount } from 'ahooks'

import { amountSplit } from '../../utils/index'

interface Props {}

/**
 * 缩放统计
 * @returns
 */
const MapZoom: React.FC<Props> = React.memo( function MapZoom ({ }) {

  const [value, setValue] = useState<Number>(0);

  const [ styles, api ] = useSpring(() => ({
    x: 40,
    opacity: 0,
    config: {
      duration: 300
    }
  }))

  const handleScale = useCallback(() => {
    const dom = document.querySelector<HTMLElement>('#container svg g')

    if (dom) {
      const transformScale = dom.getAttribute('transform')
      const transformScaleMatch =  transformScale?.match('scale\(.*\)')
      const transformScaleValue = transformScaleMatch?.length ? Number(transformScaleMatch[0].slice(6, -1)) : 1
      // console.log('transformScaleValue', transformScaleValue)

      // (4 - 1)     3
      const scale = 3 / 100
      let percentage = 0
      if (transformScaleValue > 1) {
        percentage = (transformScaleValue - 1) / scale
      } else if (transformScaleValue < 1) {
        percentage = - (transformScaleValue / scale)
      } else {
      }
      // console.log('percentage', percentage)
      setValue( Number(amountSplit(String(percentage), 2)) )
    }

    window.requestAnimationFrame( handleScale )
  }, [])

  useMount(() => {
    if (process.browser) {
      const domShow = () => {
        api.start({ x: 0, opacity: 1 })
      }
      window.requestAnimationFrame( domShow )
      window.requestAnimationFrame( handleScale )
    }
  })

  return (
    <Tooltip title="缩放百分比" placement="left">
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
`

export default MapZoom
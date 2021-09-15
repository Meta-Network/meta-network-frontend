import React, { useCallback, useState } from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useMount, useUnmount } from 'ahooks'
import { useTranslation } from 'next-i18next'

import { amountSplit } from '../../utils/index'
import { getZoomPercentage } from '../../helpers/index'

/**
 * requestAnimationFrame
 * cancelAnimationFrame
 */
const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
(window as any).webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
let ID: number
let IDAnimation: number

interface Props {}

/**
 * 缩放统计
 * @returns
 */
const MapZoom: React.FC<Props> = React.memo( function MapZoom ({ }) {
  const { t } = useTranslation('common')
  const [value, setValue] = useState<Number>(0)

  const [ styles, api ] = useSpring(() => ({
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
    let percentage = getZoomPercentage()
    setValue( percentage )

    cancelAnimationFrame(ID)
    ID = requestAnimationFrame( handleScale )
  }, [])

  useMount(() => {
    if (process.browser) {
      const domShow = () => {
        api.start({ x: 0, opacity: 1 })
      }
      IDAnimation = requestAnimationFrame( domShow )
      ID = requestAnimationFrame( handleScale )
    }
  })

  useUnmount(() => {
    cancelAnimationFrame(IDAnimation)
    cancelAnimationFrame(ID)
  })

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
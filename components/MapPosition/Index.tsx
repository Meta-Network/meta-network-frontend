import React, { useEffect } from 'react'
import { Tooltip } from 'antd'
import {
  EnvironmentOutlined
} from '@ant-design/icons'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useTranslation } from 'next-i18next'

interface Props {
  HandlePosition: () => void
}

const MapPosition: React.FC<Props> = React.memo(function MapPosition({ HandlePosition }) {
  const { t } = useTranslation('common')

  const [styles, api] = useSpring(() => ({
    x: 60,
    opacity: 0,
    config: {
      duration: 300
    }
  }))

  useEffect(() => {
    const timerShow = setTimeout(() => {
      api.start({ x: 0, opacity: 1 })
    }, 3000)

    return () => clearInterval(timerShow)
  }, [api])

  return (
    <Tooltip title={t('position')} placement="left">
      <StyledButtonMap onClick={HandlePosition} style={{ ...styles }}>
        <EnvironmentOutlined />
      </StyledButtonMap>
    </Tooltip>
  )
})

export const StyledButtonMap = styled(animated.button)`
  position: fixed;
  right: 10px;
  bottom: 60px;
  z-index: 8;
  border: none;
  border-radius: 4px;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 10px;
  color: #caa2e7;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  & > span {
    font-size: 20px;
  }
`
export default MapPosition
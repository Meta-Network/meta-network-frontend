import React from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { StyledSliderToggle } from './Style'

interface SliderContenAccoountProps {
  readonly visible: boolean
  Toggle: () => void
}

const SliderToggle: React.FC<SliderContenAccoountProps> = React.memo(function SliderToggle({ Toggle, visible }) {
  // console.log('SliderToggle')

  return (
    <StyledSliderToggle onClick={() => Toggle()} visible={visible}>
      {
        visible
        ? <MenuFoldOutlined />
        : <MenuUnfoldOutlined />
      }
    </StyledSliderToggle>
  )
})

export default SliderToggle
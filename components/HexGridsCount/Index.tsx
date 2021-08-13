import React from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import AnimatedNumber from "animated-number-react";

interface Props {
  readonly count: number
}

/**
 * 统计所有坐标点数量
 * @param param0
 * @returns
 */
const HexGridsCount: React.FC<Props> = ({ count }) => {

  const textAnimatedStyles = useSpring({
    from: { x: 40, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: {
      duration: 300
    }
  })

  return (
    <Tooltip title="坐标点统计">
      <StyledText style={textAnimatedStyles}>
        <AnimatedNumber
          value={count}
          formatValue={(value: number) => value.toFixed(0)}
        />
      </StyledText>
    </Tooltip>
  )
}

const StyledText = styled(animated.span)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  font-size: 14px;
  color: #F5F5F5;
  font-family: ${props => props.theme.fontFamilyEN};
`

export default HexGridsCount
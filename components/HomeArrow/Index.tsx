/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components'
import { Tooltip } from 'antd';

interface Props {
  readonly angleValue: number
  HandleResetOwnerPosition: () => void
}

/**
 * 指向自己的坐标箭头
 * @param param0
 * @returns
 */
const HomeArrow: React.FC<Props> = ({ angleValue = 0, HandleResetOwnerPosition }) => {
  return (
    <Tooltip title="自己坐标方位">
      <StyledArrow style={{ transform: `rotate(${angleValue}deg)` }} onClick={HandleResetOwnerPosition}>
          <img src="/images/arrow.png" alt="arrow" />
      </StyledArrow>
    </Tooltip>
  )
}

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
  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
`

export default HomeArrow
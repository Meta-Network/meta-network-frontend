import React, { useCallback } from 'react';
import styled from 'styled-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { animated } from 'react-spring'
import { isEmpty } from 'lodash';
import { message } from 'antd'
import { CircleWarningIcon, CircleEmptyIcon } from '../Icon/Index'

import { useUser } from '../../hooks/useUser'

interface Props {
  readonly status: boolean
  readonly style: any
  setNoticeBardOccupiedState: (value: boolean) => void
}

const NoticeBardOccupied: React.FC<Props> = ({ status, setNoticeBardOccupiedState, style }) => {
  const { user } = useUser()

  const ToggleState = useCallback((e: any) => {

    e.stopPropagation()

    if (isEmpty(user)) {
      message.info('请登录')
      return
    }
    setNoticeBardOccupiedState(!status)
  }, [ user, status, setNoticeBardOccupiedState ])

  return (
    <StyledMessageRelative style={style}>
      {
        status ? <CircleEmptyIcon /> : <CircleWarningIcon />
      }
      {/* 140 - 12 + 40 */}
      <StyledText>
        {
          status ? '首先，请认领一块空白的地块' : '现在就开始建立你在元宇宙网络的个人站点吧！'
        }
      </StyledText>
      <StyledMessageButton
        status={status}
        onClick={(e: any) => ToggleState(e)}>
          { status ? '放弃创建' : '开始创建' }
        </StyledMessageButton>
    </StyledMessageRelative>
  )
}

const StyledMessageRelative = styled(animated.section)`
  position: fixed;
  background-color: #2C2B2A;
  left: 50%;
  top: 40px;
  z-index: 10;
  transform: translate(-50%, 0);
  padding: 0 0 0 16px;
  box-shadow: 0px 2px 10px 20px rgba(19, 19, 19, 0.15), inset 0px -4px 10px rgba(19, 19, 19, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colorGreen};
  @media screen and (max-width: 768px) {
    max-width: 92%;
    min-width: 92%;
  }
`
const StyledText = styled.span`
  color: ${props => props.theme.colorGreen};
  /* padding-right: 40px; */
  /* padding-left: 10px; */
  padding: 8px 40px 8px 10px;
  overflow: hidden;
  /* white-space: nowrap; */
  border-right: 1px solid #131313;
  @media screen and (max-width: 768px) {
    padding-right: 16px;
    padding-left: 12px;
  }
`
const StyledMessageButton = styled.button<{ status: boolean }>`
  border-radius: 0 4px 4px 0;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${props => props.theme.colorGreen};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  box-sizing: border-box;
  padding: 0 40px;
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color:  ${props => props.status ? '#C4C4C4': props.theme.colorGreen};
  white-space: nowrap;
  @media screen and (max-width: 768px) {
    padding: 0 16px;
  }
`

export default NoticeBardOccupied
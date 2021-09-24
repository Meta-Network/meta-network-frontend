import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { useTranslation } from 'next-i18next'

import { CircleWarningIcon, CircleSuccessIcon } from '../Icon/Index'
import { useUser } from '../../hooks/useUser'
import useToast from '../../hooks/useToast'

interface Props {}

const NoticeBardOccupied: React.FC<Props> = ({ }) => {
  const { user } = useUser()
  const { Toast } = useToast()
  const { t } = useTranslation('common')

  const noticeBardOccupiedAnimatedStyles = useSpring({
    from: { x: '-50%', y: -40, opacity: 0 },
    to: { x: '-50%', y: 0, opacity: 1 },
    config: {
      duration: 300
    },
    delay: 1000
  })

  const openUrl = useCallback(
    () => {
      window.open(process.env.NEXT_PUBLIC_META_CMS_URL, '_blank')
    }, [])

  return (
    <StyledMessageRelative style={noticeBardOccupiedAnimatedStyles}>
      <StyledIconBox>
        <CircleSuccessIcon />
      </StyledIconBox>
      <StyledText>恭喜您已经占领地块</StyledText>
      <StyledMessageButton
        status={false}
        onClick={() => openUrl()}>
        立即设置
      </StyledMessageButton>
    </StyledMessageRelative>
  )
}

const StyledMessageRelative = styled(animated.section)`
  position: fixed;
  background-color: #2C2B2A;
  left: 50%;
  top: 40px;
  z-index: 11;
  transform: translate(-50%, 0);
  padding: 0 0 0 16px;
  box-shadow: 0px 2px 10px 20px rgba(19, 19, 19, 0.15), inset 0px -4px 10px rgba(19, 19, 19, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: stretch;
  color: ${props => props.theme.colorGreen};
  @media screen and (max-width: 768px) {
    max-width: 92%;
    min-width: 92%;
  }
`

const StyledIconBox = styled.section`
  display: flex;
  align-items: center;
`

const StyledText = styled.span`
  color: ${props => props.theme.colorGreen};
  /* padding-right: 40px; */
  /* padding-left: 10px; */
  padding: 8px 40px 8px 10px;
  overflow: hidden;
  white-space: nowrap;
  border-right: 1px solid #131313;
  @media screen and (max-width: 768px) {
    padding-right: 16px;
    padding-left: 12px;
    white-space: normal;
  }
`
const StyledMessageButton = styled.button<{ status: boolean }>`
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
  color:  ${props => props.status ? '#C4C4C4' : props.theme.colorGreen};
  white-space: nowrap;
  transition: all .2s;
  border-radius: 0 12px 12px 0;
  @media screen and (max-width: 768px) {
    padding: 0 16px;
  }

  @media screen and (min-width: 768px) {
    &:hover {
      background-color: #131313;
    }
  }
`

export default NoticeBardOccupied
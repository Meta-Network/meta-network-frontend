import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { useTranslation } from 'next-i18next'

import { CircleWarningIcon, CircleEmptyIcon } from '../Icon/Index'
import { useUser } from '../../hooks/useUser'
import useToast from '../../hooks/useToast'

interface Props {
  readonly status: boolean
  setNoticeBardOccupiedState: (value: boolean) => void
}

const NoticeBardOccupied: React.FC<Props> = ({ status, setNoticeBardOccupiedState }) => {
  const { user } = useUser()
  const { Toast } = useToast()
  const { t } = useTranslation('common')
  const [styles, api] = useSpring(() => ({
    x: '-50%',
    y: -40,
    opacity: 0,
    config: {
      duration: 300
    }
  }))

  const ToggleState = useCallback((e: any) => {

    e.stopPropagation()

    if (isEmpty(user)) {
      Toast({ content: t('please-sign-in'), type: 'warning' })
      return
    }
    setNoticeBardOccupiedState(!status)
  }, [user, status, setNoticeBardOccupiedState, Toast, t])

  const show = useCallback(
    () => {
      api.start({
        y: 0,
        opacity: 1
      })
    }, [api])

  useEffect(() => {
    const time = setTimeout(show, 3000)
    return () => clearTimeout(time)
  }, [show])

  return (
    <StyledMessageRelative style={styles}>
      <StyledIconBox>
        {
          status ? <CircleEmptyIcon /> : <CircleWarningIcon />
        }
      </StyledIconBox>
      {/* 140 - 12 + 40 */}
      <StyledText>
        {
          status ? t('occupy-open-prompt') : t('occupy-close-prompt')
        }
      </StyledText>
      <StyledMessageButton
        status={status}
        onClick={(e: any) => ToggleState(e)}>
        {status ? t('abandon-creation') : t('start-creating')}
      </StyledMessageButton>
    </StyledMessageRelative>
  )
}

const StyledMessageRelative = styled(animated.section)`
  position: fixed;
  background-color: #2C2B2A;
  left: 50%;
  top: 50px;
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
  .icon {
    width: 25px;
    height: 25px;
  }
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
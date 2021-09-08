import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { WechatOutlined, GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import { EmailIcon } from '../../Icon/Index'

// Toggle 登录方式
const ToggleMode: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <StyledTitle>{t('other-login')}</StyledTitle>
      <StyledList>
        <StyledItem>
          <Tooltip placement="bottom" title={`Email${t('log-in')}`}>
            <StyledItemBtn>
              <EmailIcon />
            </StyledItemBtn>
          </Tooltip>
        </StyledItem>
        <StyledItem>
          <Tooltip placement="bottom" title={t('wechat-scan-code-login')}>
            <StyledItemBtn>
              <WechatOutlined className="icon" />
            </StyledItemBtn>
          </Tooltip>
        </StyledItem>
        <StyledItem>
          <Tooltip placement="bottom" title={`GitHub${t('log-in')}`}>
            <StyledItemBtn>
              <GithubOutlined className="icon" />
            </StyledItemBtn>
          </Tooltip>
        </StyledItem>
        <StyledItem>
          <Tooltip placement="bottom" title={`Twitter${t('log-in')}`}>
            <StyledItemBtn>
              <TwitterOutlined className="icon" />
            </StyledItemBtn>
          </Tooltip>
        </StyledItem>
      </StyledList>
    </>
  )
}

const StyledTitle = styled.p`
  width: 58%;
  margin-top: 50px;
  margin-bottom: 20px;
  text-align: center;
  color: #191919;
  font-size: 14px;
  font-weight: 700;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`
const StyledList = styled.ul`
  width: 58%;
  font-size: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 576px) {
    margin: 0 auto;
  }
`
const StyledItem = styled.li`
  display: inline-block;
`
const StyledItemBtn = styled.button`
  border: none;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: #4a4a4a;
  color: #fff;
  transition: background-color 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #000;
  }
  .icon {
    font-size: 16px;
  }
  .icon-svg {
    /* svg use */
    width: 16px;
    height: 16px;
    fill: #fff;
  }
`

export default ToggleMode

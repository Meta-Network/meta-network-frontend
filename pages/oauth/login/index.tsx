import React, { useState, useMemo } from 'react';
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

import LoginAuth from '../../../assets/svg/login_auth.svg'
import ToggleMode from '../../../components/OAuth/Login/ToggleMode'
import Email from '../../../components/OAuth/Login/Email'

const OAuthLogin: React.FC = () => {
  // 登录方式
  const [mode, setMode] = useState<'email'>('email') // email ...

  // tips 根据 mode 显示
  const tips = useMemo(() => {
    let list = {
      email: '使用邮箱登录',
      wechat: '关注「Andoromeda仙女座」公众号，即可登录。'
    }
    return list[mode]
  }, [mode])

  // animated start
  const animatedDecoration = useSpring({
    from: { x: 40, opacity: 0 },
    to: { x: 0, opacity: 1 },
  })
  const animatedMain = useSpring({
    from: { x: -40, opacity: 0 },
    to: { x: 0, opacity: 1 },
  })
  // animated end

  return (
    <StyledWrapper>
      <StyledWrapperInner>
        <StyledWrapperMain style={{ ...animatedMain }}>
          <StyledWrapperContent>
            {
              mode === 'email' ? <Email></Email> : null
            }
            <ToggleMode></ToggleMode>
          </StyledWrapperContent>
          <StyledFollowPublishAccount>{ tips }</StyledFollowPublishAccount>
        </StyledWrapperMain>
        <StyledDecoration src={ LoginAuth } alt="书桌" style={{ ...animatedDecoration }} />
      </StyledWrapperInner>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff;

  @keyframes invalid {
    0% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(-6px);
    }

    50% {
      transform: translateX(0);
    }

    75% {
      transform: translateX(6px);
    }

    to {
      transform: translateX(0);
    }
  }
`

const StyledWrapperInner = styled.section`
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: 900px) {
    text-align: center;
  }
`

const StyledWrapperMain = styled(animated.section)`
  width: 346px;
  overflow: hidden;
`

const StyledWrapperContent = styled.section``

const StyledFollowPublishAccount = styled.section`
  margin-top: 30px;
  font-size: 12px;
  color: #9b9b9f;
`

const StyledDecoration = styled(animated.img)`
  margin-left: 200px;
  @media screen and (max-width: 1440px) {
    margin-left: 50px;
    width: 500px;
  }

  @media screen and (max-width: 900px) {
    display: none;
  }
`

export default OAuthLogin
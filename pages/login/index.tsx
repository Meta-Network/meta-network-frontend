import React, { useState } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

import LoginAuth from '../../assets/svg/login_auth.svg'
// import ToggleMode from '../../components/OAuth/Login/ToggleMode'
import Email from '../../components/OAuth/Login/Email'

const OAuthLogin: React.FC = () => {
  // 登录方式
  const [mode] = useState<'email'>('email') // email ...

  // tips 根据 mode 显示
  // const tips = useMemo(() => {
  // 	const list = {
  // 		email: t('login-with-email'),
  // 		wechat: t('login-with-wechat')
  // 	}
  // 	return list[mode]
  // }, [mode, t])

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
            {/* <ToggleMode></ToggleMode> */}
          </StyledWrapperContent>
          {/* <StyledFollowPublishAccount>{ tips }</StyledFollowPublishAccount> */}
        </StyledWrapperMain>
        <StyledDecoration style={{ ...animatedDecoration }}>
          <Image src={LoginAuth} alt={'Meta Network'} layout="fill" objectFit="contain" />
        </StyledDecoration>
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
  width: 400;
  overflow: hidden;
  @media screen and (max-width: 900px) {
    width: 346px;
  }
`

const StyledWrapperContent = styled.section``

// const StyledFollowPublishAccount = styled.section`
//   margin-top: 30px;
//   font-size: 12px;
//   color: #9b9b9f;
// `

const StyledDecoration = styled(animated.section)`
  position: relative;
  margin-left: 154px;
  width: 500px;
  height: 500px;
  @media screen and (max-width: 1440px) {
    margin-left: 50px;
  }

  @media screen and (max-width: 900px) {
    display: none;
  }
`
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default OAuthLogin
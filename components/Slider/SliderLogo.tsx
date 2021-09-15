import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import {
  UserOutlined,
  LeftOutlined,
  DownOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'
import Image from 'next/image'

import { StyledSliderLogo, StyledSliderCUser, StyledSliderLink, StyledSliderLinkText, StyledSliderLinkLogo } from './Style'
import { UsersMeProps } from '../../typings/ucenter'
import MetaImage from '../../assets/images/meta.png'

interface Props {
  readonly isLoggin: boolean
  readonly user: UsersMeProps
  readonly visible: boolean
  signOut: () => void
}

// 侧边栏 用户内容
const SliderLogo: React.FC<Props> = React.memo(function SliderLogo({
  user, isLoggin, visible,
  signOut
}) {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <StyledSliderLogo visible={visible}>
      <Link href="/" passHref>
        <StyledSliderLink>
          <StyledSliderLinkLogo>
            <Image src={MetaImage} alt={'logo'} layout="fill" objectFit="contain" />
          </StyledSliderLinkLogo>
          {
            visible ? <StyledSliderLinkText>Meta Network</StyledSliderLinkText> : null
          }
        </StyledSliderLink>
      </Link>
    </StyledSliderLogo>
  )
})


export default SliderLogo
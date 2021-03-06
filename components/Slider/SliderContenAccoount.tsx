import React from 'react'
import { Popconfirm } from 'antd'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { useTranslation } from 'next-i18next'

import { StyledSliderCAccount, StyledSliderCAccountButton, StyledCount } from './Style'
import { ArrowTopLeftIcon, LogoutIcon } from '../Icon/Index'

interface SliderContenAccoountProps {
  readonly isLoggin: boolean
  readonly visible: boolean
  signOut: () => void
}

// 侧边栏 内容 账户操作
const SliderContenAccoount: React.FC<SliderContenAccoountProps> = React.memo(function SliderContenAccoount({
  isLoggin, signOut, visible
}) {
  const { t } = useTranslation('common')

  console.log('SliderContenAccoount')

  return (
    <StyledSliderCAccount visible={visible}>
      {
        isLoggin
          ?
          <Tooltip title={ visible ? '' : t('sign-out') }>
            <Popconfirm placement="top" title={t('confirm-logout')} onConfirm={signOut} okText="Yes" cancelText="No">
              <StyledSliderCAccountButton className="g-red" visible={visible}>
                <LogoutIcon />
                {visible ? t('logout-account') : ''}
              </StyledSliderCAccountButton>
            </Popconfirm>
          </Tooltip>
          :
          <Tooltip title={ visible ? '' : t('log-in') }>
            <Link href="/oauth/login">
              <a>
                <StyledSliderCAccountButton className="g-green" visible={visible}>
                  <ArrowTopLeftIcon />
                  {visible ? t('go-to-register-or-login') : ''}
                </StyledSliderCAccountButton>
              </a>
            </Link>
          </Tooltip>
      }
    </StyledSliderCAccount>
  )
})

export default SliderContenAccoount
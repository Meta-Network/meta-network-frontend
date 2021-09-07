import React from 'react'
import { Popconfirm } from 'antd'
import Link from 'next/link'
import { Tooltip } from 'antd'

import { StyledSliderCAccount, StyledSliderCAccountButton, StyledCount } from './Style'
import { ArrowTopLeftIcon, LogoutIcon } from '../Icon/Index'

interface SliderContenAccoountProps {
  readonly isLoggin: boolean
  readonly visible: boolean
  signOut: () => void
}

// 侧边栏 内容 账户操作
const SliderContenAccoount: React.FC<SliderContenAccoountProps> = React.memo(function SliderContenAccoount({ isLoggin, signOut, visible }) {
  console.log('SliderContenAccoount')

  return (
    <StyledSliderCAccount visible={visible}>
      {
        isLoggin
          ?
          <Tooltip title={ visible ? '' : '登出' }>
            <Popconfirm placement="top" title={'确认登出账户？'} onConfirm={signOut} okText="Yes" cancelText="No">
              <StyledSliderCAccountButton className="g-red" visible={visible}>
                <LogoutIcon />
                {visible ? '登出账户' : ''}
              </StyledSliderCAccountButton>
            </Popconfirm>
          </Tooltip>
          :
          <Tooltip title={ visible ? '' : '登录' }>
            <Link href="/oauth/login">
              <a>
                <StyledSliderCAccountButton className="g-green" visible={visible}>
                  <ArrowTopLeftIcon />
                  {visible ? '前往注册/登录' : ''}
                </StyledSliderCAccountButton>
              </a>
            </Link>
          </Tooltip>
      }
    </StyledSliderCAccount>
  )
})

export default SliderContenAccoount
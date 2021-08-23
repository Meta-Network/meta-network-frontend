import React from 'react';
import { Popconfirm } from 'antd';
import Link from 'next/link'

import { StyledSliderCAccount, StyledSliderCAccountButton, StyledCount } from './Style'
import { ArrowTopLeftIcon, LogoutIcon } from '../Icon/Index'

interface SliderContenAccoountProps {
  readonly isLoggin: boolean
  signOut: () => void
}

// 侧边栏 内容 账户操作
const SliderContenAccoount: React.FC<SliderContenAccoountProps> = React.memo(function SliderContenAccoount ({ isLoggin, signOut }) {
  console.log('SliderContenAccoount')

  return (
    <StyledSliderCAccount>
      {
        isLoggin ?
          <Popconfirm placement="top" title={'确认登出账户？'} onConfirm={signOut} okText="Yes" cancelText="No">
            <StyledSliderCAccountButton className="g-red">
              <LogoutIcon />
              登出账户
            </StyledSliderCAccountButton>
          </Popconfirm> :
          <Link href="/oauth/login">
            <a>
              <StyledSliderCAccountButton className="g-green">
                <ArrowTopLeftIcon />
                前往注册/登录
              </StyledSliderCAccountButton>
            </a>
          </Link>
      }
    </StyledSliderCAccount>
  )
})

export default SliderContenAccoount
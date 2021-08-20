import React from 'react';
import { Avatar} from 'antd';
import {
  UserOutlined,
  LeftOutlined,
} from '@ant-design/icons'

import {  StyledSliderCUser, StyledSliderCUserInfo } from './Style'
import { UsersMeProps } from '../../typings/ucenter'

interface SliderContentUserProps {
  readonly isLoggin: boolean
  readonly user: UsersMeProps
}

// 侧边栏 用户内容
const SliderContentUser: React.FC<SliderContentUserProps> = React.memo(function SliderContentUser ({ user, isLoggin }) {
  console.log('SliderContentUser')

  return (
    <StyledSliderCUser>
      <Avatar size={40} icon={<UserOutlined />} src={user?.avatar} />
      <StyledSliderCUserInfo>
        {
          isLoggin ? user.nickname || user.username || '暂无昵称' : '[未登录]'
        }
      </StyledSliderCUserInfo>
      <LeftOutlined className="arrow" />
    </StyledSliderCUser>
  )
})

export default SliderContentUser
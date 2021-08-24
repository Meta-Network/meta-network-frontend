import React from 'react';

import { StyledCount, StyledSliderCItem } from './Style'
import { ArrowTopLeftIcon, InviteIcon } from '../Icon/Index'
import { InviitationsMineState } from '../../typings/ucenter.d'

interface SliderContenItemtUserProps {
  readonly isLoggin: boolean
  readonly inviteCodeData: InviitationsMineState[]
  readonly visible: boolean
  setIsModalVisibleInviteCode: (val: boolean) => void
}

// 侧边栏 菜单 用户
const SliderContenItemtUser: React.FC<SliderContenItemtUserProps> = React.memo(function SliderContenItemtUser ({ isLoggin, inviteCodeData, setIsModalVisibleInviteCode, visible }) {
  console.log('SliderContenItemtUser', isLoggin, inviteCodeData)

  return (
    <StyledSliderCItem visible={visible}>
      <li>
        <h4>个人</h4>
      </li>
      <li>
        <a href={ isLoggin ? 'https://meta-cms.vercel.app' : 'javascript:;' } className={isLoggin ? '' : 'disabled'} target="_blank" rel="noopener noreferrer">
          <ArrowTopLeftIcon />
          { visible ? '前往管理后台' : '' }
        </a>
      </li>
      <li>
        <a href="javascript:;" onClick={() => isLoggin && setIsModalVisibleInviteCode(true)} className={isLoggin ? '' : 'disabled'}>
          <InviteIcon />
          { visible ? '邀请码' : '' }
          {
            isLoggin && visible ?
              <StyledCount>{inviteCodeData.length}</StyledCount> : null
          }
        </a>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
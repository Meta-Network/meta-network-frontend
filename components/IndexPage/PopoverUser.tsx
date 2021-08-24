import React from 'react';
import { Popover } from 'antd';
import UserAvatar from './UserAvatar'

interface Props {
  children: React.ReactNode,
  readonly showPopover: boolean
  readonly url: string
}

const PopoverUser: React.FC<Props> = React.memo(function PopoverUser({ children, showPopover, url }) {
  return (
    <>
      {
        showPopover
          ? <Popover content={ <UserAvatar mode="follow" url={url}></UserAvatar> }>
            {children}
          </Popover>
          : <> { children } </>
      }
    </>
  )
})

export default PopoverUser
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components'

interface Props {
  url: string
}

const UserAvatar: React.FC<Props> = ({ url }) => {
  return (
    <StyledUserAvatar>
      <StyledUserAvatarImage>
        <img src={ url } alt="avatar" />
      </StyledUserAvatarImage>
      <StyledUserAvatarArrow></StyledUserAvatarArrow>
    </StyledUserAvatar>
  )
}

const StyledUserAvatar = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -150%);
  z-index: 10;
`
const StyledUserAvatarImage = styled.div`
  background-color: #fff;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 100%;
  border: 6px solid #fff;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const StyledUserAvatarArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 98%);
  border-style: solid;
  border-color: #fff transparent transparent;
  border-width: 28px 8px 0 8px;
  background-color: transparent;
`

export default UserAvatar

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components'

interface Props {
  url: string
}

const UserAvatar: React.FC<Props> = ({ url }) => {
  return (
    <StyledUserAvatar>
      <img src={ url } alt="avatar" />
    </StyledUserAvatar>
  )
}

const StyledUserAvatar = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -150%);
  z-index: 10;
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

export default UserAvatar

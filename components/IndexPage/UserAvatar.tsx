/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styled from 'styled-components'

interface Props {
  readonly url: string
}

const UserAvatar: React.FC<Props> = ({ url }) => {
  return (
    <>
      <StyledUserAvatarImage>
        {
          url ? <img src={ url } alt="avatar" /> : null
        }
      </StyledUserAvatarImage>
      <StyledUserAvatarArrow></StyledUserAvatarArrow>
    </>
  )
}

const StyledUserAvatarImage = styled.div`
  background-color: #fff;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 100%;
  border: 8px solid #fff;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media screen and (max-width: 768px) {
    width: 140px;
    height: 140px;
    border: 5px solid #fff;
  }
`

const StyledUserAvatarArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 99%);
  border-style: solid;
  border-color: #fff transparent transparent;
  border-width: 28px 8px 0 8px;
  background-color: transparent;
  @media screen and (max-width: 768px) {
    border-width: 24px 6px 0 6px;
  }
`

export default UserAvatar

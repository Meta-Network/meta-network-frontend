/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled, { css } from 'styled-components'

interface Props {
  readonly url: string
  readonly mode?: 'fixed' | 'follow'
}

const UserAvatar: React.FC<Props> = ({ url, mode = 'fixed' }) => {
  return (
    <StyledUserAvatar mode={mode}>
      <StyledUserAvatarImage>
        <img src={ url } alt="avatar" />
      </StyledUserAvatarImage>
      <StyledUserAvatarArrow></StyledUserAvatarArrow>
    </StyledUserAvatar>
  )
}

const StyledUserAvatarFixed = css`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -160%);
  z-index: 10;
`;
const StyledUserAvatar = styled.div<{ mode: 'fixed' | 'follow' }>`
  ${(props) => (props.mode === 'fixed' ? StyledUserAvatarFixed : '' )}
`
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
    width: 176px;
    height: 176px;
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
`

export default UserAvatar

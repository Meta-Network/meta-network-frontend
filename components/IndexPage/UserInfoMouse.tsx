/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components'
import { hexGridsByFilterState } from '../../typings/metaNetwork';
import { useMount } from 'ahooks'
import { isEmpty } from 'lodash';
import { PointState } from '../../typings/node';

import UserAvatar from './UserAvatar'

const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
let ID: number

interface Props {
  readonly url: string
  readonly currentNodeMouse: hexGridsByFilterState
  readonly currentNode: hexGridsByFilterState
}

const UserInfoMouse: React.FC<Props> = React.memo( function UserInfoMouse ({ url, currentNodeMouse, currentNode }) {

  const refAvatar = useRef<HTMLDivElement>(null)

  const handleFollow = useCallback(
    () => {
      const { x, y, z } = currentNodeMouse
      if (!isEmpty(currentNodeMouse) && x && y && z) {
        const key = `x${x}_y${y}_z${z}`
        const dom = document.querySelector<HTMLElement>(`.hexagon-${key}`)

        if (dom) {
          // console.log('dom', dom, dom.getBoundingClientRect())
          let domClient = dom.getBoundingClientRect()
          let { x, y, width } = domClient
          if (refAvatar.current) {
            let avatarWidth = refAvatar!.current.clientWidth

            refAvatar!.current.style.left = `${x}px`
            refAvatar!.current.style.top = `${y}px`
            refAvatar!.current.style.transform = `translate(${(width - avatarWidth) / 2}px, -247px)`
            refAvatar!.current.style.opacity = '1'
            // console.log('refAvatar', refAvatar.current)
          }
        }
      }
      cancelAnimationFrame(ID)
      ID = requestAnimationFrame(handleFollow)
    }, [currentNodeMouse])

  useEffect(() => {
    // console.log('currentNodeMouse', currentNodeMouse, ID)

    if (isEmpty(currentNodeMouse)) {
      if (refAvatar.current) {
        refAvatar!.current.style.opacity = '0'
      }
      cancelAnimationFrame(ID)
    } else {

      // 如果当前聚焦和鼠标经过为同一个
      if (
        currentNodeMouse.x === currentNode.x
        && currentNodeMouse.y === currentNode.y
        && currentNodeMouse.z === currentNode.z
      ) {
        cancelAnimationFrame(ID)
      } else {
        cancelAnimationFrame(ID)
        ID = requestAnimationFrame(handleFollow)
      }
    }
  }, [currentNodeMouse, currentNode, handleFollow])

  return (
    <StyledUserAvatar ref={refAvatar}>
      <UserAvatar url={url}></UserAvatar>
    </StyledUserAvatar>
  )
})

const StyledUserAvatar = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  /* transform: translate(-42.845px, -250px); */
  z-index: 9;
  /* transition: all .2s; */
  opacity: 0;
`

export default UserInfoMouse

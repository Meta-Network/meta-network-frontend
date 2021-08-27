/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components'
import { hexGridsByFilterState } from '../../typings/metaNetwork';
import { useMount } from 'ahooks'
import { isEmpty } from 'lodash';
import { PointState } from '../../typings/node';

import UserAvatar from './UserAvatar'
import UserMore from './UserMore'

const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
let ID: number

interface Props {
  readonly url: string
  readonly bookmark: PointState[]
  readonly currentNode: hexGridsByFilterState
  HandleBookmark: (value: hexGridsByFilterState) => void
}

const UserInfo: React.FC<Props> = React.memo( function UserInfo ( { url, bookmark, currentNode, HandleBookmark }) {
  const refAvatar = useRef<HTMLDivElement>(null)
  const refMore = useRef<HTMLDivElement>(null)

  const handleFollow = useCallback(
    () => {
      const { x, y, z } = currentNode
      if (!isEmpty(currentNode) && x && y && z) {
        const key = `x${x}_y${y}_z${z}`
        const dom = document.querySelector<HTMLElement>(`.hexagon-${key}`)

        if (dom) {
          // console.log('dom', dom)
          // console.log('dom', dom.getBoundingClientRect())
          let domClient = dom.getBoundingClientRect()
          let { x, y, width, height } = domClient
          if (refAvatar.current) {
            // console.dir(refAvatar!.current)
            const avatarWidth = refAvatar!.current.clientWidth

            refAvatar!.current.style.left = `${x}px`
            refAvatar!.current.style.top = `${y}px`
            refAvatar!.current.style.transform = `translate(${(width - avatarWidth) / 2}px, -247px)`
            refAvatar!.current.style.opacity = '1'
            // console.log('refAvatar', refAvatar.current)
          }
          if (refMore.current) {
            const moreHeight = refMore!.current.clientHeight

            refMore!.current.style.left =`${x}px`
            refMore!.current.style.top = `${y}px`
            refMore!.current.style.transform = `translate(${width + 20}px, ${(height - moreHeight) / 2}px)`
            refMore!.current.style.opacity = '1'
            // console.log('refMore', refMore.current)
          }
        }
      }
      cancelAnimationFrame(ID)
      ID = requestAnimationFrame(handleFollow)
    }, [currentNode])

  useEffect(() => {
    console.log('currentNode', currentNode, ID)

    if (isEmpty(currentNode)) {
      if (refAvatar.current) {
        refAvatar!.current.style.opacity = '0'
      }
      if (refMore.current) {
        refMore!.current.style.opacity = '0'
      }
      cancelAnimationFrame(ID)
    } else {
      cancelAnimationFrame(ID)
      ID = requestAnimationFrame(handleFollow)
    }
  }, [currentNode, handleFollow])

  return (
    <>
      <StyledUserAvatar ref={refAvatar}>
        <UserAvatar url={url}></UserAvatar>
      </StyledUserAvatar>

      <StyledUserMore ref={refMore}>
        <UserMore bookmark={bookmark} currentNode={currentNode} HandleBookmark={HandleBookmark}></UserMore>
      </StyledUserMore>
    </>
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

const StyledUserMore = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  /* transform: translate(134.31px, 10px); */
  z-index: 9;
  /* transition: all .2s; */
  opacity: 0;
  /* @media screen and (max-width: 768px) {
    top: auto;
    bottom: 10%;
    transform: translate(-50%, 0);
  } */
`

export default UserInfo

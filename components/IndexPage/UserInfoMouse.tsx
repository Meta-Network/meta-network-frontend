/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { isEmpty } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'

import UserAvatar from './UserAvatar'
import { keyFormat } from '../../utils'

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
			if (!isEmpty(currentNodeMouse)) {
				const key = keyFormat({ x, y, z })
				const dom = document.querySelector<HTMLElement>(`.hexagon-${key}`)

				if (dom) {
					// console.log('dom', dom, dom.getBoundingClientRect())
					const domClient = dom.getBoundingClientRect()
					const { x, y, width } = domClient
					if (refAvatar.current) {
						const avatarWidth = refAvatar!.current.clientWidth

            refAvatar!.current.style.left = `${x}px`
            refAvatar!.current.style.top = `${y}px`

            if (isBrowser) {
              refAvatar!.current.style.transform = `translate(${(width - avatarWidth) / 2}px, -247px)`
            }
            if (isMobile) {
              refAvatar!.current.style.transform = `translate(${(width - avatarWidth) / 2}px, -184px)`
            }

            refAvatar!.current.style.opacity = '1'
            // console.log('refAvatar', refAvatar.current)
					}
				}
			}
		}, [currentNodeMouse])

	useEffect(() => {
		let time: NodeJS.Timeout | any = null

		if (isEmpty(currentNodeMouse)) {
			if (refAvatar.current) {
        refAvatar!.current.style.opacity = '0'
        refAvatar!.current.style.left = '-100%'
        refAvatar!.current.style.top = '-100%'
			}
			clearInterval(time)
		} else {
			// 如果当前聚焦和鼠标经过为同一个
			if (
				currentNodeMouse.x === currentNode.x
        && currentNodeMouse.y === currentNode.y
        && currentNodeMouse.z === currentNode.z
			) {
				clearInterval(time)
			} else {
				clearInterval(time)
				time = setInterval(handleFollow, 800)
			}
		}

		return () => clearInterval(time)
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
  will-change: left, top;
`

export default UserInfoMouse

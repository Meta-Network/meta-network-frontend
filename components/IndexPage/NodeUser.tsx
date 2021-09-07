import React from 'react'
import { Text } from 'react-hexgrid'

import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { strEllipsis } from '../../utils/index'


interface Props {
  readonly node: hexGridsByFilterState
  readonly isBookmark: boolean
  readonly isOwner: boolean
}

const NodeUser: React.FC<Props> = React.memo(function NodeUser({ isBookmark, node, isOwner }) {

  // console.log('NodeUser components')

  return (
    <>
    {/* 自己的坐标点 */}
    {
      isOwner ?
        <g style={{ transform: 'translate(-7px, -56px)' }}>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" className="hexagon-owner">
            <g fill="#FFF" stroke="none" fillRule="nonzero">
              <path d="M1.532 7.569c-.184 0-.36-.01-.535.002-.246.016-.451-.037-.588-.262-.146-.242-.183-1.093-.063-1.35a.977.977 0 0 1 .229-.309c1.104-.983 2.213-1.961 3.32-2.94L6.357.535c.386-.341.839-.338 1.224.003 1.925 1.703 3.85 3.405 5.777 5.107.36.32.4 1.42.089 1.763a.458.458 0 0 1-.36.161c-.224-.002-.45 0-.688 0v3.951c0 .498-.206.88-.633 1.137-.208.125-.44.167-.68.167l-8.24-.001c-.09 0-.18-.004-.268-.02-.63-.116-1.044-.622-1.045-1.277V7.568z"/><path d="M11.085 13.088H7.341l-4.498-.001c-.092 0-.202-.003-.315-.024-.753-.14-1.26-.757-1.26-1.537l-.001-2.607V7.83a6.229 6.229 0 0 0-.254.005 1.457 1.457 0 0 1-.095.004c-.33 0-.578-.132-.735-.392C-.008 7.13-.053 6.19.107 5.848c.068-.148.172-.288.292-.395.89-.793 1.8-1.595 2.678-2.372l.644-.57 1.67-1.475.79-.699c.237-.21.509-.32.785-.32.277 0 .55.111.79.323 1.827 1.617 3.716 3.287 5.776 5.107.31.275.372.814.384 1.033.01.178.018.783-.275 1.106a.718.718 0 0 1-.55.247h-.429v3.687c0 .6-.255 1.058-.76 1.363a1.54 1.54 0 0 1-.817.205zM1.198 7.3l.168.002.166.002h.264v4.221c0 .525.326.925.829 1.018.071.013.151.015.22.015h8.24v.265-.264c.225 0 .398-.041.544-.13.345-.207.506-.496.505-.91V7.306h.957a.197.197 0 0 0 .16-.074c.083-.092.157-.37.138-.722-.02-.35-.121-.59-.207-.666-2.06-1.82-3.95-3.49-5.777-5.108-.143-.126-.29-.19-.44-.19-.147 0-.293.063-.434.188l-.79.698-1.67 1.476-.645.57C2.548 4.253 1.64 5.055.75 5.847a.713.713 0 0 0-.165.224c-.024.052-.057.25-.044.557.014.307.065.497.094.544.051.085.117.138.284.138l.06-.003c.066-.004.136-.006.22-.006z"/>
            </g>
          </svg>
        </g>
        : null
    }
    <Text>
      <tspan x="0" y="-14" style={{ fontSize: 14, fontWeight: 'bold' }}>{strEllipsis(node?.userNickname || node?.username) || '暂无昵称'}</tspan>
      <tspan x="0" y="8" style={{ fontSize: 8}}>{ node?.siteName || '默认站点名'}</tspan>
      <tspan x="0" y="26" style={{ fontSize: 12, lineHeight: 24 }}>{strEllipsis(node?.userBio) || '暂无简介'}</tspan>
    </Text>
    {/* 收藏的坐标点 */}
    {
      isBookmark ?
        <g style={{ transform: 'translate(-10px, 36px)' }}>
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5.55556C4 4.69645 4.69645 4 5.55556 4H13.3333C14.1924 4 14.8889 4.69645 14.8889 5.55556V18L9.44444 15.2778L4 18V5.55556Z" fill="#FFFFFF" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </g> : null
    }
  </>
  )
})

export default NodeUser
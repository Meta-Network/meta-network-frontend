import React from 'react';
import { useWhyDidYouUpdate } from 'ahooks';

import { PointState, HexagonsState } from '../../typings/node';
import { hexGridsByFilterState, PointScopeState } from '../../typings/metaNetwork.d'
import NodeChoose from '../../components/IndexPage/NodeChoose'
import NodeUser from '../../components/IndexPage/NodeUser'

interface Props {
  readonly coordinate: PointState
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly bookmark: PointState[]
  readonly noticeBardOccupiedState: boolean
  readonly isNodeOwner: (value: PointState) => boolean
}

const NodeContent: React.FC<Props> = React.memo(function NodeContent({
  coordinate, allNodeDisabled, allNodeMap,
  allNodeChoose, defaultPoint, bookmark,
  noticeBardOccupiedState, isNodeOwner
}) {
  // useWhyDidYouUpdate('NodeContent useWhyDidYouUpdateComponent', {
  //   coordinate, allNodeDisabled, allNodeMap,
  //   allNodeChoose, defaultPoint, bookmark,
  //   noticeBardOccupiedState, isNodeOwner });

  // console.log('NodeContent')

  const { x, y, z } = coordinate

  // 禁止选择节点
  const nodeDisabledHas = allNodeDisabled.has(`${x}${y}${z}`)
  if (nodeDisabledHas) {
    return null
  }

  if (!allNodeMap.size) {
    // 没有节点
    if (x === defaultPoint.x && y === defaultPoint.y && z === defaultPoint.z) {
      return (
        <NodeChoose />
      )
    } else {
      return null
    }
  }

  const node = allNodeMap.get(`${x}${y}${z}`)
  if (node) {
    // 是否收藏
    const isBookmark = (i: PointState) =>
      i.x === node.x &&
      i.y === node.y &&
      i.z === node.z

    const isBookmarkResult = bookmark.some(isBookmark)

    return (
      <NodeUser
        node={node}
        isBookmark={isBookmarkResult}
        isOwner={isNodeOwner(node)}
      ></NodeUser>
    )
  }

  const nodeChooseHas = allNodeChoose.has(`${x}${y}${z}`)
  if (nodeChooseHas) {
    return <NodeChoose style={{ opacity: noticeBardOccupiedState ? 1 : 0 }} />
  }
  return null
})

export default NodeContent
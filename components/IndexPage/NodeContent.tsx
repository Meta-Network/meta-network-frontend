import React from 'react'
import { PointState, HexagonsState } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import NodeChoose from '../../components/IndexPage/NodeChoose'
import NodeChooseDefault from '../../components/IndexPage/NodeChooseDefault'
import NodeUser from '../../components/IndexPage/NodeUser'
import { keyFormat } from '../../utils'
import { isEmpty } from 'lodash'

interface Props {
  readonly coordinate: PointState
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly bookmark: PointState[]
  readonly isNodeOwner: (value: PointState) => boolean
  readonly hexGridsMineData: hexGridsByFilterState
}

const NodeContent: React.FC<Props> = React.memo(function NodeContent({
	coordinate, allNodeDisabled, allNodeMap,
	allNodeChoose, defaultPoint, bookmark,
	isNodeOwner, hexGridsMineData
}) {
	const { x, y, z } = coordinate

	// 禁止选择节点
	const nodeDisabledHas = allNodeDisabled.has(keyFormat(coordinate))
	if (nodeDisabledHas) {
		return null
	}

	if (!allNodeMap.size) {
		// 没有节点
		if (x === defaultPoint.x && y === defaultPoint.y && z === defaultPoint.z) {
			return <NodeChooseDefault />
		} else {
			return null
		}
	}

	const node = allNodeMap.get(keyFormat(coordinate))
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

	const nodeChooseHas = allNodeChoose.has(keyFormat(coordinate))
	// 如果已经占领了 不会显示 choose 地块
	if (nodeChooseHas && isEmpty(hexGridsMineData)) {
		return <NodeChoose />
	}
	return null
})

export default NodeContent
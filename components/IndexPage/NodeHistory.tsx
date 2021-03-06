import React, { useCallback, useMemo, FC, memo } from 'react'
import styled from 'styled-components'
import { Avatar, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useSpring, animated } from 'react-spring'
import { assign, cloneDeep, isEmpty, shuffle, random } from 'lodash'
import { useTranslation } from 'next-i18next'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { PointState } from '../../typings/node'
import { keyFormat } from '../../utils'

interface Props {
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly historyView: PointState[]
  readonly currentNode: PointState
  setCurrentNode: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  translateMap: (point: PointState, showUserInfo?: boolean) => void
  HandleHistoryView: (point: PointState) => void
}

const NodeHistory: FC<Props> = memo(function NodeHistory({
  allNodeMap, historyView, currentNode,
  setCurrentNode, translateMap, HandleHistoryView
}) {
  const { t } = useTranslation('common')

  /**
   * 历史预览列表
   */
  const historyViewList = useMemo(() => {
    let _historyView = cloneDeep(historyView)

    for (let i = 0; i < _historyView.length; i++) {
      const ele = _historyView[i]
      const { x, y, z } = ele
      const _node = allNodeMap.get(keyFormat({ x, y, z }))
      if (_node) {
        assign(ele, _node)
      }
    }
    // console.log('_historyView', _historyView)

    return _historyView as hexGridsByFilterState[]
  }, [allNodeMap, historyView])

  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 0.6 },
  })

  /**
   * 处理点击
   */
  const handleClick = useCallback(
    (e: Event, point: PointState) => {
      e.stopPropagation()
      const { x, y, z } = point

      // 重复点击垱前块
      if (currentNode.x === x && currentNode.y === y && currentNode.z === z) {
        setCurrentNode({} as hexGridsByFilterState)
      }

      translateMap({ x, y, z })
      HandleHistoryView(point)
    },
    [HandleHistoryView, currentNode, setCurrentNode, translateMap],
  )

  return (
    <StyledHistory>
      {
        historyViewList.map((i, idx) => (
          <Tooltip title={i.userNickname || i.username || t('no-nickname')} placement="bottom" key={`${i.x}${i.y}${i.z}`}>
            <StyledHistoryNode
              style={styles} onClick={(e: any) => handleClick(e, { x: i.x, y: i.y, z: i.z })}>
              <Avatar size={22 + (idx * 2)} icon={<UserOutlined />} src={i.userAvatar} />
            </StyledHistoryNode>
          </Tooltip>
        ))
      }
    </StyledHistory>
  )
}
)
const StyledHistory = styled.div`
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20px;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledHistoryNode = styled(animated.div)`
  margin: 0 6px;
  transition: all .3s;
  cursor: pointer;
  opacity: 0.6;
  @media screen and (min-width: 768px) {
    margin: 0 10px;
    &:hover {
      transform: scale(1.16);
      opacity: 1 !important;
    }
  }
  &:nth-of-type(1) {
    margin-left: 0;
  }
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
`

export default NodeHistory

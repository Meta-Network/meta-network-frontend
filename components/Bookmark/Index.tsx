import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components'
import { Avatar, Radio, Button } from 'antd';
import { UserOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { isBrowser, isMobile } from "react-device-detect"

import CustomModal from '../CustomModal/Index'
import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { SortTopIcon, SortDoneIcon } from '../Icon/Index'
interface Props {
  readonly isModalVisible: boolean,
  readonly bookmarkNode: hexGridsByFilterState[]
  setIsModalVisible: (value: boolean) => void
  translateMap: ({ x, y, z }: { x: number, y: number, z: number }) => void
  setVisibleSlider: (value: boolean) => void
  HandleRemoveBookmark: (value: hexGridsByFilterState[]) => void
}

/**
 * 收藏 Modal
 * @param param0
 * @returns
 */
const DeploySite: React.FC<Props> = ({ isModalVisible, setIsModalVisible, translateMap, bookmarkNode, setVisibleSlider, HandleRemoveBookmark }) => {
  const [selected, setSelected] = useState<boolean>(false)
  const [bookmarkNodeChecked, setBookmarkNodeChecked] = useState<boolean[]>([])

  // 监听数据 重制状态
  // selected, isModalVisible
  useEffect(() => {
    const list = bookmarkNode.map(() => false)
    setBookmarkNodeChecked(list)

    // 如果删除完了
    // 如果关闭了窗口
    if (bookmarkNode.length <= 0 || !isModalVisible) {
      setSelected(false)
    }

  }, [bookmarkNode, selected, isModalVisible])

  // 切换 单选按钮
  const toggleRadio = useCallback(
    (idx: number) => {
      let list = cloneDeep(bookmarkNodeChecked)
      list[idx] = !list[idx]
      setBookmarkNodeChecked(list)
    },
    [bookmarkNodeChecked],
  )
  // 选中全部
  const checkedAll = useCallback(
    (value: boolean) => {
      let list = bookmarkNodeChecked.map(i => i = value)
      setBookmarkNodeChecked(list)
    },
    [bookmarkNodeChecked],
  )

  // 选中统计
  const countCheck = useMemo(() => {
    return (bookmarkNodeChecked.filter(i => !!i)).length
  }, [bookmarkNodeChecked])

  // 移除选中项
  const removeChecked = useCallback(
    () => {
      if (countCheck <= 0) {
        return
      }
      const list = bookmarkNode.filter((_, idx) => bookmarkNodeChecked[idx])
      HandleRemoveBookmark(list)
    },
    [bookmarkNode, bookmarkNodeChecked, HandleRemoveBookmark, countCheck],
  )

  /**
   * 切换收藏坐标点
   * @param param0
   */
  const ToggleFn = ({ x, y, z }: { x: number, y: number, z: number }) => {
    setIsModalVisible(false)
    setVisibleSlider(false)

    translateMap({
      x: x,
      y: y,
      z: z,
    })
  }

  // 内容
  const Content: React.FC = () => {
    return (
      <>
        <StyledItemHead>
          <StyledItemHeadLeft>
            <StyledItemHeadTitle>按收藏时间</StyledItemHeadTitle>
            <SortTopIcon />
          </StyledItemHeadLeft>

          <div>
            {
              selected ?
                <StyledItemHeadSelected onClick={() => setSelected(false)}>完成</StyledItemHeadSelected> :
                (
                  // 没有数据不展示多选按钮
                  bookmarkNode.length > 0 ?
                    <StyledItemHeadIconSelected onClick={() => setSelected(true)} /> : null
                )
            }
          </div>
        </StyledItemHead>
        <StyledItem >
          {
            bookmarkNode.map((i: hexGridsByFilterState, idx: number) => (
              <StyledItemLi key={idx}>
                <Avatar size={40} src={i.userAvatar || 'https://ci.xiaohongshu.com/34249aac-c781-38cb-8de2-97199467b200?imageView2/2/w/1080/format/jpg/q/75'} icon={<UserOutlined />} />
                <StyledItemLiUser>
                  <h3>{i.userNickname || i.username || '暂无昵称'}</h3>
                  <p>{i.userBio || '暂无简介'}</p>
                </StyledItemLiUser>
                {
                  selected ?
                    <StyledItemHeadIconRadio
                      onClick={() => toggleRadio(idx)}
                      className="custom-radio"
                      checked={bookmarkNodeChecked[idx]}></StyledItemHeadIconRadio> :
                    <StyledItemLiButton
                      onClick={() => ToggleFn({
                        x: i.x,
                        y: i.y,
                        z: i.z,
                      })}>查看</StyledItemLiButton>
                }
              </StyledItemLi>
            ))
          }
        </StyledItem>
        {
          selected ?
            <StyledContentFooter>
              <Button
                className="custom-default"
                onClick={() => checkedAll(countCheck >= bookmarkNodeChecked.length ? false : true)}
              >
                {
                  countCheck >= bookmarkNodeChecked.length ? '取消全选' : '全部选中'
                }
              </Button>
              <Button className="custom-primary" onClick={removeChecked}>移除{countCheck}项</Button>
            </StyledContentFooter> : null
        }
      </>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={isMobile ? 'full' : ''}>
      <StyledContainer>
        <StyledContentHead>
          <StyledContentHeadTitle>我的收藏</StyledContentHeadTitle>
        </StyledContentHead>
        <Content></Content>
      </StyledContainer>
    </CustomModal>
  )
}

const StyledContainer = styled.section`
  color: #fff;
  height: 100%;
`

const StyledContentHead = styled.section`
  text-align: center;
  margin-bottom: 32px;
`
const StyledContentHeadTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #C4C4C4;
`
const StyledItemHead = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  box-shadow: inset 0px -1px 0px rgba(255, 255, 255, 0.1);
  user-select: none;
`
const StyledItemHeadLeft = styled.section`
  display: flex;
  align-items: center;
`

const StyledItemHeadTitle = styled.section`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #F5F5F5;
  margin-right: 12px;
`

const StyledItemHeadIconSelected = styled(SortDoneIcon)`
  color: #fff;
  cursor: pointer;
`
const StyledItemHeadSelected = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.colorGreen};
  cursor: pointer;
`

const StyledItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 204px;
  max-height: 420px;
  overflow: auto;
  @media screen and (max-width: 768px) {
    /* max-height: 340px; */
    max-height: calc(100% - 42px - 36px - 32px);
  }
`
const StyledItemLi = styled.li`
  display: flex;
  align-items: center;
  margin: 8px 0;
  padding: 10px 0;
`
const StyledItemLiUser = styled.section`
  max-width: 220px;
  margin-left: 12px;
  h3 {
    padding: 0;
    margin: 0 0 4px 0;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    text-align: left;
    color: #F5F5F5;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  p {
    padding: 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    color: #F5F5F5;
    opacity: 0.4;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`
const StyledItemLiButton = styled.button`
  margin-left: auto;
  border: 1.2px solid ${props => props.theme.colorGreen};
  box-sizing: border-box;
  border-radius: 40px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: ${props => props.theme.colorGreen};
  padding: 8px 10px;
  background-color: transparent;
  cursor: pointer;
`
const StyledItemHeadIconRadio = styled(Radio)`
  margin-left: auto;
`
const StyledContentFooter = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  background-color: #131313;
`

export default DeploySite
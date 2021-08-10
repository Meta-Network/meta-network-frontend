import React, { useState } from 'react';
import styled from 'styled-components'
import { Avatar, Radio, Button } from 'antd';
import { UserOutlined, AlignCenterOutlined } from '@ant-design/icons';

import Copy from '../Copy/Index'
import CustomModal from '../CustomModal/Index'
import { NodeState } from '../../typings/node.d'
import { hexGridsByFilterState } from '../../typings/metaNetwork.d'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  translateMap: ({ x, y, z }: { x: number, y: number, z: number }) => void
  bookmarkNode: hexGridsByFilterState[]
  setVisibleSlider: (value: boolean) => void
}

const DeploySite: React.FC<Props> = ({ isModalVisible, setIsModalVisible, translateMap, bookmarkNode, setVisibleSlider }) => {

  const [selected, setSelected] = useState<boolean>(false)

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
            <StyledItemHeadIcon />
          </StyledItemHeadLeft>

          <div>
            {
              selected ?
              <StyledItemHeadSelected onClick={ () => setSelected(false) }>完成</StyledItemHeadSelected> :
              <StyledItemHeadIconSelected onClick={ () => setSelected(true) } />
            }
          </div>
        </StyledItemHead>
        <StyledItem >
          {
            bookmarkNode.map((i: hexGridsByFilterState, idx: number) => (
              <StyledItemLi key={idx}>
                <Avatar size={40} src={''} icon={<UserOutlined />} />
                <StyledItemLiUser>
                  <h3>{ i.username || '暂无昵称' }</h3>
                  <p>{'暂无简介'}</p>
                </StyledItemLiUser>
                {
                  selected ?
                  <StyledItemHeadIconRadio></StyledItemHeadIconRadio>:
                  <StyledItemLiButton
                    onClick={ () => ToggleFn({
                      x: i.x,
                      y: i.y,
                      z: i.z,
                    }) }>查看</StyledItemLiButton>
                }
              </StyledItemLi>
            ))
          }
          {
            selected ?
            <StyledContentFooter>
              <Button className="custom-default">全部选中</Button>
              <Button className="custom-primary">移除3项</Button>
            </StyledContentFooter>: null
          }
        </StyledItem>
      </>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
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
const StyledItemHeadIcon = styled(AlignCenterOutlined)`
  color: #fff;
  cursor: pointer;
`
const StyledItemHeadIconSelected = styled(AlignCenterOutlined)`
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
  min-height: 200px;
  max-height: 420px;
  overflow: auto;
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
import React from 'react';
import styled from 'styled-components'
import Copy from '../Copy/Index'
import CustomModal from '../CustomModal/Index'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

const DeploySite: React.FC<Props> = ({ isModalVisible, setIsModalVisible }) => {
  // 内容
  const Content: React.FC = () => {
    return (
      <>
        <StyledItem >
          {
            [1, 2, 3, 4, 5, 6].map((_, i) => (
              <StyledItemLi key={i}>
                <Avatar size={40} icon={<UserOutlined />} />
                <StyledItemLiUser>
                  <h3>加菲兔</h3>
                  <p>站点名站点名站点名站点名站点名站点名站点名站点名站点名</p>
                </StyledItemLiUser>
                <StyledItemLiButton>查看</StyledItemLiButton>
              </StyledItemLi>
            ))
          }
        </StyledItem>
      </>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>我的收藏</StyledContentHeadTitle>
        </StyledContentHead>
        <Content></Content>
      </StyledContent>
    </CustomModal>
  )
}

const StyledContent = styled.section`
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
const StyledItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
  border: 1.2px solid #CAF12E;
  box-sizing: border-box;
  border-radius: 40px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #CAF12E;
  padding: 8px 10px;
  background-color: transparent;
  cursor: pointer;
`
export default DeploySite
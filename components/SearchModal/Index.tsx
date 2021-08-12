import React, { useState } from 'react';
import styled from 'styled-components'
import { Input, Avatar, Popconfirm, message, Tag } from 'antd'
import { SearchOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import CustomModal from '../CustomModal/Index'
import { InviitationsMineState } from '../../typings/ucenter'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

/**
 * 搜索 Modal
 * @param param0
 * @returns
 */
const SearchModal: React.FC<Props> = ({ isModalVisible, setIsModalVisible }) => {
  // 是否显示历史记录内容
  const [showSearch, setShowSearch] = useState<boolean>(false)

  // 内容
  const Content: React.FC = () => {
    return (
      <div>
        <Input
          placeholder="搜索"
          prefix={<SearchOutlined />}
          className="custom-search"
          onFocus={() => setShowSearch(true)}
          onBlur={() => setShowSearch(false)}
        />
        {
          showSearch ?
            <StyledContentItem>
              <StyledContentItemHead>
                <StyledContentItemHeadTitle>ID层</StyledContentItemHeadTitle>
              </StyledContentItemHead>
              <StyledItem >
                {
                  [1, 2, 3, 4, 5].map((i, idx) => (
                    <StyledItemLi key={idx}>
                      <Avatar size={40} src={'https://ci.xiaohongshu.com/34249aac-c781-38cb-8de2-97199467b200?imageView2/2/w/1080/format/jpg/q/75'} icon={<UserOutlined />} />
                      <StyledItemLiUser>
                        <h3>{'暂无昵称'}</h3>
                        <p>{'暂无简介'}</p>
                      </StyledItemLiUser>
                      <StyledItemLiButton>查看</StyledItemLiButton>
                    </StyledItemLi>
                  ))
                }
                {
                  [1].length <= 0 ? <StyledEmpty>暂无内容</StyledEmpty> : null
                }
              </StyledItem>
            </StyledContentItem> :
            <StyledContentItem>
              <StyledContentItemHead>
                <StyledContentItemHeadTitle>搜索历史</StyledContentItemHeadTitle>
                {
                  [1].length <= 0 ? null :
                  <Popconfirm placement="top" title={'确认删除历史记录'} onConfirm={() => message.info('删除')} okText="Yes" cancelText="No">
                    <StyledContentItemHeadDelete>删除</StyledContentItemHeadDelete>
                  </Popconfirm>
                }
              </StyledContentItemHead>
              <StyledContentHiitory>
                {
                  [1, 2, 3, 4, 5, 6].map((i, idx) => (
                    <Tag closable onClose={(e: any) => console.log(e)} key={idx} className="custom-tag">
                      加菲众
                    </Tag>
                  ))
                }
                {
                  [1].length <= 0 ? <StyledEmpty>暂无内容</StyledEmpty> : null
                }
              </StyledContentHiitory>
            </StyledContentItem>
        }
      </div>
    )
  }

  return (
    <CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <StyledContent>
        <StyledContentHead>
          <StyledContentHeadTitle>搜索</StyledContentHeadTitle>
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
  border: 1.2px solid #fff;
  box-sizing: border-box;
  border-radius: 40px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  padding: 8px 10px;
  background-color: transparent;
  cursor: pointer;
`

const StyledContentItem = styled.section`
  margin-top: 32px;
`
const StyledContentItemHead = styled.section`
  padding: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: .6;
`
const StyledContentItemHeadTitle = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  margin: 0;
`
const StyledContentItemHeadDelete = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #FF644F;
  margin: 0;
  cursor: pointer;
`

const StyledContentHiitory = styled.section`
  margin-top: 12px;
  & > span {
    margin-right: 16px;
    margin-bottom: 16px;
  }
`

const StyledEmpty = styled.section`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  text-align: center;
  padding: 20px 0;
`

export default SearchModal
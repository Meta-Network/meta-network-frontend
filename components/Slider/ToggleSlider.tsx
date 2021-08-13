import React, { useState, useEffect } from 'react';
import {
  MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined,
  SearchOutlined, SwapOutlined, ArrowLeftOutlined,
  LeftOutlined, BookOutlined, EnvironmentOutlined
} from '@ant-design/icons'
import { Drawer, Avatar, message, Popconfirm } from 'antd';
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useUser } from '../../hooks/useUser'
import { accountsTokenDelete } from '../../services/ucenter'
import Bookmark from '../Bookmark/Index'
import InviteCode from '../InviteCode/Index'
import SearchModal from '../SearchModal/Index'
import { hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { InviitationsMineState } from '../../typings/ucenter.d'

interface Props {
  readonly bookmarkNode: hexGridsByFilterState[]
  readonly inviteCodeData: InviitationsMineState[]
  translateMap: ({ x, y, z }: { x: number, y: number, z: number }) => void
  HandleRemoveBookmark: (value: hexGridsByFilterState[]) => void
  HandlePosition: () => void
}

const ToggleSlider: React.FC<Props> = ({ translateMap, bookmarkNode, inviteCodeData, HandleRemoveBookmark, HandlePosition }) => {

  // 显示侧边栏
  const [visibleSlider, setVisibleSlider] = useState(false);
  const { user } = useUser()
  const router = useRouter()
  // 收藏
  const [isModalVisibleBookmark, setIsModalVisibleBookmark] = useState<boolean>(false);
  // 邀请码
  const [isModalVisibleInviteCode, setIsModalVisibleInviteCode] = useState<boolean>(false);
  // 搜索
  const [isModalVisibleSearch, setIsModalVisibleSearch] = useState<boolean>(false);

  const showDrawer = () => {
    setVisibleSlider(true);
  };
  const onClose = () => {
    setVisibleSlider(false);
  };

  const signOut = async () => {
    try {
      const res = await accountsTokenDelete()
      if (res.statusCode === 200) {
        message.success('登出成功')
        router.reload()
      } else {
        message.warning(`登出失败: ${res.message}`)
      }
    } catch (e) {
      console.log(e)
      message.error('登出失败')
    }
  }

  // 侧边栏 用户内容
  const SliderContentUser: React.FC = () => {
    return (
      <StyledSliderCUser>
        <Avatar size={40} icon={<UserOutlined />} src={user?.avatar} />
        <StyledSliderCUserInfo>
          {
            isEmpty(user) ? '[未登录]' : user.nickname || user.username || '暂无昵称'
          }
        </StyledSliderCUserInfo>
        <LeftOutlined className="arrow" />
      </StyledSliderCUser>
    )
  }

  // 侧边栏 菜单 导航
  const SliderContenItemtNav: React.FC = () => {
    return (
      <StyledSliderCItem>
        <li>
          <h4>导航</h4>
        </li>
        <li>
          <a href="javascript:;" onClick={() => setIsModalVisibleSearch(true)}>
            <SearchOutlined />
            搜索
          </a>
        </li>
        <li>
          <a href="">
            <SwapOutlined />
            切换 ID层
          </a>
        </li>
        <li>
          <a href="javascript:;" onClick={() => setIsModalVisibleBookmark(true)}>
            <BookOutlined />
            我的收藏
          </a>
        </li>
      </StyledSliderCItem>
    )
  }
  // 侧边栏 菜单 用户
  const SliderContenItemtUser: React.FC = () => {
    return (
      <StyledSliderCItem>
        <li>
          <h4>个人</h4>
        </li>
        <li>
          <a href="">
            管理后台
            <ArrowLeftOutlined className="right" />
          </a>
        </li>
        <li>
          <a href="javascript:;" onClick={() => setIsModalVisibleInviteCode(true)}>
            邀请码
            <StyledCount>{inviteCodeData.length}</StyledCount>
          </a>
        </li>
      </StyledSliderCItem>
    )
  }

  // 侧边栏 内容 账户操作
  const SliderContenAccoount: React.FC = () => {
    return (
      <StyledSliderCAccount>
        {
          isEmpty(user) ?
            <>
              <li>
                <Link href="/oauth/login">
                  <a>
                    前往注册/登陆
                    <ArrowLeftOutlined className="right" /></a>
                </Link>
              </li>
            </> :
            <Popconfirm placement="top" title={'确认登出账户？'} onConfirm={signOut} okText="Yes" cancelText="No">
              <li>
                <a href="javascript:;" className="red">登出账户</a>
              </li>
            </Popconfirm>
        }
      </StyledSliderCAccount>
    )
  }

  return (
    <>
      <StyledButton onClick={showDrawer}>
        <MenuUnfoldOutlined />
      </StyledButton>
      <StyledButtonMap onClick={HandlePosition}>
        <EnvironmentOutlined />
      </StyledButtonMap>
      <StyledSlider
        title=""
        closable={false}
        onClose={onClose}
        visible={visibleSlider}
        placement="left"
      >
        <StyledSliderContent>
          <SliderContentUser></SliderContentUser>
          <SliderContenItemtNav></SliderContenItemtNav>
          <SliderContenItemtUser></SliderContenItemtUser>
          <SliderContenAccoount></SliderContenAccoount>
        </StyledSliderContent>
      </StyledSlider>
      <Bookmark
        isModalVisible={isModalVisibleBookmark}
        setIsModalVisible={setIsModalVisibleBookmark}
        translateMap={translateMap}
        bookmarkNode={bookmarkNode}
        setVisibleSlider={setVisibleSlider}
        HandleRemoveBookmark={HandleRemoveBookmark}
      ></Bookmark>
      <InviteCode
        isModalVisible={isModalVisibleInviteCode}
        setIsModalVisible={setIsModalVisibleInviteCode}
        inviteCodeData={inviteCodeData}
      ></InviteCode>
      <SearchModal
        isModalVisible={isModalVisibleSearch}
        setIsModalVisible={setIsModalVisibleSearch}
      ></SearchModal>
    </>
  )
}


const StyledButton = styled.button`
  position: fixed;
  left: 0;
  top: 74px;
  z-index: 1;
  border: none;
  border-top: 2px solid ${ props => props.theme.colorGreen };
  border-right: 2px solid ${ props => props.theme.colorGreen };
  border-bottom: 2px solid ${ props => props.theme.colorGreen };
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${ props => props.theme.fontSize4 };
  color: ${ props => props.theme.colorGreen };
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
const StyledButtonMap = styled.button`
  position: fixed;
  left: 0;
  top: 162px;
  z-index: 1;
  border: none;
  border-top: 2px solid #caa2e7;
  border-right: 2px solid #caa2e7;
  border-bottom: 2px solid #caa2e7;
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${ props => props.theme.fontSize4 };
  color: #caa2e7;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
const StyledSlider = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-content {
    background-color: #131313;
    color: #fff;
    border-right: 2px solid ${props => props.theme.colorGreen};
  }
`
const StyledSliderContent = styled.section`
  padding: 76px 0 76px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const StyledSliderCUser = styled.section`
  display: flex;
  align-items: center;
  border-right: 4px solid ${props => props.theme.colorGreen};
  padding: 8px 0;
  box-sizing: border-box;
  .arrow {
    margin-left: auto;
    margin-right: 20px;
    color: ${props => props.theme.colorGreen};
  }
`
const StyledSliderCUserInfo = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.02em;
  color: #fff;
  margin-left: 16px;
`

const StyledSliderCItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 0 0 0;
  li {
    h4 {
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 18px;
      color: rgba(196, 196, 196, 0.4);
      padding: 0 0 8px 0;
      margin: 0;
    }
    a {
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #C4C4C4;
      transition: all .2s;
      padding: 8px 0;
      text-align: left;
      &:hover {
        color: #F5F5F5;
      }
      span {
        margin-right: 8px;
        &.right {
          margin-right: 0;
          margin-left: 8px;
        }
      }
    }
  }
`

const StyledSliderCAccount = styled.ul`
  list-style: none;
  padding: 0;
  margin: auto 0 0 0;
  li {
    a {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #F5F5F5;
      transition: all .2s;
      padding: 8px 0;
      display: block;
      text-align: left;
      &:hover {
        color: ${props => props.theme.colorGreen};
        background-color: #2C2B2A;
        border-radius: 4px 0 0 4px;
      }
      &.red {
        color: ${props => props.theme.colorRed};
      }
      span {
        &.right {
          margin-left: 8px;
        }
      }
    }
  }
`

const StyledCount = styled.span`
  display: inline-block;
  background: #CAF12E;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-family: ${props => props.theme.fontFamilyEN};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #131313;
  margin-left: 30px;
`

export default ToggleSlider
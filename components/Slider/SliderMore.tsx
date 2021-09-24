import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import {
  UserOutlined,
  LeftOutlined,
  DownOutlined,
  TwitterOutlined,
  GithubOutlined,
  MediumOutlined,
  LinkOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'

import { StyledSliderMore, StyledSliderCUserInfo, StyledSliderCUserAvatar, StyledSliderBtn } from './Style'
import { UsersMeProps } from '../../typings/ucenter'
import { QuestionOutlined } from '@ant-design/icons'

interface Props {
  readonly visible: boolean
}

// 侧边栏 用户内容
const SliderMore: React.FC<Props> = React.memo(function SliderMore({
  visible
}) {
  const router = useRouter()
  const { t } = useTranslation('common')

  const MenuJson = [
    {
      title: '联络我们',
      item: [
        {
          url: 'https://twitter.com/realMetaNetwork',
          icon: TwitterOutlined,
          name: 'Twitter'
        },
        {
          url: 'https://t.me/metanetwork',
          icon: LinkOutlined,
          name: 'Telegram'
        },
        {
          url: 'https://discord.com/invite/59cXXWCWUT',
          icon: LinkOutlined,
          name: 'Discord'
        },
        {
          url: 'https://medium.com/meta-network',
          icon: MediumOutlined,
          name: 'Medium'
        },
        {
          url: 'https://github.com/Meta-Network',
          icon: GithubOutlined,
          name: 'Github'
        }
      ]
    },
    {
      title: '资源',
      item: [
        {
          url: 'https://github.com/Meta-Network',
          icon: null,
          name: '版本记录'
        }
      ]
    },
    {
      title: '友情链接',
      item: [
        {
          url: 'https://www.meta.io',
          icon: null,
          name: 'Meta.io'
        },
        {
          url: 'https://meta-space.vercel.app',
          icon: null,
          name: 'Meta Space'
        },
        {
          url: process.env.NEXT_PUBLIC_META_CMS_URL,
          icon: null,
          name: 'Meta CMS'
        },
      ]
    },
    {
      title: '政策',
      item: [
        {
          url: 'https://meta-network.mttk.net',
          icon: null,
          name: '条款'
        },
        {
          url: 'https://meta-network.mttk.net',
          icon: null,
          name: '隐私政策'
        },
      ]
    }
  ]

  const menu = (
    <Menu>
      {
        MenuJson.map((i, idx) => (
          <React.Fragment key={idx}>
            <span className="slider-title">{i.title}</span>
            {
              i.item.map((j, idxJ) => (
                <Menu.Item icon={j.icon && <j.icon />} key={idxJ}>
                  <a target="_blank" rel="noopener noreferrer" href={j.url}>
                    {j.name}
                  </a>
                </Menu.Item>
              ))
            }
            {
              idx < MenuJson.length - 1 ? <Menu.Divider /> : null
            }
          </React.Fragment>
        ))
      }
    </Menu>
  )

  return (
    <StyledSliderMore visible={visible}>
      <Dropdown overlay={menu} placement="topLeft" overlayClassName='custom-slider-more' trigger={isMobile ? ['click'] : ['hover']}>
        <StyledSliderBtn>
          <QuestionOutlined />
        </StyledSliderBtn>
      </Dropdown>
    </StyledSliderMore>
  )
})

export default SliderMore
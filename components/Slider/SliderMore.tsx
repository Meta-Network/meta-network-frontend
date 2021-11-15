import React, { useMemo } from 'react'
import { Menu, Dropdown } from 'antd'
// import {
//   UserOutlined,
//   LeftOutlined,
//   DownOutlined,
//   TwitterOutlined,
//   GithubOutlined,
//   MediumOutlined,
//   LinkOutlined
// } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'

import { StyledSliderMore, StyledSliderBtn } from './Style'
import { QuestionOutlined } from '@ant-design/icons'
// import { TelegramIcon, DiscordIcon } from '../Icon/Index'

interface Props {
  readonly visible: boolean
}

// 侧边栏 用户内容
const SliderMore: React.FC<Props> = React.memo(function SliderMore({
  visible
}) {
  const router = useRouter()
  const { t } = useTranslation('common')

  const MenuJson = useMemo(() => {
    return [
      // {
      //   title: t('contact-us'),
      //   item: [
      //     {
      //       url: 'https://twitter.com/realMetaNetwork',
      //       icon: TwitterOutlined,
      //       name: 'Twitter'
      //     },
      //     {
      //       url: 'https://t.me/metanetwork',
      //       icon: TelegramIcon,
      //       name: 'Telegram'
      //     },
      //     {
      //       url: 'https://discord.com/invite/59cXXWCWUT',
      //       icon: DiscordIcon,
      //       name: 'Discord'
      //     },
      //     {
      //       url: 'https://medium.com/meta-network',
      //       icon: MediumOutlined,
      //       name: 'Medium'
      //     },
      //     {
      //       url: 'https://github.com/Meta-Network',
      //       icon: GithubOutlined,
      //       name: 'Github'
      //     }
      //   ]
      // },
      // {
      //   title: t('resource'),
      //   item: [
      //     {
      //       url: 'https://www.matataki.io/p/10582',
      //       icon: LinkOutlined,
      //       name: t('version-record')
      //     }
      //   ]
      // },
      {
        title: t('links'),
        item: [
          {
            url: 'https://www.meta.io',
            icon: null,
            name: 'Meta.io'
          },
          {
            url: 'https://www.matataki.io',
            icon: null,
            name: 'Matataki'
          },
          // {
          //   url: 'https://meta-space.vercel.app',
          //   icon: null,
          //   name: 'Meta Space'
          // },
          // {
          //   url: process.env.NEXT_PUBLIC_META_CMS_URL,
          //   icon: null,
          //   name: 'Meta CMS'
          // },
        ]
      },
      // {
      //   title: t('policy'),
      //   item: [
      //     {
      //       url: 'https://meta-network.mttk.net',
      //       icon: LinkOutlined,
      //       name: t('terms')
      //     },
      //     {
      //       url: 'https://meta-network.mttk.net',
      //       icon: LinkOutlined,
      //       name: t('privacy-policy')
      //     },
      //   ]
      // }
    ]
  }, [ t ])

  const menu = (
    <Menu>
      {
        MenuJson.map((i, idx) => (
          <React.Fragment key={idx}>
            <span className="slider-title">{i.title}</span>
            {
              i.item.map((j, idxJ) => (
                <Menu.Item key={idxJ}>
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
import React, { useMemo } from 'react'
import { Menu, Dropdown } from 'antd'
import {
  // UserOutlined,
  // LeftOutlined,
  // DownOutlined,
  TwitterOutlined,
  // GithubOutlined,
  MediumOutlined,
  LinkOutlined,
  QuestionOutlined,
  YoutubeOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'

import { StyledSliderMore, StyledSliderBtn } from './Style'
import { TelegramIcon, DiscordIcon, ElementIcon, MetaLogoIcon } from '../Icon/Index'
import { PlayBackIcon } from '../Icon/Index'

interface Props {
  readonly visible: boolean
}

// 侧边栏 用户内容
const SliderMore: React.FC<Props> = React.memo(function SliderMore({
  visible
}) {
  const { t } = useTranslation('common')

  const MenuJson = useMemo(() => {
    return [
      {
        title: t('contact-us'),
        item: [
          {
            url: 'https://matrix.to/#/!jrjmzTFiYYIuKnRpEg:matrix.org?via=matrix.org',
            icon: <ElementIcon />,
            name: 'Matrix Group'
          },
          {
            url: 'https://discord.com/invite/59cXXWCWUT',
            icon: <DiscordIcon />,
            name: 'Discord'
          },
          {
            url: 'https://t.me/metanetwork',
            icon: <TelegramIcon />,
            name: 'Telegram'
          },
          {
            url: 'https://twitter.com/realMetaNetwork',
            icon: <TwitterOutlined />,
            name: 'Twitter'
          },
          {
            url: 'https://medium.com/meta-network',
            icon: <MediumOutlined />,
            name: 'Medium'
          },
          {
            url: 'https://www.youtube.com/channel/UC-rNon6FUm3blTnSrXta2gw',
            icon: <YoutubeOutlined />,
            name: 'Youtube'
          },
          // {
          //   url: 'https://github.com/Meta-Network',
          //   icon: GithubOutlined,
          //   name: 'Github'
          // }
        ]
      },
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
            icon: <LinkOutlined />,
            name: 'Meta.io'
          },
          {
            url: 'https://www.matataki.io',
            icon: <LinkOutlined />,
            name: 'Matataki'
          },
          {
            url: 'https://meta-grid-visualizer.vercel.app',
            icon: <PlayBackIcon />,
            name: t('slider.more.replay')
          },
          {
            url: 'https://home.metanetwork.online',
            icon: <MetaLogoIcon />,
            name: t('slider.more.home')
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
      {
        title: t('policy'),
        item: [
          {
            url: '/terms',
            icon: <LinkOutlined />,
            name: t('terms')
          },
          {
            url: '/privacy',
            icon: <LinkOutlined />,
            name: t('privacy-policy')
          },
        ]
      }
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
                <Menu.Item key={idxJ} icon={ j.icon && j.icon }>
                  <Link href={j.url}>
                    <a target="_blank" rel="noopener noreferrer" >
                      {j.name}
                    </a>
                  </Link>
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
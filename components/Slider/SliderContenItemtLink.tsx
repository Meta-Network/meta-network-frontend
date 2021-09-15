import React, { useCallback, useMemo } from 'react'
import { Tooltip, Menu, Dropdown } from 'antd'
import { isMobile } from 'react-device-detect'
import { GlobalOutlined, DownOutlined } from '@ant-design/icons'
import { StyledSliderCItem } from './Style'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LanguageProps } from '../../typings/i18n.d'

interface Props {
  readonly visible: boolean
}

const languageList = ['zh-CN', 'en-US']

// 侧边栏 菜单 用户
const SliderContenItemtLink: React.FC<Props> = React.memo(function SliderContenItemtLink({
  visible
}) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const language = useMemo((): LanguageProps => {
    return router.locale as LanguageProps
  }, [router.locale])

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>媒体</h4>
        </li> : null
      }
      <li>
        <Tooltip title={(visible || isMobile) ? '' : 'Meta Space Wiki'} placement="right">
          <a
            href="https://github.com/Meta-Network"
            target="_blank"
            rel="noopener noreferrer">
            <GlobalOutlined style={{ fontSize: 22 }} />
            {visible ? 'Meta Space Wiki' : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : 'Meta Network'} placement="right">
          <a
            href="https://meta-network.mttk.net"
            target="_blank"
            rel="noopener noreferrer">
            <GlobalOutlined style={{ fontSize: 22 }} />
            {visible ? 'Meta Network' : ''}
          </a>
        </Tooltip>
      </li>
      <li>
        <Tooltip title={(visible || isMobile) ? '' : 'Meta.io'} placement="right">
          <a
            href="https://www.meta.io"
            target="_blank"
            rel="noopener noreferrer">
            <GlobalOutlined style={{ fontSize: 22 }} />
            {visible ? 'Meta.io' : ''}
          </a>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtLink
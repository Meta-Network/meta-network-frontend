import React, { useCallback, useMemo } from 'react'
import { Tooltip, Menu, Dropdown } from 'antd'
import { isMobile } from 'react-device-detect'
import { GlobalOutlined, DownOutlined } from '@ant-design/icons'
import { StyledSliderCItem } from './Style'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LanguageProps } from '../../typings/i18n.d'
import { setCookie } from '../../utils/cookie'

interface SliderContenItemtUserProps {
  readonly visible: boolean
}

const languageList = ['en-US', 'zh-CN']
const COOKIE_NEXT_LOCALE = 'NEXT_LOCALE'
const COOKIE_NEXT_LOCALE_EXPIRES = 365

// 侧边栏 菜单 用户
const SliderContenItemtUser: React.FC<SliderContenItemtUserProps> = React.memo(function SliderContenItemtUser({
  visible
}) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const language = useMemo((): LanguageProps => {
    return router.locale as LanguageProps
  }, [router.locale])

  const menu = (
    <Menu>
      {
        languageList.map((i, idx) => (
          <Menu.Item key={idx} onClick={() => setCookie(COOKIE_NEXT_LOCALE, i, COOKIE_NEXT_LOCALE_EXPIRES)}>
            <Link
              href='/'
              passHref
              locale={i}
            >
              {t(i)}
            </Link>
          </Menu.Item>
        ))
      }
    </Menu>
  )

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>{t('settings')}</h4>
        </li> : null
      }
      <li>
        <Tooltip title={(visible || isMobile) ? '' : t('switch-language')} placement="right">
          <Dropdown overlay={menu} trigger={ isMobile ? ['click'] : ['hover'] }>
            <a href="javascript:;">
              <GlobalOutlined style={{ fontSize: 22 }} />
              {visible ? t(language) : ''}
            </a>
          </Dropdown>
        </Tooltip>
      </li>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
import React, { useCallback, useMemo } from 'react'
import { Tooltip } from 'antd'
import { isMobile } from 'react-device-detect'
import { GlobalOutlined } from '@ant-design/icons'
import { StyledSliderCItem } from './Style'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface SliderContenItemtUserProps {
  readonly visible: boolean
}

// 侧边栏 菜单 用户
const SliderContenItemtUser: React.FC<SliderContenItemtUserProps> = React.memo(function SliderContenItemtUser({
  visible
}) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const language = useMemo(() => {
    return router.locale === 'zh-CN' ? 'en-US' : 'zh-CN'
  }, [router.locale])

  return (
    <StyledSliderCItem visible={visible}>
      {
        visible ? <li>
          <h4>{t('settings')}</h4>
        </li> : null
      }
      <Link
        href='/'
        passHref
        locale={language}
      >
        <li>
          <Tooltip title={(visible || isMobile) ? '' : t('switch-language')} placement="right">
            <a href="javascript:;">
              <GlobalOutlined style={{ fontSize: 22 }} />
              {visible ? t(language) : ''}
            </a>
          </Tooltip>
        </li>
      </Link>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
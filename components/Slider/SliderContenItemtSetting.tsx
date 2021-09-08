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
  }, [ router.locale ])

  return (
    <StyledSliderCItem visible={visible}>
      <li>
        <h4>设置</h4>
      </li>
      <Link
        href='/'
        passHref
        locale={language}
      >
        <li>
          <Tooltip title={(visible || isMobile) ? '' : '切换语言'} placement="right">
            <a href="javascript:;">
              <GlobalOutlined />
              {visible ? t(language) : ''}
            </a>
          </Tooltip>
        </li>
      </Link>
    </StyledSliderCItem>
  )
})

export default SliderContenItemtUser
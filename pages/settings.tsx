import React from 'react'
import { Button, Space, Radio, RadioChangeEvent, Typography } from 'antd'
import { StoreGet, StoreSet } from '../utils/store'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { KEY_RENDER_MODE, KEY_RENDER_MODE_DEFAULT_VALUE } from '../common/config'
import { useMount } from 'ahooks'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type renderMode = 'simple' | 'full'

const { Title } = Typography

const Settings = React.memo(function Settings() {
  const router = useRouter()
  const [renderMode, setRenderMode] = React.useState<renderMode>()
  const { t } = useTranslation('common')

  const onChange = (e: RadioChangeEvent) => {
    setRenderMode(e.target.value)
    StoreSet(KEY_RENDER_MODE, e.target.value)
  }

  useMount(() => {
    const _renderMode = StoreGet(KEY_RENDER_MODE)
    setRenderMode(_renderMode || KEY_RENDER_MODE_DEFAULT_VALUE)
  })

  return (
    <StyledWrapper>
      <StyledTitle>{t('settings.systemSettings')}</StyledTitle>
      <Button
        onClick={() => router.push('/')}
        icon={<ArrowLeftOutlined />}>{t('back')}</Button>
      <StyledItem>
        <li>
          <Space>
            <span>{t('settings.systemSettings.mapRenderMode')}</span>
            <Radio.Group onChange={onChange} value={renderMode}>
              <Radio value={'simple'}>{t('settings.systemSettings.simple')}</Radio>
              <Radio value={'full'}>{t('settings.systemSettings.full')}</Radio>
            </Radio.Group>
          </Space>
        </li>
      </StyledItem>
    </StyledWrapper>
  )
})

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

const StyledWrapper = styled.section`
  max-width: 600px;
  padding: 0 20px;
  margin: 0 auto;
`

const StyledTitle = styled(Title)`
  text-align: center;
  padding: 60px 0 40px;
`

const StyledItem = styled.ul`
  margin-top: 40px;
  list-style: none;
  padding: 0;
`

export default Settings
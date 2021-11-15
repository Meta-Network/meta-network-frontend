import React from 'react'
import { Spin, Tooltip } from 'antd'
import styled from 'styled-components'
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

interface Props {
  readonly loading: boolean;
  setLoading: (val: boolean) => void;
}

const FullLoading: React.FC<Props> = ({ loading, setLoading }) => {
  const { t } = useTranslation('common')
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  return (
    <>
      {loading && <StyledWrapper>
        <Spin indicator={antIcon} tip="Loading..." />
        <Tooltip
          title={t('fullLoading.closeTip')}
        >
          <StyledClose onClick={() => setLoading(false)} />
        </Tooltip>
      </StyledWrapper>
      }
    </>
  )
}


const StyledWrapper = styled.section`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
`

const StyledClose = styled(CloseOutlined)`
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: #fff;
`

export default FullLoading

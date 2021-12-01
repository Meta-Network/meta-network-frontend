import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useTranslation } from 'next-i18next'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CircleSuccessIcon } from '../Icon/Index'

interface Props { }

const { confirm } = Modal

const NoticeBardCreateSpace: React.FC<Props> = ({ }) => {
	const { t } = useTranslation('common')
	const [styles, api] = useSpring(() => ({
		x: '-50%',
		y: -40,
		opacity: 0,
		config: {
			duration: 300
		}
	}))

	const openUrl = useCallback(
		() => {
			confirm({
				icon: <ExclamationCircleOutlined />,
				content: t('button.noticeBardCreateSpace.confirm.content'),
				okText: t('button.noticeBardCreateSpace.confirm.okText'),
				cancelText: t('button.noticeBardCreateSpace.confirm.cancelText'),
				onOk() {
					window.open(process.env.NEXT_PUBLIC_META_CMS_URL, '_blank')
				},
				onCancel() { },
			})
		}, [t])

	const show = useCallback(
		() => {
			api.start({
				y: 0,
				opacity: 1
			})
		}, [api])

	useEffect(() => {
		const time = setTimeout(show, 3000)
		return () => clearTimeout(time)
	}, [show])

	return (
		<StyledMessageRelative style={styles}>
			<StyledIconBox>
				<CircleSuccessIcon />
			</StyledIconBox>
			<StyledText>{t('occupied-success-create-space-text')}</StyledText>
			<StyledMessageButton
				status={false}
				onClick={() => openUrl()}>
				{t('set-up-now')}
			</StyledMessageButton>
		</StyledMessageRelative>
	)
}

const StyledMessageRelative = styled(animated.section)`
  position: fixed;
  background-color: #2C2B2A;
  left: 50%;
  top: 50px;
  z-index: 11;
  transform: translate(-50%, 0);
  padding: 0 0 0 16px;
  box-shadow: 0px 2px 10px 20px rgba(19, 19, 19, 0.15), inset 0px -4px 10px rgba(19, 19, 19, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: stretch;
  color: ${props => props.theme.colorGreen};
  @media screen and (max-width: 768px) {
    max-width: 92%;
    min-width: 92%;
  }
`

const StyledIconBox = styled.section`
  display: flex;
  align-items: center;
  .icon {
    width: 24px;
    height: 24px;
  }
`

const StyledText = styled.span`
  color: ${props => props.theme.colorGreen};
  /* padding-right: 40px; */
  /* padding-left: 10px; */
  padding: 8px 40px 8px 10px;
  overflow: hidden;
  white-space: nowrap;
  border-right: 1px solid #131313;
  @media screen and (max-width: 768px) {
    padding-right: 16px;
    padding-left: 12px;
    white-space: normal;
  }
`
const StyledMessageButton = styled.button<{ status: boolean }>`
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${props => props.theme.colorGreen};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  box-sizing: border-box;
  padding: 0 40px;
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color:  ${props => props.status ? '#C4C4C4' : props.theme.colorGreen};
  white-space: nowrap;
  transition: all .2s;
  border-radius: 0 12px 12px 0;
  @media screen and (max-width: 768px) {
    padding: 0 16px;
  }
  @media screen and (min-width: 768px) {
    &:hover {
      background-color: #131313;
    }
  }
`

export default NoticeBardCreateSpace
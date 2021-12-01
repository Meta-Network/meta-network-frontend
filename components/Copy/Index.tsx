import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import {
	CopyOutlined
} from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import useToast from '../../hooks/useToast'
interface Props {
  text: string,
  disabled?: boolean
}

const Copy: React.FC<Props> = ({ text, disabled = false }) => {
	const { Toast } = useToast()
	const { t } = useTranslation('common')

	const handleCopy = useCallback(
		() => {
			if (!disabled) {
				Toast({ content: t('copy-successfully-tips') })
			}
		},
		[disabled, Toast, t])

	const textInfo = useMemo(() => {
		// TODO: 暂时写死
		return t('inviteCode.shareText', {
			url: 'https://home.metanetwork.online',
			code: text
		})
	}, [text, t])

	return (
		<CopyText disabled={disabled}>
			<p>{text}</p>
			{
				disabled
					? <CopyUsed>{t('used')}</CopyUsed>
					: <CopyToClipboard text={textInfo}
						onCopy={() => handleCopy()}>
						<CopyOutlined className="copy-btn" />
					</CopyToClipboard>
			}
		</CopyText>
	)
}

const CopyText = styled.section<{ disabled: boolean }>`
  background: #2C2B2A;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  p {
    padding: 0 40px 0 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: ${props => props.disabled ? '#626262' : '#F5F5F5'};
    text-decoration: ${props => props.disabled ? 'line-through' : 'inherit'};;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .copy-btn {
    color: ${props => props.disabled ? '#626262' : props.theme.colorGreen};
  }
`
const CopyUsed = styled.span`
  font-size: 12px;
  white-space: nowrap;
  color: #626262;
`
export default Copy
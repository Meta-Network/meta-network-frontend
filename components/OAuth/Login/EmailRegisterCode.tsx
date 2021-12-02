import React, { useState, useCallback } from 'react'
import { Form, Input } from 'antd'
import { trim } from 'lodash'
import { useTranslation } from 'next-i18next'

import { EmailModeProps } from '../../../typings/oauth'
import { invitationsValidate } from '../../../services/ucenter'
import useToast from '../../../hooks/useToast'

import {
	StyledEmailForm, StyledFormItem, StyledFormBtn,
	StyledFormFlexSpaceBetween, StyledFormBtnText, StyledCodeDescription,
	StyledCodeDescriptionTitle, StyledCodeDescriptionText
} from './StyleEmail'

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
  setInviteCode: React.Dispatch<React.SetStateAction<string>>
  setEmailModeFn: (value: EmailModeProps) => void
}

const EmailRegisterCode: React.FC<Props> = ({ setStep, setInviteCode, setEmailModeFn }) => {
	const { t } = useTranslation('common')
	const [formResister] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const { Toast } = useToast()


	// 注册
	const onFinishEmail = useCallback(
		async (values: any): Promise<void> => {
			console.log('Success:', values)

			setLoading(true)
			const { inviteCode } = values
			try {
				const res = await invitationsValidate({
					invitation: trim(inviteCode),
				})
				if (res.statusCode === 200) {

					if (!res.data.exists) {
						Toast({ content: t('message-invitation-code-error'), type: 'warning' })
					}

					if (res.data.available) {
						setStep(1)
						setInviteCode(inviteCode)
					} else {
						Toast({ content: t('invalid-invitation-code'), type: 'warning' })
					}
				} else {
					console.error(res.message)
					Toast({ content: t('message-invitation-code-error'), type: 'warning' })
				}
			} catch (e: any) {
				console.error(e)
				Toast({ content: t('message-invitation-code-error'), type: 'warning' })
			} finally {
				setLoading(false)
			}
		}, [Toast, setStep, setInviteCode, t])

	const onFinishFailedEmail = (errorInfo: any): void => {
		console.log('Failed:', errorInfo)
	}


	return (
		<StyledEmailForm
			form={formResister}
			name="email-register"
			layout="vertical"
			initialValues={{ remember: false }}
			onFinish={onFinishEmail}
			onFinishFailed={onFinishFailedEmail}
		>
			<StyledFormItem
				label=""
				name="inviteCode"
				rules={[
					{ required: true, message: t('message-enter-invitation-code') },
				]}
			>
				<Input className="form-input" placeholder={t('message-enter-invitation-code')} autoComplete="new-text" />
			</StyledFormItem>
			<StyledCodeDescription>
				<StyledCodeDescriptionTitle>{t('invitation-code-help-title')}</StyledCodeDescriptionTitle>
				<StyledCodeDescriptionText
					dangerouslySetInnerHTML={{
						__html: t('invitation-code-help-rule-1', { escapeValue: false })
					}}></StyledCodeDescriptionText>
				<StyledCodeDescriptionText>2.{t('invitation-code-help-rule-2')}</StyledCodeDescriptionText>
			</StyledCodeDescription>


			<StyledFormItem>
				<StyledFormFlexSpaceBetween>
					<StyledFormBtn htmlType="submit" loading={loading}>
						{t('next')}
					</StyledFormBtn>
					<StyledFormBtnText type="button" onClick={() => setEmailModeFn('login')}>{t('log-in')}</StyledFormBtnText>
				</StyledFormFlexSpaceBetween>
			</StyledFormItem>
		</StyledEmailForm>
	)
}

export default EmailRegisterCode
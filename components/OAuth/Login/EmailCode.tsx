import React from 'react'
import styled from 'styled-components'
import { useCountDown } from 'ahooks'
import { accountsEmailVerificationCode } from '../../../services/ucenter'
import { FormInstance } from 'antd'
import { trim } from 'lodash'
import { useTranslation } from 'next-i18next'

import useToast from '../../../hooks/useToast'

interface Props {
  form: FormInstance<any>
}

const EmailCode: React.FC<Props> = ({ form }) => {
	const { t } = useTranslation('common')
	const onEnd = () => { console.log('onEnd of the time') }
	const [count, setTargetDate] = useCountDown({ onEnd: onEnd })
	const { Toast } = useToast()


	/**
 * send email code
 * @param token 
 */
	const sendEmailCode = async () => {
		const { email } = await form.getFieldsValue()
		if (!trim(email)) {
			Toast({ content: t('message-enter-email'), type: 'warning' })
			return
		}

		try {
			const { email } = await form.getFieldsValue()
			if (!trim(email)) {
				return
			}

			const res = await accountsEmailVerificationCode({
				key: trim(email),
				hcaptchaToken: 'hcaptcha_token_here'
			})
			if (res.statusCode === 201) {
				setTargetDate(Date.now() + 60 * 1000)
				Toast({ content: t('send-successfully') })
			} else {
				console.error(res.message)
				Toast({ content: t('send-faild'), type: 'warning' })
			}
		} catch (e: any) {
			console.error(e)
			if (e?.data?.statusCode === 403) {
				let seconds = 0
				if (e?.data?.error && !Number.isNaN(e?.data?.error)) {
					seconds = Math.ceil((Number(e?.data?.error) - Date.now()) / 1000)
				}
				const message = seconds ? t('message.getEmailCode.seconds', { seconds }) : t('message.getEmailCode.text')
				Toast({ content: message, type: 'warning' })
			} else if (e?.data?.statusCode === 400) {
				Toast({ content: t('message.invalidEmailAddress'), type: 'warning' })
			} else {
				Toast({ content: t('send-faild'), type: 'warning' })
				console.error(e)
			}

		}
	}

	return (
		<>
			<StyledButton
				className={count !== 0 ? 'g-red' : ''}
				type="button"
				disabled={count !== 0}
				onClick={sendEmailCode}>
				{count === 0 ? t('button.send') : `${Math.round(count / 1000)}s`}
			</StyledButton>
		</>
	)
}

const StyledButton = styled.button`
  border: none;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;
  background-color: transparent;
  color: #9b9b9f;
  position: absolute;
  right: 0;
  top: 0;
`

export default EmailCode
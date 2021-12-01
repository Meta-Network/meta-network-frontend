import React, { useState } from 'react'
import { EmailModeProps } from '../../../typings/oauth'
import EmailRegisterCode from './EmailRegisterCode'
import EmailRegisterInfo from './EmailRegisterInfo'

interface Props {
  setEmailModeFn: (value: EmailModeProps) => void
}

const Email: React.FC<Props> = ({ setEmailModeFn }) => {
	const [step, setStep] = useState<number>(0)
	const [inviteCode, setInviteCode] = useState<string>('')

	return (
		<>
			{
				step === 0 ? <EmailRegisterCode setEmailModeFn={setEmailModeFn} setStep={setStep} setInviteCode={setInviteCode} />
					: step === 1 ? <EmailRegisterInfo setEmailModeFn={setEmailModeFn} inviteCode={inviteCode} /> : null
			}
		</>
	)
}


export default Email
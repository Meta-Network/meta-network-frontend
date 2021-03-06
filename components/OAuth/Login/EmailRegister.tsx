import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import { trim } from 'lodash'
import { useRouter } from 'next/router'

import { EmailModeProps } from '../../../typings/oauth'
import { UsersMeUsernameState } from '../../../typings/ucenter.d'
import { accountsEmailVerify, accountsEmailSignup, usersMeUsername } from '../../../services/ucenter'
import EmailCode from './EmailCode'
import { CircleSuccessIcon, CircleWarningIcon } from '../../Icon/Index'
import useToast from '../../../hooks/useToast'

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
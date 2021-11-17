import React, { useRef } from 'react'
import styled from 'styled-components'
import { useCountDown } from 'ahooks'
import { accountsEmailVerificationCode } from '../../../services/ucenter'
import { FormInstance, message } from 'antd'
import { trim } from 'lodash'
import { useTranslation } from 'next-i18next'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import useToast from '../../../hooks/useToast'
import { HCaptchaConfig } from '../../../common/config'

interface Props {
  form: FormInstance<any>
  setToken: (val: string) => void
}

const EmailCode: React.FC<Props> = ({ form, setToken }) => {
  const { t } = useTranslation('common')
  const captchaRef = useRef<any>(null)

  const onEnd = () => { console.log('onEnd of the time') }
  const [count, setTargetDate] = useCountDown({ onEnd: onEnd })
  const { Toast } = useToast()

  /**
   * 发送邮箱验证码
   * @returns
   */
  const handleSendEmailCode = async () => {
    let { email } = await form.getFieldsValue()
    if (!trim(email)) {
      Toast({ content: t('message-enter-email'), type: 'warning' })
      return
    }
    if (captchaRef) {
      captchaRef.current.execute()
    } else {
      return
    }
  }

  /**
 * send email code
 * @param token 
 */
  const sendEmailCode = async (token: string) => {
    try {
      setToken(token)

      let { email } = await form.getFieldsValue()
      if (!trim(email)) {
        return
      }

      Toast({ content: `${t('send-verification-code')}...` })
      const res = await accountsEmailVerificationCode({
        key: trim(email),
        hcaptchaToken: token
      })
      if (res.statusCode === 201) {
        setTargetDate(Date.now() + 60 * 1000)
        Toast({ content: t('send-successfully') })
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.error(e)
      Toast({ content: t('send-faild'), type: 'warning' })
    }
  }

  return (
    <>
      <StyledButton
        className={count !== 0 ? 'g-red' : ''}
        type="button"
        disabled={count !== 0}
        onClick={handleSendEmailCode}>
        {count === 0 ? t('button.send') : `${Math.round(count / 1000)}s`}
      </StyledButton>
      <HCaptcha
        size="invisible"
        id="seed-email-code-hcaptcha"
        sitekey={HCaptchaConfig.sitekey}
        onVerify={sendEmailCode}
        ref={captchaRef}
        onLoad={() => console.log('onLoad')}
        onExpire={() => console.log('onExpire')}
        onError={err => console.error(err)}
      />
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
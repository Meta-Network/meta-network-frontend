import React from 'react'
import styled from 'styled-components'
import { useCountDown } from 'ahooks'
import { accountsEmailVerificationCode } from '../../../services/ucenter'
import { message } from 'antd'
import { trim } from 'lodash'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CircleSuccessIcon, CircleWarningIcon } from '../../Icon/Index'
import useToast from '../../../hooks/useToast'

interface Props {
  form: any
}

const EmailCode: React.FC<Props> = ({ form }) => {
  const onEnd = () => {
    console.log('onEnd of the time')
  }
  const [count, setTargetDate] = useCountDown({ onEnd: onEnd })
  const { Toast } = useToast()

  /**
   * 发送邮箱验证码
   * @returns
   */
  const handleSendEmailCode = async () => {
    try {
      let { email } = await form.getFieldsValue()
      if (!(email ? trim(email) : email)) {
        Toast({ content: '请输入邮箱', type: 'warning' })
        return
      }
      // 开始倒计时
      setTargetDate(Date.now() + 60 * 1000)
      Toast({ content: '发送验证码...' })
      const res = await accountsEmailVerificationCode({
        key: trim(email)
      })
      if (res.statusCode === 201) {
        Toast({ content: '发送成功' })
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e)
      Toast({ content: '发送失败', type: 'warning' })
    }
  }

  return (
    <>
      <StyledButton
        className={count !== 0 ? 'g-red' : ''}
        type="button"
        disabled={count !== 0}
        onClick={handleSendEmailCode}>
        {count === 0 ? '获取验证码' : `${Math.round(count / 1000)}s`}
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
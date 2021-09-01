import React, { useCallback } from 'react';
import { message } from 'antd';

import { CircleSuccessIcon, CircleWarningIcon } from '../components/Icon/Index'

interface ToastProps {
  duration?: number
  content: string
  type?: 'success' | 'warning'
}

/**
 * Toast
 * @returns
 */
const useToast = () => {

  const Toast = useCallback(
    async ({ duration = 3, content = '', type = 'success'  }: ToastProps) => {
      message.info({
        content: <span className="message-content">
          {
            type === 'success'
            ? <CircleSuccessIcon />
            : type === 'warning'
            ? <CircleWarningIcon />
            : null
          }
          <span>{ content }</span>
        </span>,
        className: 'custom-message',
        icon: '',
        duration: duration,
        maxCount: 1
      })
    }, [])

  return { Toast }
}

export default useToast
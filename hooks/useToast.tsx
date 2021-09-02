import React, { useCallback } from 'react';
import { message } from 'antd';

import { ToastSuccessIcon, ToastWarningIcon } from '../components/Icon/Index'

interface ToastProps {
  duration?: number
  content: string
  type?: 'success' | 'warning'
}

const key = 'toast'

/**
 * Toast
 * @returns
 */
const useToast = () => {

  const Toast = useCallback(
    async ({ duration = 3, content = '', type = 'success'  }: ToastProps) => {
      message.destroy(key)
      message.info({
        content: <span className="message-content">
          {
            type === 'success'
            ? <ToastSuccessIcon />
            : type === 'warning'
            ? <ToastWarningIcon />
            : null
          }
          <span className="content">{ content }</span>
        </span>,
        className: `custom-message${type === 'warning' ? ' warning' : ''}`,
        icon: '',
        duration: duration,
        maxCount: 1,
        key: key
      })
    }, [])

  return { Toast }
}

export default useToast
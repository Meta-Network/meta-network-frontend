import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components'
import { Form, Input, Button, message, Avatar, Upload } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { trim } from 'lodash'
import { useRouter } from 'next/router'
import { useMount } from 'ahooks'

import { axiosResult } from '../typings/request.d'
import { Storage } from '../typings/storage.d'
import { usersMePatch, storageToken, usersMe } from '../services/ucenter'
import { storageFleek } from '../services/storage'
import { CircleSuccessIcon, CircleWarningIcon } from '../components/Icon/Index'
import useToast from '../hooks/useToast'

interface Props { }

interface FileData extends File {
  response: axiosResult<Storage>,
  status: 'done' | 'uploading' | 'error'
}

interface UploadAvatar {
  file: FileData,
  fileList: File[]
}

const Update: React.FC<Props> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [token, setToken] = useState<string>('')
  const router = useRouter()
  const { Toast } = useToast()

  // 获取 Token
  const fetchToken = useCallback(
    async () => {
      try {
        const res = await storageToken()
        if (res.statusCode === 201) {
          setToken(res.data)
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    }, [])

  // 获取用户信息
  const fetchUserMe = useCallback(
    async () => {
      try {
        const res = await usersMe()
        if (res.statusCode === 200) {
          setAvatarUrl(res.data.avatar)

          const { avatar, nickname, bio } = res.data
          form.setFieldsValue({
            avatar,
            nickname,
            bio
          })
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    }, [setAvatarUrl, form])

  useMount(() => {
    fetchToken()
    fetchUserMe()
  })

  // 注册
  const onFinishEmail = useCallback(
    async (values: any): Promise<void> => {

      setLoading(true)

      console.log('Success:', values);
      let { nickname, bio } = values
      try {
        const res = await usersMePatch({
          avatar: avatarUrl!,
          nickname: trim(nickname),
          bio: trim(bio),
        })
        if (res.statusCode === 200) {
          Toast({ content: '更新成功' })
          router.push('/')
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        console.log(e)
        Toast({ content: '更新失败', type: 'warning' })
      } finally {
        setLoading(false)
      }
    },
    [router, avatarUrl],
  )

  const onFinishFailedEmail = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };

  // upload props
  const props: any = useMemo(() => ({
    name: 'file',
    action: storageFleek,
    maxCount: 1,
    headers: {
      authorization: `Bearer ${token}`,
    },
    beforeUpload(file: File) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        Toast({ content: '您只能上传 JPG/PNG 文件！', type: 'warning' })
      }
      const isLtMB = file.size / 1024 / 1024 < 6;
      if (!isLtMB) {
        Toast({ content: '图片必须小于6MB！', type: 'warning' })
      }

      return isJpgOrPng && isLtMB;
    },
    onChange(info: UploadAvatar) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.log('info', info)
        if (info.file.response.statusCode === 201) {
          Toast({ content: '上传成功' })
          setAvatarUrl(info.file.response.data.publicUrl)
        }
        // (`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        // (`${info.file.name} file upload failed.`);
      }
    }
  }), [token])

  const normFile = (e: { file: File, fileList: File[] }) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <StyledTitle>更新用户资料</StyledTitle>
      <StyledEmailForm
        form={form}
        name="email-register"
        layout="vertical"
        initialValues={{ remember: false }}
        onFinish={onFinishEmail}
        onFinishFailed={onFinishFailedEmail}
      >

        <StyledFormItem
          label=""
          name="avatar"
          getValueFromEvent={normFile}
          rules={[
            { required: false, message: '请上传头像' },
          ]}
          className="upload-avatar-form"
        >
          <Upload {...props} className="upload-avatar">
            <Avatar size={100} icon={<UserOutlined />} src={avatarUrl} />
          </Upload>
        </StyledFormItem>

        <StyledFormItem
          label=""
          name="nickname"
          rules={[
            { required: true, message: '请输入昵称' },
            { min: 1, max: 32, message: '长度 1-32' },
          ]}
        >
          <Input className="form-input" placeholder="请输入昵称" autoComplete="new-text" />
        </StyledFormItem>

        <StyledFormItem
          label=""
          name="bio"
          rules={[
            { required: true, message: '请输入简介' },
            { min: 1, max: 300, message: '长度 1-300' },
          ]}
        >
          <Input className="form-input" placeholder="请输入简介" autoComplete="new-text" />
        </StyledFormItem>

        <StyledFormItem>
          <StyledFormBtn htmlType="submit" loading={loading}>
            更新
          </StyledFormBtn>

          <StyledFormBtnBack onClick={() => router.back()}>
            返回
          </StyledFormBtnBack>
        </StyledFormItem>
      </StyledEmailForm>
    </>
  )
}

const StyledTitle = styled.h1`
  padding: 100px 0 0 0;
  text-align: center;
  font-family: ${props => props.theme.fontFamilyZH};
  font-size: ${props => props.theme.fontSize3};
  margin: 0;
`

// ----------------- form -----------------
const StyledEmailForm = styled(Form)`
  width: 400px;
  margin: 80px auto 0;
  .ant-form-item-explain.ant-form-item-explain-error {
    text-align: left;
  }

  @media screen and (max-width: 768px) {
    max-width: 90%;
  }
`

const StyledFormItem = styled(Form.Item)`
  width: 100%;

  .form-input[type="text"] {
    border: none;
    border-bottom: 1px solid #f1f1f1;
    transition: all .3s;
    border-radius: 0;
  }
  .form-input:focus,
  .form-input-password {
    box-shadow: none !important;
  }

  .form-input-password {
    border: none;
    border-bottom: 1px solid #f1f1f1;
    transition: all .3s;
    border-radius: 0;
  }
  .form-input-password:hover,
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: none !important;
  }

  .upload-avatar {
    cursor: pointer;
    .ant-upload-list {
      display: none;
    }
  }

  &.upload-avatar-form {
    text-align: center;
  }
`

const StyledFormBtn = styled(Button)`
  width: 100%;
  border: none;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 40px;

  padding: 0 30px;
  background-color: #1da1f2;
  font-weight: 600;
  color: #fff;
  transition: background-color .3s;
  &:disabled {
    cursor: not-allowed;
    background-color: #9b9b9f;
  }
  &:hover, &:focus, &:active {
    background-color: #1a91da;
    color: #fff;
  }
`
const StyledFormBtnBack = styled(Button)`
  width: 100%;
  height: 36px;
  border-radius: 20px;
  margin: 20px 0 0 0;
`
// ----------------- form -----------------

export default Update
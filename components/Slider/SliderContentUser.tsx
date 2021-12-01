import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import {
	UserOutlined,
	LeftOutlined,
	DownOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'

import { StyledSliderCUser, StyledSliderCUserInfo, StyledSliderCUserAvatar, StyledSliderCUserBox } from './Style'
import { UsersMeProps } from '../../typings/ucenter'

interface SliderContentUserProps {
  readonly isLogin: boolean
  readonly user: UsersMeProps
  readonly visible: boolean
  signOut: () => void
}

// 侧边栏 用户内容
const SliderContentUser: React.FC<SliderContentUserProps> = React.memo(function SliderContentUser({
	user, isLogin, visible,
	signOut
}) {
	const router = useRouter()
	const { t } = useTranslation('common')

	const handleClick = ({ key }: { key: string }) => {
		if (key === 'signOut') {
			signOut()
		} else if (key === 'edit') {
			router.push('/update')
		}
	}

	const menu = (
		<Menu onClick={handleClick}>
			<Menu.Item key="edit">
				{t('edit')}
			</Menu.Item>
			<Menu.Item key="signOut">
				{t('sign-out')}
			</Menu.Item>
		</Menu>
	)

	return (
		<StyledSliderCUser visible={visible}>
			{
				isLogin
					? <Dropdown overlay={menu} trigger={isMobile ? ['click'] : ['hover']}>
						<StyledSliderCUserBox>
							<StyledSliderCUserAvatar size={30} icon={<UserOutlined />} src={user?.avatar} />
							{
								visible
									? <>
										<StyledSliderCUserInfo>
											{user.nickname || user.username || t('no-nickname')}
										</StyledSliderCUserInfo>
										<DownOutlined className="arrow" />
									</>
									: null
							}
						</StyledSliderCUserBox>
					</Dropdown>
					: <Link href="/oauth/login">
						<a style={{ width: '100%', textAlign: 'center' }}>
							<StyledSliderCUserInfo style={{ marginLeft: 0 }}>
								{t('log-in')}
							</StyledSliderCUserInfo>
						</a>
					</Link>
			}
		</StyledSliderCUser>
	)
})

export default SliderContentUser
<Spin />
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
	LeftOutlined, CopyOutlined
} from '@ant-design/icons'
import { Button, Form, Input, message, Spin } from 'antd'
import Copy from '../Copy/Index'
import CustomModal from '../CustomModal/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
}

const DeploySite: React.FC<Props> = React.memo(function DeploySite ({ isModalVisible, setIsModalVisible }) {

	const [steps, setSteps] = useState<number>(0)
	const [formSiteName] = Form.useForm()

	// 步骤 0 信息提示
	const StepInfo: React.FC = () => {
		return (
			<div>
				<div style={{ marginBottom: 123 }}>
					<StyledContentText>确定在这个地块建立个人站点吗？</StyledContentText>
					<StyledContentText>每个ID仅能建立一个站点，该站点有机会迁移。</StyledContentText>
				</div>
				<StyledContentFooter>
					<Button className="custom-primary" onClick={() => setSteps(1)}>确认</Button>
					<Button className="custom-default" onClick={() => setIsModalVisible(false)}>再看看</Button>
				</StyledContentFooter>
			</div>
		)
	}

	const onFinishSiteName = (values: any) => {
		console.log('Success:', values)
		setSteps(2)
	}

	const onFinishFailedSiteName = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}

	// 步骤 1 设置站点名
	const StepSite: React.FC = () => {
		return (
			<div>
				<StyledContentText>现在，给你的个人站点取个名字。</StyledContentText>
				<StyledContentText>你将有机会修改它。</StyledContentText>
				<StyledContentSiteNameForm
					name="site"
					form={formSiteName}
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinishSiteName}
					onFinishFailed={onFinishFailedSiteName}
				>
					<Form.Item
						label="站点名"
						name="name"
						rules={[
							{ required: true, message: '请输入站点名' },
							{ max: 30, min: 1, message: '长度为1-30' },
						]}
					>
						<Input placeholder="请输入站点名" />
					</Form.Item>
					<StyledContentFooter>
						<Button className="custom-default" htmlType="submit">下一步</Button>
					</StyledContentFooter>
				</StyledContentSiteNameForm>
			</div>
		)
	}

	// 步骤 2 部署中
	const StepLoading: React.FC = () => {
		return (
			<div>
				<StyledContentText>
          Meta Network 正在生成你的专属子域名……
				</StyledContentText>
				<StyledContentLoading>
					<Spin />
				</StyledContentLoading>
			</div>
		)
	}

	// 步骤 3 部署完成
	const StepDone: React.FC = () => {
		return (
			<div>
				<StyledContentText>
          恭喜！这是你的站点 [站点名] 的站点入口链接。你的子域名是 user967
				</StyledContentText>
				<StyledContentCopyUrl>
					<Copy text="https://www.matataki.io/user967"></Copy>
				</StyledContentCopyUrl>
				<StyledContentFooter>
					<Button className="custom-primary" onClick={() => { setIsModalVisible(false); setSteps(0) }}>完成并回到主页</Button>
					<Button className="custom-default" onClick={() => message.info('即刻分享')}>即刻分享</Button>
				</StyledContentFooter>
			</div>
		)
	}

	return (
		<CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
			<StyledContent>
				<StyledContentHead>
					{
						steps === 1 ? <StyledContentHeadBack onClick={() => setSteps(0)} /> : null
					}
					<StyledContentHeadTitle>部署个人站点</StyledContentHeadTitle>
				</StyledContentHead>
				{
					steps === 0 ?
						<StepInfo></StepInfo> :
						steps === 1 ?
							<StepSite></StepSite> :
							steps === 2 ?
								<StepLoading></StepLoading> :
								steps === 3 ?
									<StepDone></StepDone> :
									null
				}
				{
					steps === 2 ?
						<div>
              测试按钮：
							<Button onClick={() => {
								let num = steps
								setSteps(--num)
							}}>prev</Button>
							<Button onClick={() => {
								let num = steps
								setSteps(++num)
							}}>next</Button>
						</div> : null
				}
			</StyledContent>
		</CustomModal>
	)
})

const StyledContent = styled.section`
  color: #fff;
`

const StyledContentHead = styled.section`
  position: relative;
  text-align: center;
  margin-bottom: 32px;
`
const StyledContentHeadTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #C4C4C4;
`
const StyledContentHeadBack = styled(LeftOutlined)`
  position: absolute;
  left: 0;
  top: 50%;
  color: #CAF12E;
  transform: translate(0, -50%);
  cursor: pointer;
`

const StyledContentCopyUrl = styled.section`
  margin: 32px 0;
  padding: 20px 0 0 0;
`

const StyledContentFooter = styled.section`
  padding: 32px 0 0 0;
  display: flex;
  justify-content: space-between;
`

const StyledContentText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #F5F5F5;
  padding: 0;
  margin: 0;
`

const StyledContentSiteNameForm = styled(Form)`
  margin: 32px 0;
  .ant-form-item-required {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: #F5F5F5;
  }
`

const StyledContentLoading = styled.section`
  text-align: center;
  min-height: 220px;
  padding: 56px 0 0 0;
`

export default DeploySite
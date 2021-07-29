import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import {
  LeftOutlined, CopyOutlined
} from '@ant-design/icons'
import { Button, Form, Input, Spin } from 'antd'

const DeploySite: React.FC<{}> = () => {

  const [steps, setSteps] = useState<number>(0);

  // 步骤 0 信息提示
  const StepInfo: React.FC = () => {
    return (
      <div>
        <p>确定在这个地块建立个人站点吗？</p>
        <p>每个ID仅能建立一个站点，该站点有机会迁移。</p>
        <StyledContentFooter>
          <Button className="custom-primary">确认</Button>
          <Button className="custom-default">再看看</Button>
        </StyledContentFooter>
      </div>
    )
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 步骤 1 设置站点名
  const StepSite: React.FC = () => {
    return (
      <div>
        <p>现在，给你的个人站点取个名字。</p>
        <p>你将有机会修改它。</p>
        <Form
          name="site"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="站点名"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
        <StyledContentFooter>
          <Button className="custom-default">下一步</Button>
        </StyledContentFooter>
      </div>
    )
  }

  // 步骤 2 部署中
  const StepLoading: React.FC = () => {
    return (
      <div>
        <p>
          Meta Network 正在生成你的专属子域名……
        </p>
        <Spin />
      </div>
    )
  }

  // 步骤 3 部署完成
  const StepDone: React.FC = () => {
    return (
      <div>
        <p>
          恭喜！这是你的站点 [站点名] 的站点入口链接。你的子域名是 user967
        </p>
        <StyledContentCopyUrl>
          <p>https://www.matataki.io/user967</p>
          <CopyOutlined className="g-green" />
        </StyledContentCopyUrl>
        <StyledContentFooter>
          <Button className="custom-primary">完成并回到主页</Button>
          <Button className="custom-default">即刻分享</Button>
        </StyledContentFooter>
      </div>
    )
  }

  return (
    <StyledContent>
      <StyledContentHead>
        {
          steps === 1 ? <StyledContentHeadBack /> : null
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
      </div>
    </StyledContent>
  )
}

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
  background: #2C2B2A;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin-top: 50px;
  p {
    padding: 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #F5F5F5;
  }
`

const StyledContentFooter = styled.section`
  padding: 32px 0 0 0;
  margin-top: 122px;
  display: flex;
  justify-content: space-between;
`
export default DeploySite
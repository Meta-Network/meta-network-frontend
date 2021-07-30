import React from 'react';
import styled from 'styled-components'
import Copy from '../Copy/Index'

const DeploySite: React.FC<{}> = () => {
  // 内容
  const Content: React.FC = () => {
    return (
      <div>
        <p>使用邀请码招呼朋友们加入元宇宙吧！一个邀请码仅能给一个ID使用。</p>
        {
          [1,1,1].map((_, idx: number) => (
            <StyledContentCopy key={idx}>
              <Copy text="48176613c75ed62fd928378605fbe0539501767c"></Copy>
            </StyledContentCopy>
          ))
        }
      </div>
    )
  }

  return (
    <StyledContent>
      <StyledContentHead>
        <StyledContentHeadTitle>你的专属邀请码</StyledContentHeadTitle>
      </StyledContentHead>
      <Content></Content>
    </StyledContent>
  )
}

const StyledContent = styled.section`
  color: #fff;
`

const StyledContentHead = styled.section`
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
const StyledContentCopy = styled.section`
  margin-top: 40px
`

export default DeploySite
import React from 'react';
import styled from 'styled-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'


interface Props {
  readonly status: boolean
  setNoticeBardOccupiedState: (value: boolean) => void
}

const NoticeBardOccupied: React.FC<Props> = ({ status, setNoticeBardOccupiedState }) => {
  return (
    <StyledMessageRelative>
      <ExclamationCircleOutlined />
      {/* 140 - 12 + 40 */}
      <StyledText>
        {
          status ? '首先，请认领一块空白的地块' : '现在就开始建立你在元宇宙网络的个人站点吧！'
        }
      </StyledText>
      <StyledMessageButton status={status} onClick={ () => setNoticeBardOccupiedState(!status) }>{ status ? '放弃创建' : '开始创建' }</StyledMessageButton>
    </StyledMessageRelative>
  )
}

const StyledMessageRelative = styled.section`
  position: fixed;
  background-color: #2C2B2A;
  left: 50%;
  top: 40px;
  z-index: 10;
  transform: translate(-50%, 0);
  padding: 0 0 0 12px;
  box-shadow: 0px 2px 10px 20px rgba(19, 19, 19, 0.15), inset 0px -4px 10px rgba(19, 19, 19, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colorGreen};
`
const StyledText = styled.span`
  color: ${props => props.theme.colorGreen};
  padding-right: 40px;
  padding-left: 10px;
  overflow: hidden;
`
const StyledMessageButton = styled.button<{ status: boolean }>`
  border-radius: 0 4px 4px 0;
  border: none;
  border-left: 1px solid #131313;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${props => props.theme.colorGreen};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  box-sizing: border-box;
  padding: 8px 40px 8px 40px;
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color:  ${props => props.status ? '#C4C4C4': props.theme.colorGreen};
`

export default NoticeBardOccupied
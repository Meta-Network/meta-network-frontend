import styled from 'styled-components'
import { animated } from 'react-spring'
import { Drawer } from 'antd';

export const StyledSliderCAccount = styled.section`
  padding: 0 18px 0 0;
  margin: auto 0 0 0;
`
export const StyledSliderCAccountButton = styled.button`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 8px 16px;
  background: #131313;
  box-shadow: inset 0px 1px 0px rgba(196, 196, 196, 0.2);
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  span {
    margin-right: 24px;
  }
`

export const StyledCount = styled.span`
  display: inline-block;
  background: #CAF12E;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-family: ${props => props.theme.fontFamilyEN};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #131313;
  margin-left: 30px;
`

export const StyledButton = styled(animated.button)`
  position: fixed;
  left: 0;
  top: 74px;
  z-index: 1;
  border: none;
  border-top: 2px solid ${props => props.theme.colorGreen};
  border-right: 2px solid ${props => props.theme.colorGreen};
  border-bottom: 2px solid ${props => props.theme.colorGreen};
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: ${props => props.theme.colorGreen};
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
export const StyledButtonMap = styled(animated.button)`
  position: fixed;
  left: 0;
  top: 162px;
  z-index: 1;
  border: none;
  border-top: 2px solid #caa2e7;
  border-right: 2px solid #caa2e7;
  border-bottom: 2px solid #caa2e7;
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: #caa2e7;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
export const StyledSlider = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-content {
    background-color: #131313;
    color: #fff;
    border-right: 2px solid ${props => props.theme.colorGreen};
  }
`
export const StyledSliderContent = styled.section`
  padding: 76px 0 76px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export const StyledSliderCUser = styled.section`
  display: flex;
  align-items: center;
  border-right: 4px solid ${props => props.theme.colorGreen};
  padding: 8px 0;
  box-sizing: border-box;
  .arrow {
    margin-left: auto;
    margin-right: 20px;
    color: ${props => props.theme.colorGreen};
  }
`
export const StyledSliderCUserInfo = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  color: #C4C4C4;
  margin-left: 12px;
`

export const StyledSliderCItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 18px 0 0;
  li {
    h4 {
      font-family: ${props => props.theme.fontFamilyZH};
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 18px;
      color: rgba(196, 196, 196, 0.4);
      padding: 0 0 8px 0;
      margin: 0;
    }
    a {
      font-family: ${props => props.theme.fontFamilyZH};
      padding: 8px 0 8px 12px;
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #C4C4C4;
      transition: all .2s;
      text-align: left;
      &:hover {
        color: ${props => props.theme.colorGreen};
        background: rgba(245, 245, 245, 0.1);
      }
      &.disabled {
        opacity: .4;
        &:hover {
          color: #C4C4C4;
          background: transparent;
        }
      }
      span {
        margin-right: 8px;
        &.right {
          margin-right: 0;
          margin-left: 8px;
        }
      }
    }
  }
`